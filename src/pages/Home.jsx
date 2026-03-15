import { useProfile } from '../context/ProfileContext'
import Navbar from '../components/Navbar'
import ProfileHeader from '../components/ProfileHeader'
import BlockchainAboutSection from '../components/BlockchainAboutSection'
import ImageCarousel from '../components/ImageCarousel'
import ExpertiseApproachSection from '../components/ExpertiseApproachSection'

export default function Home() {
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
          <BlockchainAboutSection />
          <ImageCarousel images={[
            { src: '/images/experience/photo.jpeg', alt: 'Event photo 1' },
            { src: '/images/experience/photo2.jpeg', alt: 'Event photo 2' },
            { src: '/images/experience/photo3.jpeg', alt: 'Event photo 3' },
            { src: '/images/experience/photo4.jpeg', alt: 'Event photo 4' },
            { src: '/images/experience/photo5.jpeg', alt: 'Event photo 5' },
            { src: '/images/experience/photo6.jpeg', alt: 'Event photo 6' },
            { src: '/images/experience/photo7.jpeg', alt: 'Event photo 7' },
            { src: '/images/experience/photo8.jpeg', alt: 'Event photo 8' },
          ]} />
          <ExpertiseApproachSection />
        </div>

      </main>
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>{profile.footer?.brand || 'Horizon Consulting — HR & Web3 Advisory'}</p>
          <p className="text-[0.68rem]">
            {profile.footer?.tagline || 'Professional consultancy profile built with React and Tailwind CSS.'}
          </p>
        </div>
      </footer>
    </div>
  )
}

