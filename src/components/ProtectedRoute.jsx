import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles, redirectTo }) {
  const location = useLocation()
  const { ready, isAuthenticated, user } = useAuth()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        Checking access...
      </div>
    )
  }

  if (!isAuthenticated) {
    const fallbackPath = `/customer-auth?redirect=${encodeURIComponent(location.pathname + location.search)}`
    return <Navigate to={redirectTo || fallbackPath} replace />
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  }

  return children
}