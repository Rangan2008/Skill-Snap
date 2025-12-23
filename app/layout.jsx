import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DottedBackground from '../components/DottedBackground'

export const metadata = {
  title: 'SkillSnap — Discover Your Skill Gaps',
  description: 'Upload your resume and get a personalized roadmap to your dream job.',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  }
}

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <body>
        {/* Background placed behind all content */}
        <DottedBackground spacing={36} dotSize={2} strength={16} color="#cbd5e1" opacity={0.6} />
        <Navbar />
        <main className="min-h-screen relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}