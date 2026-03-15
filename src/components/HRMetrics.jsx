import { useProfile } from '../context/ProfileContext'
import SidebarCard from './SidebarCard'

export default function HRMetrics() {
  const { profile } = useProfile()

  if (!profile) return null

  const metricsSidebar = profile.sidebar?.metricsSidebar
  const metrics = profile.metrics ?? []
  const title = metricsSidebar?.title ?? 'HR Metrics'
  const description = metricsSidebar?.description

  return (
    <SidebarCard title={title} description={description}>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex flex-col gap-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {metric.label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-sky-700 dark:text-sky-400">
                {metric.value}
              </span>
              {metric.suffix && (
                <span className="text-sm font-semibold text-sky-700 dark:text-sky-400">
                  {metric.suffix}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {metric.description}
            </p>
          </div>
        ))}
      </div>
    </SidebarCard>
  )
}

