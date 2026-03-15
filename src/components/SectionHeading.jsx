export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment =
    align === 'center'
      ? 'items-center text-center'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left'

  return (
    <header className={`flex flex-col gap-2 ${alignment}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
          {title}
        </h2>
      )}
      {description && (
        <p className="max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
          {description}
        </p>
      )}
    </header>
  )
}

