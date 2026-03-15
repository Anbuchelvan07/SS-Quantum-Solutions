import { useState, useRef, useEffect } from 'react'

/**
 * ImageCarousel — full-width photo carousel with prev/next, dots, and auto-play.
 *
 * Props:
 *   images  – array of { src, alt? } objects
 */
export default function ImageCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const total = images.length

  // Auto-play every 4 s
  useEffect(() => {
    if (paused || total <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total)
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [paused, total])

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)
  const goTo = (i) => setCurrent(i)

  // Pause auto-play on hover
  const handleMouseEnter = () => setPaused(true)
  const handleMouseLeave = () => setPaused(false)

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-20 dark:border-slate-700 dark:bg-slate-800/50">
        <p className="text-sm text-slate-500 dark:text-slate-400">No photos available</p>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-black shadow-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image viewport */}
      <div className="relative aspect-[16/9] w-full">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt || `Photo ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Counter badge */}
      <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {current + 1} / {total}
      </div>

      {/* Prev / Next arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === current
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
