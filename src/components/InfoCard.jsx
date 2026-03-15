import SectionHeading from './SectionHeading.jsx'

export default function InfoCard({
  id,
  eyebrow,
  title,
  description,
  children,
  className = '',
}) {
  return (
    <section
      id={id}
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 ${className}`}
    >
      {(eyebrow || title || description) && (
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      )}
      {children && <div className={eyebrow || title || description ? 'mt-6' : ''}>{children}</div>}
    </section>
  )
}
