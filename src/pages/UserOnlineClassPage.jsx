import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { onlineClassApi } from '../services/api'

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
  if (status === 'scheduled') return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
  if (status === 'ongoing') return 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  if (status === 'cancelled') return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
  return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
}

export default function UserOnlineClassPage() {
  const navigate = useNavigate()
  const { token, user, logout } = useAuth()
  const [filter, setFilter] = useState('all')
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedClass, setSelectedClass] = useState(null)
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/auth')
      return
    }
    loadClasses()
  }, [token, user, filter])

  const loadClasses = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await onlineClassApi.getAssignedClasses(token)
      
      // Filter based on status
      let filtered = data
      if (filter !== 'all') {
        filtered = data.filter(c => c.status === filter)
      }
      
      setClasses(filtered)
    } catch (err) {
      setError(err.message || 'Unable to load online classes.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClass = async (classId) => {
    setBusyId(classId)
    try {
      const result = await onlineClassApi.joinClass(token, classId)
      
      // Update the class status in the list
      setClasses(prev => prev.map(c => 
        c._id === classId ? { ...c, status: 'attended' } : c
      ))
      
      // Open meeting link in new window
      if (result.meetingLink) {
        window.open(result.meetingLink, '_blank')
      }
      
      setSelectedClass(null)
      alert('Welcome to the class! Your attendance has been recorded.')
    } catch (err) {
      setError(err.message || 'Failed to join class.')
    } finally {
      setBusyId('')
    }
  }

  const isClassUpcoming = (date, time) => {
    const classDateTime = new Date(`${date}T${time}:00`)
    return classDateTime > new Date()
  }

  const isClassOngoing = (date, time) => {
    const classDateTime = new Date(`${date}T${time}:00`)
    const endDateTime = new Date(classDateTime.getTime() + 60 * 60 * 1000) // Assuming 1 hour
    const now = new Date()
    return classDateTime <= now && now <= endDateTime
  }

  if (!token) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">My Online Classes</h1>
          <p className="text-slate-600 dark:text-slate-300">Attend your assigned online consulting classes</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 dark:text-red-300 hover:text-red-900">✕</button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-8 flex gap-4 items-center flex-wrap">
          <label className="text-slate-700 dark:text-slate-300 font-semibold">Filter by Status:</label>
          <div className="flex gap-2 flex-wrap">
            {['all', 'scheduled', 'ongoing', 'completed'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                  filter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Loading your classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="mb-4 text-4xl">📚</div>
            <p className="text-slate-600 dark:text-slate-400 mb-2">No classes assigned yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Check back soon for new online consulting classes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(onlineClass => (
              <div
                key={onlineClass._id}
                className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2">{onlineClass.title}</h3>
                  </div>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusClasses(onlineClass.status)}`}>
                    {onlineClass.status}
                  </span>
                </div>

                {/* Topic */}
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  <span className="font-semibold">Topic:</span> {onlineClass.topic}
                </p>

                {/* Description */}
                {onlineClass.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">{onlineClass.description}</p>
                )}

                {/* Details */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">📅</span>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatDateLabel(onlineClass.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">🕐</span>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Time</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatTimeLabel(onlineClass.time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">⏱️</span>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{onlineClass.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">👥</span>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Participants</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{onlineClass.assignedUsers?.length || 0} / {onlineClass.maxParticipants}</p>
                    </div>
                  </div>
                </div>

                {/* Created By */}
                {onlineClass.createdBy && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Created by: <span className="font-semibold">{onlineClass.createdBy.name}</span>
                  </p>
                )}

                {/* Actions */}
                <div className="mt-auto space-y-2">
                  {(isClassUpcoming(onlineClass.date, onlineClass.time) || isClassOngoing(onlineClass.date, onlineClass.time)) && 
                    onlineClass.status !== 'cancelled' ? (
                    <button
                      onClick={() => handleJoinClass(onlineClass._id)}
                      disabled={busyId === onlineClass._id}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {busyId === onlineClass._id ? 'Joining...' : '🎥 Join Class'}
                    </button>
                  ) : onlineClass.status === 'cancelled' ? (
                    <div className="w-full px-4 py-2 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-semibold rounded-lg text-center">
                      ❌ Class Cancelled
                    </div>
                  ) : (
                    <div className="w-full px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-semibold rounded-lg text-center">
                      ℹ️ Upcoming
                    </div>
                  )}
                  
                  <button
                    onClick={() => setSelectedClass(onlineClass)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedClass.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{selectedClass.topic}</p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Status</p>
                <div className={`inline-block px-4 py-2 rounded-full font-semibold ${statusClasses(selectedClass.status)}`}>
                  {selectedClass.status}
                </div>
              </div>

              {/* Description */}
              {selectedClass.description && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Description</p>
                  <p className="text-slate-900 dark:text-white">{selectedClass.description}</p>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Date</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{formatDateLabel(selectedClass.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Time</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{formatTimeLabel(selectedClass.time)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Duration</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{selectedClass.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Participants</p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {selectedClass.assignedUsers?.length || 0} / {selectedClass.maxParticipants}
                  </p>
                </div>
              </div>

              {/* Meeting Link */}
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Meeting Link</p>
                <a
                  href={selectedClass.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {selectedClass.meetingLink}
                </a>
              </div>

              {/* Instructor */}
              {selectedClass.createdBy && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Instructor</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{selectedClass.createdBy.name}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{selectedClass.createdBy.email}</p>
                </div>
              )}

              {/* Resources */}
              {selectedClass.resources && selectedClass.resources.length > 0 && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Resources</p>
                  <div className="space-y-2">
                    {selectedClass.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        📎 {resource.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-4">
              {(isClassUpcoming(selectedClass.date, selectedClass.time) || isClassOngoing(selectedClass.date, selectedClass.time)) && 
                selectedClass.status !== 'cancelled' ? (
                <button
                  onClick={() => {
                    handleJoinClass(selectedClass._id)
                  }}
                  disabled={busyId === selectedClass._id}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {busyId === selectedClass._id ? 'Joining...' : '🎥 Join Class Now'}
                </button>
              ) : null}
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
