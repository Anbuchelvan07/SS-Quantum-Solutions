import Navbar from '../components/Navbar'
import ProfileHeader from '../components/ProfileHeader'
import BitcoinMarketOverview from '../components/BitcoinMarketOverview'

export default function EngagementsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
      <Navbar />
      <ProfileHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <BitcoinMarketOverview />
      </main>
    </div>
  )
}
