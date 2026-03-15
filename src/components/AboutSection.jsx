import { useProfile } from '../context/ProfileContext'
import InfoCard from './InfoCard'

export default function AboutSection() {
  const { profile } = useProfile()

  if (!profile) return null

  const about = profile.sections?.about

  if (!about) return null

  return (
    <InfoCard id="about" eyebrow={about.eyebrow} title={about.title}>
      <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {about.summary.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </InfoCard>
  )
}
