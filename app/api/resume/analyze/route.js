import connectDB from '@/lib/db';
import ResumeAnalysis from '@/lib/models/ResumeAnalysis';
import { getUserFromRequest } from '@/lib/authServer';
import { uploadResume } from '@/lib/cloudinary';
import { analyzeResume, generateRoadmap } from '@/lib/gemini';
import { validateResumeAnalysis } from '@/lib/validation';
import { handleError, createSuccessResponse, createErrorResponse } from '@/lib/errors';

// ✅ VERCEL-SAFE: Using nodejs runtime (required for mongoose)
// We no longer parse PDFs on server (that happens client-side)
// but we still need Node.js runtime for MongoDB/mongoose
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Validate resume text quality
 * Moved from resumeParser.js for server-side validation
 */
function validateResumeText(text) {
  const trimmedText = text.trim();
  
  if (!trimmedText) {
    return {
      valid: false,
      error: 'Resume text is empty. Please ensure the file was parsed correctly.'
    };
  }
  
  if (trimmedText.length < 50) {
    return {
      valid: false,
      error: 'Resume text is too short (minimum 50 characters). Please ensure the file contains actual content.'
    };
  }
  
  if (trimmedText.length > 100000) {
    return {
      valid: false,
      error: 'Resume text is too long (maximum 100,000 characters). Please use a shorter resume.'
    };
  }
  
  // Check for common resume sections
  const hasEmail = /\S+@\S+\.\S+/.test(trimmedText);
  const hasPhone = /\+?\d{10,}/.test(trimmedText);
  const hasSections = /experience|education|skills|projects/i.test(trimmedText);
  
  if (!hasEmail && !hasPhone && !hasSections) {
    return {
      valid: true, // Still valid but warn
      warning: 'Resume may be missing standard sections (contact info, experience, skills, etc.)'
    };
  }
  
  return {
    valid: true,
    textLength: trimmedText.length
  };
}

/**
 * POST /api/resume/analyze
 * ✅ VERCEL-SAFE: Accepts extracted text instead of file
 * - Client extracts text from PDF using pdfjs-dist (browser)
 * - Server ONLY validates text and runs AI analysis
 * - No server-side PDF parsing = no crashes on Vercel
 */
export async function POST(request) {
  try {
    // Get authenticated user
    const user = await getUserFromRequest(request);

    // Parse request body (JSON, not FormData)
    const body = await request.json();
    const { resumeText, fileName, fileSize, jobRole, experienceLevel, jobDescription } = body;

    // Validate required fields
    if (!resumeText) {
      return createErrorResponse('Resume text is required. Please ensure the file was parsed correctly.', 400);
    }
    
    if (!fileName) {
      return createErrorResponse('File name is required', 400);
    }

    if (!jobRole) {
      return createErrorResponse('Job role is required', 400);
    }

    if (!experienceLevel) {
      return createErrorResponse('Experience level is required', 400);
    }

    // Validate job role and experience level
    const validation = validateResumeAnalysis({ jobRole, experienceLevel });
    if (!validation.valid) {
      return createErrorResponse(validation.errors.join(', '), 400);
    }

    console.log('📋 Received resume text:', {
      fileName,
      fileSize,
      textLength: resumeText.length,
      jobRole,
      experienceLevel
    });

    // Step 1: Validate extracted text
    console.log('✅ Validating extracted text...');
    const textValidation = validateResumeText(resumeText);
    if (!textValidation.valid) {
      return createErrorResponse(textValidation.error, 400);
    }
    
    if (textValidation.warning) {
      console.warn('⚠️', textValidation.warning);
    }
    
    console.log('✅ Text validation passed. Length:', resumeText.length, 'characters');

    // Step 2: Create a simple text buffer for Cloudinary upload
    // We'll upload the extracted text as a .txt file for record-keeping
    const textBuffer = Buffer.from(resumeText, 'utf-8');
    const uploadResult = await uploadResume(textBuffer, fileName.replace(/\.(pdf|docx?|doc)$/i, '.txt'), user._id);

    // Step 3: Analyze with Gemini AI
    console.log('🤖 Analyzing resume with AI...');
    const analysis = await analyzeResume(
      resumeText,
      jobRole,
      experienceLevel,
      jobDescription || ''
    );

    // Step 4: Generate learning roadmap
    console.log('🗺️ Generating personalized roadmap...');
    const roadmap = await generateRoadmap(
      analysis.missingSkills,
      jobRole,
      experienceLevel,
      analysis.skillsFound
    );

    // Step 5: Save to database
    console.log('💾 Saving analysis to database...');
    await connectDB();
    
    const resumeAnalysisDoc = await ResumeAnalysis.create({
      userId: user._id,
      resumeUrl: uploadResult.url,
      fileName: fileName,
      cloudinaryPublicId: uploadResult.publicId,
      jobRole,
      experienceLevel,
      jobDescription: jobDescription || null,
      analysis: {
        matchPercent: analysis.matchPercent,
        atsScore: analysis.atsScore,
        skillsFound: analysis.skillsFound,
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions,
        strengthAreas: analysis.strengthAreas,
        improvementAreas: analysis.improvementAreas
      },
      roadmap: {
        generatedAt: new Date(),
        totalEstimatedDuration: roadmap.totalEstimatedDuration,
        steps: roadmap.steps
      }
    });

    // Calculate initial progress
    resumeAnalysisDoc.calculateOverallProgress();
    await resumeAnalysisDoc.save();

    console.log('✅ Analysis complete!');

    return createSuccessResponse(
      {
        analysisId: resumeAnalysisDoc._id.toString(),
        analysis: {
          matchPercent: resumeAnalysisDoc.analysis.matchPercent,
          atsScore: resumeAnalysisDoc.analysis.atsScore,
          skillsFound: resumeAnalysisDoc.analysis.skillsFound,
          missingSkills: resumeAnalysisDoc.analysis.missingSkills,
          suggestions: resumeAnalysisDoc.analysis.suggestions,
          strengthAreas: resumeAnalysisDoc.analysis.strengthAreas,
          improvementAreas: resumeAnalysisDoc.analysis.improvementAreas
        },
        roadmap: {
          totalEstimatedDuration: resumeAnalysisDoc.roadmap.totalEstimatedDuration,
          steps: resumeAnalysisDoc.roadmap.steps,
          overallProgress: resumeAnalysisDoc.overallProgress
        },
        metadata: {
          fileName: resumeAnalysisDoc.fileName,
          jobRole: resumeAnalysisDoc.jobRole,
          experienceLevel: resumeAnalysisDoc.experienceLevel,
          createdAt: resumeAnalysisDoc.createdAt
        }
      },
      'Resume analyzed successfully',
      201
    );

  } catch (error) {
    console.error('Resume analysis error:', error);
    const errorResponse = handleError(error);
    return new Response(JSON.stringify(errorResponse.body), {
      status: errorResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
