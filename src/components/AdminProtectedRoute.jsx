import { Navigate } from 'react-router-dom'
import { useAdminAccess } from '../context/AdminAccessContext'

export default function AdminProtectedRoute({ children }) {
  const { hasAccess } = useAdminAccess()

  if (!hasAccess) {
    return <Navigate to="/admin/access" replace />
  }

  return children
}
