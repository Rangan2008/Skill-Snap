"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { resumeApi, authApi } from '@/lib/api'
import { useRequireAuth } from '@/lib/authClient'

function formatDate(d){
  try{ return new Date(d).toLocaleString() }catch(e){ return d }
}

export default function Dashboard(){
  const { isLoading: authLoading } = useRequireAuth()
  const router = useRouter()
  const [resumes, setResumes] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile and resume history from backend
        const [profileData, resumeData] = await Promise.all([
          authApi.getProfile(),
          resumeApi.getAllAnalyses()
        ])

        setUser(profileData.data.user)
        
        // Transform backend analyses to match dashboard format
        const analyses = resumeData.data.analyses.map(analysis => ({
          id: analysis.analysisId,
          uploadedAt: analysis.createdAt,
          fileName: analysis.fileName,
          jobRole: analysis.jobRole,
          matchPercent: analysis.matchPercent,
          analysisId: analysis.analysisId
        }))
        
        setResumes(analyses)
        setLoading(false)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        setError(err.message || 'Failed to load dashboard data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const viewAnalysis = (resume) => {
    router.push(`/analysis?id=${resume.analysisId}`)
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/login" className="animated-btn animated-btn--primary">
            Go to Login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="text-sm text-gray-600">Welcome back, {user?.fullName || 'User'}!</div>
          </div>
          <div className="flex gap-3">
            <Link href="/upload-resume" className="animated-btn animated-btn--primary">
              Upload New Resume
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl">
            <div className="font-semibold">Resumes uploaded</div>
            <div className="text-3xl font-extrabold mt-3">{resumes.length}</div>
            <div className="text-sm text-gray-500 mt-2">All uploaded resume versions & analysis history</div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="font-semibold">Job preferences</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {user?.jobPreferences?.length > 0 ? (
                user.jobPreferences.map((p, i) => (
                  <div key={i} className="px-3 py-1 rounded-full border border-gray-100 text-sm">{p}</div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No preferences set</div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <Link href="/profile" className="text-primary hover:underline">
                Manage preferences
              </Link>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Current course</div>
              {user?.currentCourse && <div className="text-sm text-gray-500">{user.currentCourse.provider}</div>}
            </div>

            {user?.currentCourse ? (
              <div className="mt-3">
                <div className="text-lg font-medium">{user.currentCourse.title}</div>
                <div className="mt-2 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div style={{width:`${user.currentCourse.progress}%`}} className="h-3 bg-primary"></div>
                </div>
                <div className="text-sm text-gray-600 mt-2">Progress: {user.currentCourse.progress}%</div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-gray-500">No active course</div>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="font-semibold">Resume uploads & analyses</div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="pb-2">Uploaded</th>
                  <th className="pb-2">File</th>
                  <th className="pb-2">Job role</th>
                  <th className="pb-2">Match</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((r)=> (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="py-3 text-sm text-gray-600 w-48">{formatDate(r.uploadedAt)}</td>
                    <td className="py-3 font-medium">{r.fileName}</td>
                    <td className="py-3 text-sm text-gray-700">{r.jobRole}</td>
                    <td className="py-3 text-sm"><span className="font-semibold">{r.matchPercent}%</span></td>
                    <td className="py-3">
                      <button onClick={()=> viewAnalysis(r)} className="animated-btn animated-btn--sm">View analysis</button>
                      <Link href="/upload-resume" className="ml-2 text-sm text-gray-600">Re-analyze</Link>
                    </td>
                  </tr>
                ))}

                {resumes.length===0 && (
                  <tr><td colSpan={5} className="py-6 text-sm text-gray-500">No resume history yet. Upload a resume to get started.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  )
}