import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import InfoCard from './InfoCard'

export default function AchievementsGallery() {
  const { profile } = useProfile()
  const [selectedId, setSelectedId] = useState(null)

  if (!profile) return null

  const achievementsSection = profile.sections?.achievements
  const achievements = profile.achievements || []
  const selected = achievements.find((item) => item.id === selectedId) || null

  if (!achievementsSection) return null

  return (
    <>
      <InfoCard
        id="achievements"
        eyebrow={achievementsSection.eyebrow}
        title={achievementsSection.title}
        description={achievementsSection.description}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-700">
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                  Image: {item.eventName}
                </div>
                <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/40" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-slate-950/85 via-slate-950/50 to-transparent px-3 pb-3 pt-8 text-xs text-slate-100 opacity-0 transition group-hover:opacity-100">
                  <span className="font-semibold">{item.eventName}</span>
                  <span className="text-[0.7rem] text-slate-200">
                    {item.client} • {item.date}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {item.client}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-slate-50">
                  {item.summary}
                </p>
              </div>
            </button>
          ))}
        </div>
      </InfoCard>

      {selected && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="w-full max-w-3xl rounded-xl border border-slate-700 bg-white shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div className="flex flex-col gap-1">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {selected.client}
                </p>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  {selected.eventName}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{selected.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Close engagement details"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="relative w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                <div className="aspect-[4/3] w-full" />
                <p className="absolute inset-0 flex items-center justify-center px-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  Corporate event / leadership session imagery placeholder
                </p>
              </div>
              <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>{selected.summary}</p>
                <p>{selected.details}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

