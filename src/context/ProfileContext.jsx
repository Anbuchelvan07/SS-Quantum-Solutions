import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api'

const ProfileContext = createContext()

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const data = await api.fetchProfile()
        setProfile(data)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to load profile data')
        console.error('Error loading profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Update availability status
  const updateAvailability = async (status) => {
    try {
      const updated = await api.updateAvailability(status)
      setProfile((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          availability: updated.availability,
        },
      }))
    } catch (err) {
      console.error('Error updating availability:', err)
      throw err
    }
  }

  const value = {
    profile,
    loading,
    error,
    updateAvailability,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
