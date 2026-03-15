import { useProfile } from '../context/ProfileContext'
import InfoCard from './InfoCard'

export default function EducationSection() {
  const { profile } = useProfile()

  if (!profile) return null

  const educationSection = profile.sections?.education
  const education = profile.education || []

  if (!educationSection) return null

  return (
    <InfoCard
      id="education"
      eyebrow={educationSection.eyebrow}
      title={educationSection.title}
      description={educationSection.description}
    >
      <div className="space-y-5">
        {education.map((item) => (
          <div key={item.id} className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {item.program}
            </h4>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {item.institution}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              <span>{item.location}</span>
              <span>•</span>
              <span>
                {item.start}
                {item.end !== item.start && ` – ${item.end}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  )
}
