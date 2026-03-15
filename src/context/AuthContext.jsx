import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api'

const AUTH_STORAGE_KEY = 'hr-consultancy-auth'

const AuthContext = createContext()

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return { token: null, user: null }
    const parsed = JSON.parse(raw)
    return {
      token: parsed?.token || null,
      user: parsed?.user || null,
    }
  } catch {
    return { token: null, user: null }
  }
}

function writeStoredAuth(token, user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }))
}

function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuthState] = useState(() => readStoredAuth())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    const hydrateAuth = async () => {
      if (!token) {
        setReady(true)
        return
      }

      try {
        const currentUser = await authApi.getCurrentUser(token)
        if (!active) return
        setAuthState({ token, user: currentUser })
        writeStoredAuth(token, currentUser)
      } catch {
        if (!active) return
        setAuthState({ token: null, user: null })
        clearStoredAuth()
      } finally {
        if (active) setReady(true)
      }
    }

    hydrateAuth()

    return () => {
      active = false
    }
  }, [token])

  const persistAuth = (nextToken, nextUser) => {
    setAuthState({ token: nextToken, user: nextUser })
    writeStoredAuth(nextToken, nextUser)
  }

  const loginCustomer = async (credentials) => {
    const data = await authApi.loginCustomer(credentials)
    persistAuth(data.token, data.user)
    return data.user
  }

  const registerCustomer = async (payload) => {
    const data = await authApi.registerCustomer(payload)
    persistAuth(data.token, data.user)
    return data.user
  }

  const loginAdmin = async (credentials) => {
    const data = await authApi.loginAdmin(credentials)
    persistAuth(data.token, data.user)
    return data.user
  }

  const registerAdmin = async (payload) => {
    const data = await authApi.registerAdmin(payload)
    persistAuth(data.token, data.user)
    return data.user
  }

  const logout = () => {
    setAuthState({ token: null, user: null })
    clearStoredAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        ready,
        token,
        user,
        isAuthenticated: Boolean(token && user),
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
        loginCustomer,
        registerCustomer,
        loginAdmin,
        registerAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}