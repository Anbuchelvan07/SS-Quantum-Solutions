import { useProfile } from '../context/ProfileContext'
import Navbar from '../components/Navbar'
import ProfileHeader from '../components/ProfileHeader'
import ImageCarousel from '../components/ImageCarousel'

export default function ExperiencePage() {
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
      </main>
    </div>
  )
}
