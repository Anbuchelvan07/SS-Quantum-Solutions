import { useProfile } from '../context/ProfileContext'
import SidebarCard from './SidebarCard'

export default function SidebarSkills() {
  const { profile } = useProfile()

  if (!profile) return null

  const skillsSidebar = profile.sidebar?.skillsSidebar
  const skills = profile.sidebar?.skills ?? []
  const title = skillsSidebar?.title ?? 'Skills'

  return (
    <SidebarCard title={title}>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </SidebarCard>
  )
}
