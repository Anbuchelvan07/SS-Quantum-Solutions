import { useProfile } from '../context/ProfileContext'
import SidebarCard from './SidebarCard'

export default function SidebarContact() {
  const { profile } = useProfile()

  if (!profile) return null

  const contact = profile.sidebar?.contact
  if (!contact) return null

  return (
    <SidebarCard title={contact.title ?? 'Contact'} description={contact.note}>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Email</p>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 block text-slate-600 transition-colors hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
          >
            {contact.email}
          </a>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Phone</p>
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className="mt-0.5 block text-slate-600 transition-colors hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
          >
            {contact.phone}
          </a>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Location</p>
          <p className="mt-0.5 text-slate-600 dark:text-slate-300">{contact.location}</p>
        </div>
        {contact.availability && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400">{contact.availability}</p>
          </div>
        )}
      </div>
    </SidebarCard>
  )
}
