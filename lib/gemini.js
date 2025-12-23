import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration
const USE_MOCK_AI = process.env.USE_MOCK_AI === 'true';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini AI (only if not using mock)
let genAI = null;
if (!USE_MOCK_AI && GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log('✅ Gemini API initialized');
} else if (USE_MOCK_AI) {
  console.log('⚠️  Using MOCK AI responses (set USE_MOCK_AI=false in .env to use real Gemini)');
} else {
  console.log('⚠️  No Gemini API key found, using MOCK AI responses');
}

/**
 * Mock AI response for resume analysis (fallback when Gemini unavailable)
 */
const mockAnalyzeResume = (resumeText, jobRole, experienceLevel) => {
  // Extract some basic info from resume text
  const skillsRegex = /\b(JavaScript|TypeScript|React|Node|Python|Java|AWS|Docker|SQL|MongoDB|Git|HTML|CSS|API|REST|GraphQL|Testing|CI\/CD|Vue|Angular|Express|Django|Flask|Kubernetes|Redis|PostgreSQL|MySQL)\b/gi;
  const foundSkills = [...new Set((resumeText.match(skillsRegex) || []).map(s => s.toLowerCase()))];
  
  const commonSkillsForRole = {
    'frontend developer': ['TypeScript', 'React', 'GraphQL', 'Testing', 'Webpack'],
    'backend developer': ['Docker', 'PostgreSQL', 'Redis', 'Microservices'],
    'full stack developer': ['TypeScript', 'GraphQL', 'Docker', 'Testing', 'CI/CD'],
    'data scientist': ['TensorFlow', 'Pandas', 'Scikit-learn', 'Statistics'],
    'devops engineer': ['Kubernetes', 'Terraform', 'Jenkins', 'Ansible']
  };
  
  const roleKey = jobRole.toLowerCase();
  const expectedSkills = commonSkillsForRole[roleKey] || ['TypeScript', 'Testing', 'CI/CD'];
  const missingSkills = expectedSkills.filter(skill => 
    !foundSkills.includes(skill.toLowerCase())
  );
  
  return {
    matchPercent: Math.min(95, 50 + (foundSkills.length * 5)),
    atsScore: Math.min(90, 60 + (resumeText.length / 100)),
    skillsFound: foundSkills.slice(0, 8),
    missingSkills: missingSkills.slice(0, 5),
    suggestions: [
      {
        category: 'keywords',
        priority: 'high',
        title: 'Add Missing Technologies',
        description: `Include ${missingSkills.slice(0, 3).join(', ')} in your skills section to better match ${jobRole} requirements.`
      },
      {
        category: 'formatting',
        priority: 'medium',
        title: 'Improve ATS Compatibility',
        description: 'Use standard section headers (Experience, Education, Skills) and avoid tables or complex formatting.'
      },
      {
        category: 'content',
        priority: 'high',
        title: 'Quantify Achievements',
        description: 'Add metrics and numbers to demonstrate impact (e.g., "Improved performance by 40%", "Managed team of 5").'
      }
    ],
    strengthAreas: foundSkills.length > 3 ? ['Technical Skills', 'Relevant Experience'] : ['Relevant Experience'],
    improvementAreas: missingSkills.length > 0 ? ['Technical Stack Coverage', 'Keyword Optimization'] : ['Keyword Optimization']
  };
};

/**
 * Mock roadmap generation (fallback when Gemini unavailable)
 */
const mockGenerateRoadmap = (missingSkills, jobRole, experienceLevel) => {
  const steps = missingSkills.slice(0, 5).map((skill, index) => ({
    stepNumber: index + 1,
    title: `Master ${skill}`,
    description: `Learn ${skill} fundamentals and apply them to ${jobRole} projects. Build hands-on experience through practical exercises.`,
    estimatedDuration: experienceLevel === 'entry' ? '3-4 weeks' : '2-3 weeks',
    skills: [skill],
    resources: [
      {
        type: 'course',
        title: `${skill} Complete Guide`,
        url: `https://www.udemy.com/topic/${skill.toLowerCase()}/`,
        provider: 'Udemy'
      },
      {
        type: 'documentation',
        title: `Official ${skill} Documentation`,
        url: `https://developer.mozilla.org/`,
        provider: 'MDN'
      },
      {
        type: 'project',
        title: `Build a ${jobRole} Project with ${skill}`,
        url: null,
        provider: 'Self-guided'
      }
    ],
    status: 'not_started',
    progressPercent: 0,
    notes: '',
    startedAt: null,
    completedAt: null
  }));
  
  const totalWeeks = steps.length * (experienceLevel === 'entry' ? 3.5 : 2.5);
  const months = Math.ceil(totalWeeks / 4);
  
  return {
    totalEstimatedDuration: `${months}-${months + 1} months`,
    steps
  };
};

