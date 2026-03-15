import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdminAccess } from '../context/AdminAccessContext'
import MeetingSetupModal from '../components/MeetingSetupModal'
import { appointmentApi } from '../services/api'

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled']

function formatTimestamp(date, time) {
  return `${new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })} at ${time}`
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { token, user, logout } = useAuth()
  const { revokeAccess } = useAdminAccess()
  const [filter, setFilter] = useState('all')
  const [bookings, setBookings] = useState([])
  const [statusDrafts, setStatusDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const [meetingModal, setMeetingModal] = useState(null)

  useEffect(() => {
    let active = true

    const loadBookings = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await appointmentApi.getAllBookings(token, filter)
        if (!active) return
        setBookings(data)
        setStatusDrafts(Object.fromEntries(data.map((booking) => [booking._id, booking.status])))
      } catch (loadError) {
        if (active) setError(loadError.message || 'Unable to load bookings.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadBookings()

    return () => {
      active = false
    }
  }, [filter, token])

  const handleStatusUpdate = async (bookingId) => {
    const nextStatus = statusDrafts[bookingId]
    setBusyId(bookingId)
    setError('')

    try {
      const updatedBooking = await appointmentApi.updateBookingStatus(token, bookingId, nextStatus)
      setBookings((current) => current.map((booking) => (booking._id === bookingId ? updatedBooking : booking)))
    } catch (updateError) {
      setError(updateError.message || 'Unable to update booking.')
    } finally {
      setBusyId('')
    }
  }

  const handleDelete = async (bookingId) => {
    setBusyId(bookingId)
    setError('')

    try {
      await appointmentApi.deleteBooking(token, bookingId)
      setBookings((current) => current.filter((booking) => booking._id !== bookingId))
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete booking.')
    } finally {
      setBusyId('')
    }
  }

  const handleLogout = () => {
    logout()
    revokeAccess()
    navigate('/', { replace: true })
  }

  const handleAcceptConsultation = async (booking) => {
    setBusyId(booking._id)
    setError('')

    try {
      const updatedBooking = await appointmentApi.updateBookingStatus(token, booking._id, 'confirmed')
      setBookings((current) => current.map((b) => (b._id === booking._id ? updatedBooking : b)))
    } catch (acceptError) {
      setError(acceptError.message || 'Unable to accept consultation.')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-400">Admin Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Consultancy bookings</h1>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">Signed in as {user?.email}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 outline-none sm:w-auto"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full rounded-2xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-900 sm:w-auto"
            >
              View website
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-400">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 px-6 py-12 text-center text-sm text-slate-400">
            No bookings found for this filter.
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {bookings.map((booking) => (
              <article key={booking._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Booking request</p>
                    <h2 className="mt-2 text-xl font-semibold">{booking.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">{booking.email}</p>
                    <p className="mt-3 text-sm text-slate-300">{formatTimestamp(booking.date, booking.time)}</p>
                  </div>
                  <div className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold capitalize text-sky-300">
                    {booking.status}
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-300">
                    {booking.notes}
                  </div>
                )}

                {booking.consultationType && (
                  <div className="mt-5">
                    <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/30 px-4 py-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium text-emerald-400">Customer Selected</p>
                          <p className="mt-1 font-semibold capitalize text-emerald-100">{booking.consultationType === 'online' ? 'Online (Google Meet)' : 'Offline (In-Person)'}</p>
                          {booking.consultationType === 'online' && (
                            <p className="mt-2 text-xs text-emerald-300">Requires Google Meet link setup</p>
                          )}
                        </div>
                        {booking.status === 'pending' && (
                          <button
                            type="button"
                            disabled={busyId === booking._id}
                            onClick={() => handleAcceptConsultation(booking)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Accept
                          </button>
                        )}
                      </div>
                    </div>
                    {booking.status !== 'pending' && booking.meetingLink && (
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
                  <select
                    value={statusDrafts[booking._id] || booking.status}
                    onChange={(event) =>
                      setStatusDrafts((current) => ({
                        ...current,
                        [booking._id]: event.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={busyId === booking._id}
                    onClick={() => setMeetingModal(booking)}
                    className="rounded-2xl border border-purple-800 px-4 py-3 text-sm font-semibold text-purple-300 transition hover:bg-purple-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Meeting
                  </button>
                  <button
                    type="button"
                    disabled={busyId === booking._id}
                    onClick={() => handleStatusUpdate(booking._id)}
                    className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={busyId === booking._id}
                    onClick={() => handleDelete(booking._id)}
                    className="rounded-2xl border border-rose-800 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {meetingModal && (
        <MeetingSetupModal
          booking={meetingModal}
          token={token}
          onClose={() => setMeetingModal(null)}
          onSuccess={(updated) => {
            setBookings(current => current.map(b => b._id === updated._id ? updated : b))
          }}
        />
      )}
    </div>
  )
}