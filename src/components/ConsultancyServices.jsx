import { useProfile } from '../context/ProfileContext'
import InfoCard from './InfoCard'

export default function ConsultancyServices() {
  const { profile } = useProfile()

  if (!profile) return null

  const servicesSection = profile.sections?.services
  const services = profile.services || []

  if (!servicesSection) return null

  return (
    <InfoCard
      id="services"
      eyebrow={servicesSection.eyebrow}
      title={servicesSection.title}
      description={servicesSection.description}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-sm transition-colors hover:border-sky-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-sky-500/60"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {service.title}
              </h4>
              {service.duration && (
                <span className="flex-shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                  {service.duration}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {service.description}
            </p>
            {service.outcome && (
              <div className="mt-1 border-t border-slate-200 pt-2 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Outcome:</p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                  {service.outcome}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </InfoCard>
  )
}

