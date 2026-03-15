import { useProfile } from '../context/ProfileContext'
import Navbar from '../components/Navbar'
import ProfileHeader from '../components/ProfileHeader'
import DetailedAboutSection from '../components/DetailedAboutSection'

export default function AboutPage() {
  const { profile, loading } = useProfile()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
      <Navbar />
      <ProfileHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <DetailedAboutSection />
        </div>
      </main>
    </div>
  )
}
