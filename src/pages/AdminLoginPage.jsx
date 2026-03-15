import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { ready, isAdmin, loginAdmin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (ready && isAdmin) {
      navigate('/admin', { replace: true })
    }
  }, [isAdmin, navigate, ready])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await loginAdmin({ email, password })
      navigate('/admin', { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'Admin login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 md:grid-cols-[1.1fr_0.9fr]">
          <section className="px-8 py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Admin Access</p>
            <h1 className="mt-4 text-3xl font-semibold">Secure admin sign in</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              Use your admin credentials to review bookings, change booking status, and manage the consultancy calendar.
            </p>

            <form className="mt-8 max-w-md space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              )}

              <label className="block text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Admin email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                {submitting ? 'Signing in...' : 'Open admin dashboard'}
              </button>
            </form>
          </section>

          <aside className="bg-slate-100 px-8 py-10 text-sm text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Admin capabilities</h2>
              <ul className="mt-4 space-y-3">
                <li>View every booking request in one place.</li>
                <li>Change booking status to confirmed, completed, or cancelled.</li>
                <li>Delete invalid or duplicate bookings securely.</li>
              </ul>
            </div>
            <div className="mt-6">
              <Link to="/" className="font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400">
                Return to public website
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}