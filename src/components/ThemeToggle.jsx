import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label={`Activate ${isDark ? 'light' : 'dark'} mode`}
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[0.6rem] text-white dark:bg-slate-100 dark:text-slate-900"
        aria-hidden="true"
      >
        {isDark ? '☾' : '☼'}
      </span>
      <span className="hidden sm:inline">
        {isDark ? 'Dark mode' : 'Light mode'}
      </span>
    </button>
  )
}

