import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function ProfileHeader() {
  const { profile } = useProfile()
  const navigate = useNavigate()
  const { isAdmin, isCustomer } = useAuth()

  if (!profile) return null

  const { profile: profileData, actions } = profile

  const handlePrimaryAction = () => {
    if (isAdmin) {
      navigate('/admin')
      return
    }

    if (isCustomer) {
      navigate('/book')
      return
    }

    navigate('/customer-auth?redirect=%2Fbook')
  }

  return (
    <header className="relative border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* Cover banner */}
      <div className="relative h-48 overflow-hidden sm:h-56">
        <img
          src="/images/banner.png"
          alt="Cover banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Profile content container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:gap-6">
          {/* Circular profile photo */}
          <div className="relative flex-shrink-0">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-md dark:border-slate-950 dark:bg-slate-700 sm:h-36 sm:w-36">
              <img
                src="/images/profile.jpeg"
                alt={profileData.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Name, role, and details */}
          <div className="flex flex-1 flex-col gap-2 pb-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-50">
                {profileData.name}
              </h1>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {profileData.headline}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              {profileData.location && (
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  {profileData.location}
                </span>
              )}
              {profileData.yearsExperience && (
                <span className="flex items-center gap-1">
                  <span>💼</span>
                  {profileData.yearsExperience}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
            {actions?.primary && (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:ring-offset-slate-950"
              >
                {actions.primary.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}