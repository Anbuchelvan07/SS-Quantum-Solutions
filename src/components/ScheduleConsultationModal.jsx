import { useState, useEffect, useRef } from 'react'
import { appointmentApi } from '../services/api'

export default function ScheduleConsultationModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const backdropRef = useRef(null)

  // Close on Escape key & lock body scroll
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('')
      setEmail('')
      setMobile('')
      setDate('')
      setTime('')
      setConfirmed(false)
      setConfirmMsg('')
      setError('')
      setSubmitting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const isValid = name.trim() && /^\S+@\S+\.\S+$/.test(email) && mobile.trim() && date && time

  const handleConfirm = async () => {
    if (!isValid) return
    setError('')
    setSubmitting(true)

    try {
      const data = await appointmentApi.scheduleConsultation({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        date,
        time,
      })

      const formattedDate = new Date(date + 'T00:00').toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      const [h, m] = time.split(':')
      const hour = parseInt(h, 10)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const display12 = `${hour % 12 || 12}:${m} ${ampm}`

      setConfirmMsg(`Your consultation has been scheduled on ${formattedDate} at ${display12}. A confirmation email has been sent.`)
      setConfirmed(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose()
  }

  const today = new Date().toISOString().split('T')[0]

  const inputCls =
    'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-400/30'

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
    >
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:shadow-slate-950/40 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label="Close"
        >
          ✕
        </button>

        {confirmed ? (
          /* ── Success view ── */
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-900/40">
              ✓
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Consultation Confirmed
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {confirmMsg}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:ring-offset-slate-900"
            >
              Done
            </button>
          </div>
        ) : (
          /* ── Form view ── */
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                Schedule Consultation
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Fill in your details and pick a date & time.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="mb-4">
              <label htmlFor="consult-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Name
              </label>
              <input
                id="consult-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="consult-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                id="consult-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Mobile */}
            <div className="mb-4">
              <label htmlFor="consult-mobile" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mobile Number
              </label>
              <input
                id="consult-mobile"
                type="tel"
                placeholder="+91 98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Date picker */}
            <div className="mb-4">
              <label htmlFor="consult-date" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Date
              </label>
              <input
                id="consult-date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Time picker */}
            <div className="mb-6">
              <label htmlFor="consult-time" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Time
              </label>
              <input
                id="consult-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isValid || submitting}
                className="flex-1 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-900"
              >
                {submitting ? 'Booking…' : 'Confirm Appointment'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:ring-offset-slate-900"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
