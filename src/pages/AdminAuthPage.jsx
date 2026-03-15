import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const initialRegisterState = {
  name: '',
  email: '',
  password: '',
}

const initialLoginState = {
  email: '',
  password: '',
}

export default function AdminAuthPage() {
  const navigate = useNavigate()
  const { ready, isAdmin } = useAuth()
  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState(initialLoginState)
  const [registerForm, setRegisterForm] = useState(initialRegisterState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { loginAdmin, registerAdmin } = useAuth()

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
      if (mode === 'login') {
        await loginAdmin(loginForm)
      } else {
        await registerAdmin(registerForm)
      }

      navigate('/admin', { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="bg-slate-900 px-8 py-10 text-white dark:bg-slate-950">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Admin Access</p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Manage bookings and consultations.</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
              Create or log in to your admin account to access the dashboard, review booking requests, and manage consultation schedules.
            </p>
            <div className="mt-8 space-y-3 rounded-2xl border border-slate-700 bg-slate-800/50 p-5 text-sm text-slate-200">
              <p>View all customer booking requests in one place.</p>
              <p>Update booking status (pending, confirmed, completed, cancelled).</p>
              <p>Delete invalid or duplicate bookings securely.</p>
              <p>Manage your consultancy calendar efficiently.</p>
            </div>
          </section>

          <section className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 text-sm dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-full px-4 py-2 font-medium transition-colors ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                    : 'text-slate-500 dark:text-slate-300'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-full px-4 py-2 font-medium transition-colors ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                    : 'text-slate-500 dark:text-slate-300'
                }`}
              >
                Register
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {mode === 'login' ? 'Admin login' : 'Create your admin account'}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {mode === 'login'
                  ? 'Use your admin credentials to access the dashboard.'
                  : 'Registration creates your admin account and signs you in immediately.'}
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Full name</span>
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                    placeholder="Your full name"
                  />
                </label>
              )}

              <label className="block text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Email address</span>
                <input
                  type="email"
                  required
                  value={mode === 'login' ? loginForm.email : registerForm.email}
                  onChange={(event) => {
                    const nextEmail = event.target.value
                    if (mode === 'login') {
                      setLoginForm((current) => ({ ...current, email: nextEmail }))
                    } else {
                      setRegisterForm((current) => ({ ...current, email: nextEmail }))
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="admin@example.com"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-medium text-slate-700 dark:text-slate-200">Password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={mode === 'login' ? loginForm.password : registerForm.password}
                  onChange={(event) => {
                    const nextPassword = event.target.value
                    if (mode === 'login') {
                      setLoginForm((current) => ({ ...current, password: nextPassword }))
                    } else {
                      setRegisterForm((current) => ({ ...current, password: nextPassword }))
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="At least 8 characters"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                {submitting ? 'Please wait...' : mode === 'login' ? 'Access admin dashboard' : 'Create account and continue'}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <Link to="/" className="font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400">
                Back to website
              </Link>
              <Link to="/customer-auth" className="font-medium text-slate-700 transition hover:text-slate-900 dark:text-slate-200">
                Customer login
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