/**
 * Analyze resume against job description using Gemini API
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobRole - Target job role
 * @param {string} experienceLevel - Experience level
 * @param {string} jobDescription - Optional job description
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeResume = async (resumeText, jobRole, experienceLevel, jobDescription = null) => {
  // Use mock if enabled or if Gemini not available
  if (USE_MOCK_AI || !genAI) {
    console.log('📝 Using mock AI analysis');
    return mockAnalyzeResume(resumeText, jobRole, experienceLevel);
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert resume analyzer and career advisor. Analyze the following resume for a ${experienceLevel}-level ${jobRole} position.

**Resume Content:**
${resumeText}

${jobDescription ? `**Job Description:**\n${jobDescription}\n` : ''}

**Your Task:**
Provide a comprehensive analysis in the following JSON format (respond ONLY with valid JSON, no markdown):

{
  "matchPercent": <number between 0-100>,
  "atsScore": <number between 0-100>,
  "skillsFound": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "suggestions": [
    {
      "category": "<formatting|keywords|content|structure|general>",
      "priority": "<high|medium|low>",
      "title": "<short title>",
      "description": "<detailed suggestion>"
    }
  ],
  "strengthAreas": ["area1", "area2", ...],
  "improvementAreas": ["area1", "area2", ...]
}

**Guidelines:**
- matchPercent: How well the resume matches the job requirements (0-100)
- atsScore: ATS (Applicant Tracking System) compatibility score (0-100)
- skillsFound: Technical and soft skills present in the resume relevant to the role
- missingSkills: Critical skills for the role that are missing from the resume
- suggestions: Actionable improvements categorized by type and priority
- strengthAreas: What the candidate excels at based on the resume
- improvementAreas: Areas needing improvement for the target role

Be specific, actionable, and constructive. Focus on skills relevant to ${jobRole}.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean response - remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const analysis = JSON.parse(cleanedText);
      
      // Validate and sanitize the response
      return {
        matchPercent: Math.min(100, Math.max(0, analysis.matchPercent || 50)),
        atsScore: Math.min(100, Math.max(0, analysis.atsScore || 70)),
        skillsFound: Array.isArray(analysis.skillsFound) ? analysis.skillsFound : [],
        missingSkills: Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [],
        suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
        strengthAreas: Array.isArray(analysis.strengthAreas) ? analysis.strengthAreas : [],
        improvementAreas: Array.isArray(analysis.improvementAreas) ? analysis.improvementAreas : []
      };
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanedText);
      throw new Error('Invalid response format from AI');
    }
    
  } catch (error) {
    console.error('❌ Gemini API error:', error.message);
    console.log('🔄 Falling back to mock AI analysis');
    
    // Fallback to mock on any Gemini error
    return mockAnalyzeResume(resumeText, jobRole, experienceLevel);
  }
};

/**
 * Generate personalized learning roadmap using Gemini API
 * @param {Array} missingSkills - Skills to learn
 * @param {string} jobRole - Target job role
 * @param {string} experienceLevel - Current experience level
 * @param {Array} existingSkills - Skills already possessed
 * @returns {Promise<Object>} Roadmap with learning steps
 */
