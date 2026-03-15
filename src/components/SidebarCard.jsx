export default function SidebarCard({ title, description, children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {title && (
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      )}
      {description && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{description}</p>
      )}
      {children && <div className={title || description ? 'mt-4' : ''}>{children}</div>}
    </div>
  )
}
