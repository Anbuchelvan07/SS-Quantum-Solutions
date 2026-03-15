import { useProfile } from '../context/ProfileContext'
import InfoCard from './InfoCard'

export default function ExperienceTimeline() {
  const { profile } = useProfile()

  if (!profile) return null

  const experienceSection = profile.sections?.experience
  const experience = profile.experience || []

  if (!experienceSection) return null

  return (
    <InfoCard
      id="experience"
      eyebrow={experienceSection.eyebrow}
      title={experienceSection.title}
      description={experienceSection.description}
    >
      <div className="space-y-6">
        {experience.map((role) => (
          <div
            key={role.id}
            className="relative border-l-2 border-slate-200 pl-6 pb-6 last:pb-0 dark:border-slate-700"
          >
            <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-white bg-slate-400 dark:border-slate-900 dark:bg-slate-600" />
            <div className="flex flex-col gap-1">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {role.title}
              </h4>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {role.company}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                <span>{role.type}</span>
                <span>•</span>
                <span>{role.location}</span>
                <span>•</span>
                <span>
                  {role.start} – {role.end}
                </span>
              </div>
              {role.highlights && role.highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {role.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-400 dark:bg-slate-600" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  )
}
