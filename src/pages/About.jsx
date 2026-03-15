import Navbar from '../components/Navbar.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import HRMetrics from '../components/HRMetrics.jsx'

const aboutContent = {
  overview:
    'Horizon Consulting is an independent HR and people advisory practice focused on scaling technology and Web3 organizations. The work sits at the intersection of operating model design, people analytics, and practical change management.',
  approachPoints: [
    'Start with the operating model: clarify decision rights, accountabilities, and interfaces before changing tools or structures.',
    'Use people data to inform—not override—judgement, with clear, business-relevant metrics.',
    'Design processes that are lightweight for managers and transparent for employees.',
    'Work in short, outcome-focused iterations with visible progress every few weeks.',
  ],
  profileHighlights: [
    '10+ years in HR and people strategy roles across technology, financial services, and consulting.',
    'Experience building HR and people analytics functions from zero-to-one.',
    'Hands-on exposure to Web3 organizations, including protocol, infrastructure, and ecosystem teams.',
  ],
}

export default function About() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <main className="border-b border-slate-200 bg-slate-50/60 pb-12 pt-10 dark:border-slate-800 dark:bg-slate-900/60 sm:pb-16 sm:pt-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="About"
            title="Independent HR and Web3 people advisory."
            description={aboutContent.overview}
          />

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <section>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                How engagements are structured
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {aboutContent.approachPoints.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Profile highlights
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {aboutContent.profileHighlights.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      <HRMetrics />
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>Horizon Consulting — HR & Web3 Advisory</p>
          <p className="text-[0.68rem]">
            Selected metrics are representative of advisory work and can be expanded for specific
            case studies.
          </p>
        </div>
      </footer>
    </div>
  )
}

