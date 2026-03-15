import { useProfile } from '../context/ProfileContext'
import SidebarCard from './SidebarCard'

export default function SidebarLanguages() {
  const { profile } = useProfile()

  if (!profile) return null

  const languagesSidebar = profile.sidebar?.languagesSidebar
  const languages = profile.sidebar?.languages ?? []
  const title = languagesSidebar?.title ?? 'Languages'

  return (
    <SidebarCard title={title}>
      <div className="space-y-2 text-sm">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-200">{lang.name}</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">{lang.proficiency}</span>
          </div>
        ))}
      </div>
    </SidebarCard>
  )
}
