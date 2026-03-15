import { createContext, useContext, useEffect, useState } from 'react'

const ADMIN_ACCESS_KEY = 'hr-consultancy-admin-access'
const ADMIN_ACCESS_CODE = 'ADMIN123'

const AdminAccessContext = createContext()

function readStoredAccess() {
  try {
    const raw = localStorage.getItem(ADMIN_ACCESS_KEY)
    if (!raw) return false
    return JSON.parse(raw)
  } catch {
    return false
  }
}

function writeStoredAccess(hasAccess) {
  if (hasAccess) {
    localStorage.setItem(ADMIN_ACCESS_KEY, JSON.stringify(true))
  } else {
    localStorage.removeItem(ADMIN_ACCESS_KEY)
  }
}

export function AdminAccessProvider({ children }) {
  const [hasAccess, setHasAccess] = useState(() => readStoredAccess())

  const grantAccess = (code) => {
    if (code === ADMIN_ACCESS_CODE) {
      setHasAccess(true)
      writeStoredAccess(true)
      return true
    }
    return false
  }

  const revokeAccess = () => {
    setHasAccess(false)
    writeStoredAccess(false)
  }

  return (
    <AdminAccessContext.Provider value={{ hasAccess, grantAccess, revokeAccess }}>
      {children}
    </AdminAccessContext.Provider>
  )
}

export function useAdminAccess() {
  const context = useContext(AdminAccessContext)
  if (!context) {
    throw new Error('useAdminAccess must be used within an AdminAccessProvider')
  }
  return context
}
