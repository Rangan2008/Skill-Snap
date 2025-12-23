"use client"

import { useCallback, useState } from 'react'
import { UploadCloud, FileText, Briefcase, Info, Upload, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { resumeApi } from '@/lib/api'
import { useRequireAuth } from '@/lib/authClient'
import { extractResumeTextClient, isBrowserCompatible } from '@/lib/clientResumeParser'

const ACCEPTED = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

const JOB_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Mobile Developer',
  'UI/UX Designer',
  'Product Manager',
  'Data Scientist'
]

const EXPERIENCE_LEVELS = [
  { value: 'intern', label: 'Intern' },
  { value: 'entry', label: 'Entry-level' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' }
]

export default function UploadResume() {
  const { isLoading: authLoading } = useRequireAuth()
  
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('') // Store extracted text
  const [extractionWarnings, setExtractionWarnings] = useState([]) // Store warnings
  const [error, setError] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jdFile, setJdFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false) // Separate state for text extraction
  const [uploadProgress, setUploadProgress] = useState(0)

  const router = useRouter()

  const handleFiles = useCallback(async (files) => {
    setError('')
    setExtractionWarnings([])
    setExtractedText('')
    
    const f = files && files[0]
    if (!f) return
    
    // Validate file type
    if (!ACCEPTED.includes(f.type)) {
      setError('Unsupported file type. Please upload a PDF or Word document.')
      return
    }
    
    setFile(f)
    
    // ✅ CRITICAL: Extract text immediately after file selection (CLIENT-SIDE)
    // This ensures PDF parsing happens in browser, NOT on Vercel server
    setExtracting(true)
    
    try {
      console.log('🔍 Extracting text from file in browser...')
      
      // Check browser compatibility
      if (!isBrowserCompatible()) {
        throw new Error('Your browser does not support PDF parsing. Please use a modern browser like Chrome, Firefox, or Edge.')
      }
      
      const result = await extractResumeTextClient(f)
      
      // Handle files that need server-side processing (DOCX/DOC)
      if (result.requiresServerProcessing) {
        console.log('📄 File requires server processing:', result.fileType)
        setExtractedText('SERVER_PROCESSING_REQUIRED')
        setExtractionWarnings([`${result.fileType.toUpperCase()} files are processed on the server`])
        setExtracting(false)
        return
      }
      
      // Success! Text extracted client-side
      setExtractedText(result.text)
      setExtractionWarnings(result.warnings || [])
      console.log('✅ Text extracted successfully. Length:', result.text.length)
      
      if (result.warnings && result.warnings.length > 0) {
        console.warn('⚠️ Extraction warnings:', result.warnings)
      }
    } catch (err) {
      console.error('❌ Client-side extraction failed:', err)
      setError(`Failed to read resume: ${err.message}`)
      setFile(null)
    } finally {
      setExtracting(false)
    }
  }, [])

  const handleJDFiles = useCallback((files) => {
    const f = files && files[0]
    if (!f) return
    if (!ACCEPTED.includes(f.type)) {
      return
    }
    setJdFile(f)
  }, [])

  const onDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const onFileChange = (e) => handleFiles(e.target.files)
  const onJDFileChange = (e) => handleJDFiles(e.target.files)

  const isFormValid = file && extractedText && jobRole && experienceLevel && !extracting

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please upload a resume first'); return }
    if (!extractedText) { setError('Resume text extraction failed. Please try uploading again.'); return }
    if (!jobRole) { setError('Please select a job role'); return }
    if (!experienceLevel) { setError('Please select your experience level'); return }

    setLoading(true)
    setError('')
    setUploadProgress(0)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      // ✅ VERCEL-SAFE: Send ONLY extracted text to backend, NOT the file
      // Backend never parses PDF - only validates text and runs analysis
      const data = await resumeApi.analyzeText({
        resumeText: extractedText,
        fileName: file.name,
        fileSize: file.size,
        jobRole,
        experienceLevel,
        jobDescription
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      console.log('Upload response:', data)

      // Navigate to analysis page with the analysis ID
      const analysisId = data.data.analysisId
      if (!analysisId) {
        throw new Error('No analysis ID returned from server')
      }
      
      console.log('Redirecting to analysis:', analysisId)
      router.push(`/analysis?id=${analysisId}`)
    } catch (err) {
      console.error('Resume analysis error:', err)
      setError(err.message || 'Failed to analyze resume. Please try again.')
      setLoading(false)
      setUploadProgress(0)
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="max-w-7xl w-full">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Resume Upload Card */}
            <div className="glass-card p-8 rounded-2xl shadow-lg flex flex-col">
              {/* Header Section */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <UploadCloud size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Upload Your Resume</h1>
                  <p className="mt-1 text-gray-600">Upload your resume to analyze skill alignment</p>
                </div>
              </div>

              {/* Divider */}
              <div className="mt-6 border-t border-gray-100"></div>

              {/* Upload Area - Expanded */}
              <div className="flex-1 flex flex-col justify-center py-6">
                <div 
                  onDrop={onDrop} 
                  onDragOver={(e) => e.preventDefault()} 
                  role="region" 
                  aria-label="File upload dropzone" 
                  className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-primary hover:bg-gray-50/50 transition-all duration-200"
                >
                  {!file ? (
                    <label htmlFor="resume-input" className="flex flex-col items-center justify-center gap-4 cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <UploadCloud size={32} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-700">Drag & drop your resume</div>
                        <div className="mt-1 text-sm text-gray-500">or click to browse</div>
                      </div>
                      <input 
                        id="resume-input" 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="sr-only" 
                        onChange={onFileChange}
                        disabled={extracting || loading}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('resume-input').click()}
                        className="bg-primary text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={extracting || loading}
                      >
                        Browse Files
                      </button>
                      <div className="mt-2 text-xs text-gray-400">PDF, DOC, DOCX • Max 10MB</div>
                    </label>
                  ) : extracting ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                        <FileText size={32} className="text-blue-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Extracting text from PDF...</div>
                        <div className="text-sm text-gray-500 mt-1">This happens in your browser</div>
                      </div>
                      <div className="w-full max-w-xs">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <FileText size={32} className="text-green-600" />
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full max-w-sm">
                        <div className="flex items-start gap-3">
                          <FileText size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 break-all">{file.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {extractedText.length > 0 ? `${extractedText.length} characters extracted` : 'Ready for upload'}
                            </div>
                          </div>
                        </div>
                      </div>
                      {extractionWarnings.length > 0 && (
                        <div className="w-full max-w-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-yellow-800">
                              {extractionWarnings.map((warning, idx) => (
                                <div key={idx}>• {warning}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null)
                          setExtractedText('')
                          setExtractionWarnings([])
                        }}
                        className="text-sm text-red-600 hover:text-red-700 underline"
                        disabled={loading}
                      >
                        Remove file
                      </button>
                    </div>
                  )}
                  
                  {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                </div>
              </div>

              {/* File Status / Tips Section */}
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">📋 Resume Tips</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use your most recent and relevant resume</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Include a clear technical skills section</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>PDF text extraction happens in your browser (Vercel-safe)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Avoid password-protected or scanned PDFs</span>
                  </li>
                </ul>
              </div>

              {/* Divider */}
              <div className="mt-6 border-t border-gray-100"></div>

              {/* Action Area - Bottom Anchored */}
              <div className="mt-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {loading && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Analyzing resume with AI...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Analyzing skills and generating roadmap...</p>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-primary text-white px-8 py-3.5 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg hover:shadow-xl text-base"
                  disabled={!isFormValid || loading || extracting}
                >
                  {loading ? 'Analyzing...' : extracting ? 'Extracting Text...' : 'Analyze Resume'}
                </button>
                <div className="text-center">
                  <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">← Back to home</Link>
                </div>
              </div>
            </div>

            {/* Target Job Details Card */}
            <div className="glass-card p-8 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-50 text-black-600 bg-gray-400">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Target Job Details</h2>
                  <p className="mt-1 text-gray-600">Tell us the role you're aiming for to get precise skill insights</p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {/* Job Role Selector */}
                <div>
                  <label htmlFor="job-role" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="job-role"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    required
                  >
                    <option value="">Select a role</option>
                    {JOB_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Level Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {EXPERIENCE_LEVELS.map(level => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setExperienceLevel(level.value)}
                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${experienceLevel === level.value
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-primary hover:bg-gray-100'
                          }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Description Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="job-description" className="block text-sm font-medium text-gray-700">
                      Job Description <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="group relative">
                      <Info size={16} className="text-gray-400 cursor-help" />
                      <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                        Adding a job description improves skill-match accuracy by analyzing specific requirements
                      </div>
                    </div>
                  </div>
                  <textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description from the company website here..."
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                  />
                  <p className="mt-2 text-xs text-gray-500">Adding a JD improves skill-match accuracy</p>
                </div>

                {/* Optional JD Upload */}
                <div>
                  <label htmlFor="jd-file" className="block text-sm font-medium text-gray-700 mb-2">
                    Or Upload JD File <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    id="jd-file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={onJDFileChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="jd-file"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    <Upload size={18} />
                    <span className="text-sm font-medium">
                      {jdFile ? jdFile.name : 'Upload JD (PDF / DOC)'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {!isFormValid && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Please upload your resume and fill in the required fields to continue
            </p>
          )}
        </form>
      </div>
    </main>
  )
}
