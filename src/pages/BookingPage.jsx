import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { appointmentApi } from '../services/api'

const timeOptions = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
]

function formatDateLabel(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatTimeLabel(time) {
  const [hours, minutes] = time.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${suffix}`
}

function statusClasses(status) {
  if (status === 'confirmed') return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  if (status === 'cancelled') return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
  return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
}

export default function BookingPage() {
  const { token, user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', date: '', time: '', notes: '', consultationType: 'offline' })
  const [bookedTimes, setBookedTimes] = useState([])
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setForm((current) => ({ ...current, name: user?.name || current.name }))
  }, [user?.name])

  useEffect(() => {
    let active = true

    const loadBookings = async () => {
      try {
        setLoadingBookings(true)
        const data = await appointmentApi.getMyBookings(token)
        if (active) setBookings(data)
      } catch (loadError) {
        if (active) setError(loadError.message || 'Unable to load your bookings.')
      } finally {
        if (active) setLoadingBookings(false)
      }
    }

    loadBookings()

    return () => {
      active = false
    }
  }, [token])

  useEffect(() => {
    let active = true

    const loadBookedSlots = async () => {
      if (!form.date) {
        setBookedTimes([])
        return
      }

      try {
        const nextBookedTimes = await appointmentApi.getBookedSlots(form.date)
        if (active) setBookedTimes(nextBookedTimes)
      } catch (loadError) {
        if (active) setError(loadError.message || 'Unable to load unavailable slots.')
      }
    }

    loadBookedSlots()

    return () => {
      active = false
    }
  }, [form.date])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      const booking = await appointmentApi.createBooking(token, form)
      setBookings((current) => [booking, ...current])
      setBookedTimes((current) => Array.from(new Set([...current, form.time])))
      setForm((current) => ({ ...current, date: '', time: '', notes: '', consultationType: 'offline' }))
      setMessage('Your consultation request has been submitted successfully.')
    } catch (submitError) {
      setError(submitError.message || 'Unable to create booking right now.')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">Booking</p>
            <h1 className="mt-3 text-3xl font-semibold">Schedule your consultation</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Select your preferred date and time. Your account email is attached to the booking automatically.
            </p>

            {message && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Name</span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  />
                </label>

                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Email</span>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Choose date</span>
                  <input
                    type="date"
                    required
                    min={today}
                    value={form.date}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value, time: '' }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  />
                </label>

                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Choose time</span>
                  <select
                    required
                    value={form.time}
                    onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  >
                    <option value="">Select a time slot</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time} disabled={bookedTimes.includes(time)}>
                        {formatTimeLabel(time)}{bookedTimes.includes(time) ? ' - unavailable' : ''}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="col-span-full">
                <p className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Consultation Type</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-slate-300 p-4 transition hover:border-sky-400 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 dark:border-slate-700 dark:hover:border-sky-400 dark:has-[:checked]:border-sky-500 dark:has-[:checked]:bg-sky-950/20">
                    <input
                      type="radio"
                      name="consultationType"
                      value="offline"
                      checked={form.consultationType === 'offline'}
                      onChange={(event) => setForm((current) => ({ ...current, consultationType: event.target.value }))}
                      className="mt-1"
                    />
                    <div>
                      <span className="block font-medium text-slate-900 dark:text-slate-50">Offline (In-Person)</span>
                      <span className="block text-xs text-slate-600 dark:text-slate-400">Physical consultation at your office</span>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-slate-300 p-4 transition hover:border-sky-400 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 dark:border-slate-700 dark:hover:border-sky-400 dark:has-[:checked]:border-sky-500 dark:has-[:checked]:bg-sky-950/20">
                    <input
                      type="radio"
                      name="consultationType"
                      value="online"
                      checked={form.consultationType === 'online'}
                      onChange={(event) => setForm((current) => ({ ...current, consultationType: event.target.value }))}
                      className="mt-1"
                    />
                    <div>
                      <span className="block font-medium text-slate-900 dark:text-slate-50">Online (Google Meet)</span>
                      <span className="block text-xs text-slate-600 dark:text-slate-400">Virtual meeting via Google Meet</span>
                    </div>
                  </label>
                </div>
              </div>

              <label className="block text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Message or notes</span>
                <textarea
                  rows={5}
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="Share your goals, questions, or preferred discussion topics."
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400 sm:w-fit"
              >
                {submitting ? 'Submitting booking...' : 'Confirm consultation booking'}
              </button>
            </form>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Your bookings</p>
                <h2 className="mt-2 text-2xl font-semibold">Current requests</h2>
              </div>
            </div>

            {loadingBookings ? (
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Loading your bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No consultations booked yet.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {bookings.map((booking) => (
                  <article key={booking._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">{formatDateLabel(booking.date)}</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{formatTimeLabel(booking.time)}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{booking.notes}</p>
                    )}
                    {booking.consultationType && (
                      <div className="mt-4 rounded-xl border border-slate-300 p-3 dark:border-slate-700">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Consultation Type</p>
                        <p className="mt-1 text-sm font-semibold capitalize text-slate-900 dark:text-slate-50">
                          {booking.consultationType === 'online' ? 'Online (Google Meet)' : 'Offline (In-Person)'}
                        </p>
                        {booking.status !== 'pending' && booking.consultationType === 'online' && booking.meetingLink ? (
                          <a
                            href={booking.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-400 dark:text-slate-950"
                          >
                            Join Google Meet
                          </a>
                        ) : booking.status === 'pending' && booking.consultationType === 'online' ? (
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Waiting for admin to set up meeting link...</p>
                        ) : null}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}