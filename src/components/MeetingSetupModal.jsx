import { useState } from 'react'
import { appointmentApi } from '../services/api'

export default function MeetingSetupModal({ booking, token, onClose, onSuccess }) {
  const [meetingLink, setMeetingLink] = useState(booking.meetingLink || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isOnline = booking.consultationType === 'online'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Submitting meeting setup:', { id: booking._id, consultationType: booking.consultationType, meetingLink })
      const updatedBooking = await appointmentApi.setupMeeting(token, booking._id, booking.consultationType, meetingLink || null)
      console.log('Meeting setup successful:', updatedBooking)
      onSuccess(updatedBooking)
      onClose()
    } catch (err) {
      console.error('Meeting setup error:', err)
      setError(err.message || 'Failed to set up meeting.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-lg sm:p-6">
        <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">Accept Consultation</h2>
        <p className="mt-2 text-xs text-slate-400 sm:text-sm">Booking: {booking.name} • {booking.date} at {booking.time}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/30 px-4 py-3">
            <p className="text-xs font-medium text-emerald-400">Customer Selected</p>
            <p className="mt-2 text-lg font-semibold capitalize text-emerald-100">
              {isOnline ? 'Online (Google Meet)' : 'Offline (In-Person)'}
            </p>
            <p className="mt-1 text-xs text-emerald-300">
              {isOnline ? 'Virtual meeting via Google Meet' : 'Physical consultation at your office'}
            </p>
          </div>

          {isOnline && (
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Google Meet Link
                <span className="text-xs text-slate-400 ml-2">(Leave empty to auto-generate)</span>
              </label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-50 outline-none focus:border-sky-500"
              />
              <p className="mt-2 text-xs text-slate-400">
                A unique meeting link will be auto-generated if you leave this empty
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-900 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? 'Accepting...' : 'Accept Consultation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
