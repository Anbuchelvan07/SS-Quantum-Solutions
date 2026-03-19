import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { onlineClassApi, authApi } from '../services/api'

const timeOptions = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
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
  if (status === 'scheduled') return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
  if (status === 'ongoing') return 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  if (status === 'cancelled') return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
  return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
}

export default function AdminOnlineClassPage() {
  const navigate = useNavigate()
  const { token, user, logout } = useAuth()
  const [filter, setFilter] = useState('scheduled')
  const [classes, setClasses] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [selectedClassForUsers, setSelectedClassForUsers] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    topic: '',
    date: '',
    time: '',
    duration: 60,
    maxParticipants: 50,
    isPublic: false,
    assignedUsers: [],
  })
  const [statusDrafts, setStatusDrafts] = useState({})
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/admin/login')
      return
    }
    loadClasses()
    loadAllUsers()
  }, [token, user])

  const loadClasses = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await onlineClassApi.getAllClasses(token, filter)
      setClasses(data)
      setStatusDrafts(Object.fromEntries(data.map(c => [c._id, c.status])))
    } catch (err) {
      setError(err.message || 'Unable to load online classes.')
    } finally {
      setLoading(false)
    }
  }

  const loadAllUsers = async () => {
    try {
      const data = await authApi.getCurrentUser(token)
      // In a real app, we'd have a dedicated getUserList endpoint
      // For now, we'll use a mock list - you should create this endpoint
      setAllUsers([])
    } catch (err) {
      console.error('Failed to load users:', err)
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }))
  }

  const handleToggleUser = (userId) => {
    setForm(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter(id => id !== userId)
        : [...prev.assignedUsers, userId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusyId('form')
    try {
      if (editingClass) {
        await onlineClassApi.updateClass(token, editingClass._id, form)
      } else {
        await onlineClassApi.createClass(token, form)
      }
      await loadClasses()
      setShowForm(false)
      setEditingClass(null)
      setForm({
        title: '',
        description: '',
        topic: '',
        date: '',
        time: '',
        duration: 60,
        maxParticipants: 50,
        isPublic: false,
        assignedUsers: [],
      })
    } catch (err) {
      setError(err.message || 'Failed to save class.')
    } finally {
      setBusyId('')
    }
  }

  const handleEdit = (onlineClass) => {
    setEditingClass(onlineClass)
    setForm({
      title: onlineClass.title,
      description: onlineClass.description || '',
      topic: onlineClass.topic || '',
      date: onlineClass.date,
      time: onlineClass.time,
      duration: onlineClass.duration,
      maxParticipants: onlineClass.maxParticipants,
      isPublic: onlineClass.isPublic,
      assignedUsers: onlineClass.assignedUsers.map(u => u._id || u),
    })
    setShowForm(true)
  }

  const handleStatusChange = async (classId, newStatus) => {
    setStatusDrafts(prev => ({ ...prev, [classId]: newStatus }))
  }

  const handleStatusSave = async (classId) => {
    setBusyId(classId)
    try {
      const newStatus = statusDrafts[classId]
      await onlineClassApi.updateClass(token, classId, { status: newStatus })
      await loadClasses()
    } catch (err) {
      setError(err.message || 'Failed to update status.')
    } finally {
      setBusyId('')
    }
  }

  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return
    setBusyId(classId)
    try {
      await onlineClassApi.deleteClass(token, classId)
      await loadClasses()
    } catch (err) {
      setError(err.message || 'Failed to delete class.')
    } finally {
      setBusyId('')
    }
  }

  const handleCopyMeetingLink = (meetingLink) => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink)
      alert('Meeting link copied to clipboard!')
    }
  }

  if (!token || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Online Classes Management</h1>
          <p className="text-slate-600 dark:text-slate-300">Create and manage online consulting classes</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 dark:text-red-300 hover:text-red-900">✕</button>
          </div>
        )}

        {/* Action Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
            <label className="text-slate-700 dark:text-slate-300 font-semibold">Filter by Status:</label>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setClasses([])
              }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={() => {
              setEditingClass(null)
              setForm({
                title: '',
                description: '',
                topic: '',
                date: '',
                time: '',
                duration: 60,
                maxParticipants: 50,
                isPublic: false,
                assignedUsers: [],
              })
              setShowForm(!showForm)
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : '+ Create Class'}
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {editingClass ? 'Edit Online Class' : 'Create New Online Class'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Class Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g., Advanced HR Strategy"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Topic *
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={form.topic}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g., HR Consulting"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Time
                  </label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Time</option>
                    {timeOptions.map(t => (
                      <option key={t} value={t}>{formatTimeLabel(t)}</option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleFormChange}
                    min="15"
                    max="480"
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={form.maxParticipants}
                    onChange={handleFormChange}
                    min="1"
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Class description and details..."
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Public */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={form.isPublic}
                  onChange={handleFormChange}
                  id="isPublic"
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-slate-700 dark:text-slate-300">
                  Make this class public (visible to all users)
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyId === 'form'}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {busyId === 'form' ? 'Saving...' : editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Classes List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Loading classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">No online classes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {classes.map(onlineClass => (
              <div
                key={onlineClass._id}
                className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{onlineClass.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses(onlineClass.status)}`}>
                        {onlineClass.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-3">{onlineClass.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{formatDateLabel(onlineClass.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Time</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{formatTimeLabel(onlineClass.time)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{onlineClass.duration} min</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Topic</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{onlineClass.topic}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Meeting Link</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={onlineClass.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate text-sm"
                        >
                          {onlineClass.meetingLink}
                        </a>
                        <button
                          onClick={() => handleCopyMeetingLink(onlineClass.meetingLink)}
                          className="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-sm text-slate-700 dark:text-slate-300"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Assigned Users: {onlineClass.assignedUsers?.length || 0}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:w-48">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Change Status
                      </label>
                      <select
                        value={statusDrafts[onlineClass._id] || onlineClass.status}
                        onChange={(e) => handleStatusChange(onlineClass._id, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleStatusSave(onlineClass._id)}
                      disabled={busyId === onlineClass._id}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      {busyId === onlineClass._id ? 'Saving...' : 'Save Status'}
                    </button>
                    <button
                      onClick={() => handleEdit(onlineClass)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(onlineClass._id)}
                      disabled={busyId === onlineClass._id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
