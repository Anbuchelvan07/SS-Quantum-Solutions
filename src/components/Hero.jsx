import SectionHeading from './SectionHeading.jsx'

const heroContent = {
  eyebrow: 'HR & WEB3 CONSULTANCY',
  title: 'Strategic people advisory for scaling, regulated technology organizations.',
  description:
    'I partner with founders, HR leaders, and boards to design operating models, talent strategies, and people analytics that keep pace with product, risk, and regulatory change.',
  primaryCta: 'Schedule a consultation',
  secondaryCta: 'Download capability overview',
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-slate-200 bg-slate-50/70 py-12 dark:border-slate-800 dark:bg-slate-900/60 sm:py-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <SectionHeading
            eyebrow={heroContent.eyebrow}
            title={heroContent.title}
            description={heroContent.description}
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-md bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:ring-offset-slate-900"
            >
              {heroContent.primaryCta}
            </a>
            <a
              href="#achievements"
              className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 dark:ring-offset-slate-900"
            >
              {heroContent.secondaryCta}
            </a>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
            <div>
              <dt className="font-semibold text-slate-700 dark:text-slate-100">
                Primary focus
              </dt>
              <dd>HR operating models, people analytics, and Web3 talent strategy.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700 dark:text-slate-100">
                Typical engagement
              </dt>
              <dd>8–16 week advisory and implementation projects with leadership teams.</dd>
            </div>
          </dl>
        </div>

        <aside className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Profile snapshot
          </p>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
            Over a decade of experience in HR strategy and transformation across technology,
            fintech, and Web3 organizations, helping leadership teams connect people decisions
            to product, risk, and regulatory priorities.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li>• Designed HR operating models across 5+ countries.</li>
            <li>• Led people analytics initiatives for global technology firms.</li>
            <li>• Advised Web3 protocols on talent strategy and governance.</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}