export const generateRoadmap = async (missingSkills, jobRole, experienceLevel, existingSkills = []) => {
  // Use mock if enabled or if Gemini not available
  if (USE_MOCK_AI || !genAI) {
    console.log('📝 Using mock roadmap generation');
    return mockGenerateRoadmap(missingSkills, jobRole, experienceLevel);
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert career coach and learning path designer. Create a personalized learning roadmap for a ${experienceLevel}-level professional targeting a ${jobRole} position.

**Current Skills:**
${existingSkills.join(', ') || 'None specified'}

**Skills to Learn:**
${missingSkills.join(', ')}

**Your Task:**
Create a structured learning roadmap in the following JSON format (respond ONLY with valid JSON, no markdown):

{
  "totalEstimatedDuration": "<total time estimate, e.g., '3-6 months'>",
  "steps": [
    {
      "stepNumber": 1,
      "title": "<step title>",
      "description": "<detailed description of what to learn and why>",
      "estimatedDuration": "<e.g., '2 weeks', '1 month'>",
      "skills": ["skill1", "skill2"],
      "resources": [
        {
          "type": "<course|documentation|project|tutorial|book>",
          "title": "<resource title>",
          "url": "<REAL resource URL - must be valid and working>",
          "provider": "<provider name, e.g., Udemy, Coursera, MDN, YouTube, freeCodeCamp>"
        }
      ]
    }
  ]
}

**CRITICAL Guidelines:**
1. **Progressive Learning Structure (MANDATORY):**
   - Step 1-2: FUNDAMENTALS - Basic concepts, syntax, core principles for absolute beginners
   - Step 3-4: INTERMEDIATE - Practical applications, common patterns, real-world usage
   - Step 5-6: ADVANCED - Complex concepts, best practices, optimization, architecture
   - Step 7-8: MASTERY - Expert-level topics, integration, production-ready skills, advanced projects

2. **Real Resource Requirements (MANDATORY):**
   - ONLY provide URLs to resources that actually exist and are publicly accessible
   - For YouTube: Use real channel names and video topics that exist (e.g., "Traversy Media", "freeCodeCamp", "The Net Ninja")
   - For Documentation: Use official docs (e.g., https://developer.mozilla.org/, https://react.dev/, https://nodejs.org/docs/)
   - For Courses: Reference real platforms (Udemy, Coursera, freeCodeCamp, Codecademy)
   - For GitHub: Use real public repositories with learning examples
   - If unsure of exact URL, use the main domain (e.g., https://www.udemy.com/ instead of fake course URLs)

3. **Resource Diversity:**
   - Each step should have 2-4 resources
   - Mix: 60% video tutorials, 30% documentation, 10% interactive/projects
   - Prefer FREE resources (YouTube, MDN, freeCodeCamp, official docs)
   - Include at least one hands-on project or coding challenge per step

4. **Skill Progression:**
   - Start with "What is [skill]?" and "Why learn it?"
   - Progress to "How to use [skill] in real projects"
   - End with "How to master [skill] and best practices"
   - Each step should build upon previous knowledge

5. **Time Estimates:**
   - Beginners (entry): 2-4 weeks per beginner step, 3-5 weeks per advanced step
   - Intermediate (mid): 1-3 weeks per step
   - Advanced (senior): 1-2 weeks per step

6. **Provider Examples (use these exact names):**
   - YouTube channels: Traversy Media, freeCodeCamp, The Net Ninja, Web Dev Simplified, Fireship, Programming with Mosh, Academind
   - Course platforms: Udemy, Coursera, freeCodeCamp, Codecademy, Pluralsight
   - Documentation: MDN Web Docs, Official Documentation, W3Schools
   - Practice: LeetCode, HackerRank, Frontend Mentor, Exercism

Example of GOOD resources:
- "JavaScript Tutorial for Beginners" by Programming with Mosh on YouTube
- "Official React Documentation" at https://react.dev/
- "The Complete Node.js Course" on Udemy
- "TypeScript Handbook" at https://www.typescriptlang.org/docs/

Example of BAD resources (NEVER USE):
- Fake URLs or made-up course names
- Generic titles without real providers
- Non-existent documentation sites

Remember: Every URL must be real and accessible. Every step must follow beginner → intermediate → advanced progression.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean response
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const roadmap = JSON.parse(cleanedText);
      
      // Validate and set default values
      if (!roadmap.steps || !Array.isArray(roadmap.steps)) {
        throw new Error('Invalid roadmap format');
      }
      
      // Initialize progress tracking fields for each step
      roadmap.steps = roadmap.steps.map((step, index) => ({
        stepNumber: step.stepNumber || index + 1,
        title: step.title || `Step ${index + 1}`,
        description: step.description || '',
        estimatedDuration: step.estimatedDuration || '1 week',
        skills: Array.isArray(step.skills) ? step.skills : [],
        resources: Array.isArray(step.resources) ? step.resources : [],
        status: 'not_started',
        progressPercent: 0,
        notes: '',
        startedAt: null,
        completedAt: null
      }));
      
      return {
        totalEstimatedDuration: roadmap.totalEstimatedDuration || '3-6 months',
        steps: roadmap.steps
      };
      
    } catch (parseError) {
      console.error('Failed to parse Gemini roadmap response:', cleanedText);
      throw new Error('Invalid roadmap format from AI');
    }
    
  } catch (error) {
    console.error('❌ Gemini API error (roadmap):', error.message);
    console.log('🔄 Falling back to mock roadmap generation');
    
    // Fallback to mock on any Gemini error
    return mockGenerateRoadmap(missingSkills, jobRole, experienceLevel);
  }
};
