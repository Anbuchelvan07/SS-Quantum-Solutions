/**
 * API Service Layer
 * Mock API functions for fetching profile data
 * Ready for backend integration (Node.js / MongoDB or CMS)
 */

// Import all data files
import profileData from '../data/profileData.json'
import experienceData from '../data/experience.json'
import servicesData from '../data/services.json'
import achievementsData from '../data/achievements.json'
import educationData from '../data/education.json'
import metricsData from '../data/metrics.json'
import sidebarData from '../data/sidebar.json'

/**
 * Simulates API delay for realistic development experience
 */
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

async function apiRequest(path, options = {}) {
  // Get API base URL from environment or use relative path
  const apiBaseUrl = import.meta.env.VITE_API_URL || ''
  const fullUrl = apiBaseUrl ? `${apiBaseUrl}${path}` : path

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  let payload = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`)
  }

  return payload
}

/**
 * Fetch complete profile data
 * @returns {Promise<Object>} Complete profile object
 */
export const fetchProfile = async () => {
  await delay()
  return {
    ...profileData,
    experience: experienceData,
    services: servicesData,
    achievements: achievementsData,
    education: educationData,
    metrics: metricsData,
    sidebar: {
      contact: {
        ...profileData.sidebar.contact,
        ...sidebarData.contact,
      },
      skillsSidebar: profileData.sidebar.skills,
      skills: sidebarData.skills ?? [],
      languagesSidebar: profileData.sidebar.languages,
      languages: sidebarData.languages ?? [],
      metricsSidebar: profileData.sidebar.metrics,
    },
  }
}

/**
 * Fetch profile header information
 * @returns {Promise<Object>} Profile header data
 */
export const fetchProfileHeader = async () => {
  await delay(150)
  return profileData.profile
}

/**
 * Fetch experience timeline
 * @returns {Promise<Array>} Array of experience entries
 */
export const fetchExperience = async () => {
  await delay(200)
  return experienceData
}

/**
 * Fetch consultancy services
 * @returns {Promise<Array>} Array of service offerings
 */
export const fetchServices = async () => {
  await delay(200)
  return servicesData
}

/**
 * Fetch achievements/engagements
 * @returns {Promise<Array>} Array of achievement entries
 */
export const fetchAchievements = async () => {
  await delay(200)
  return achievementsData
}

/**
 * Fetch education and certifications
 * @returns {Promise<Array>} Array of education entries
 */
export const fetchEducation = async () => {
  await delay(150)
  return educationData
}

/**
 * Fetch HR metrics
 * @returns {Promise<Array>} Array of metric objects
 */
export const fetchMetrics = async () => {
  await delay(100)
  return metricsData
}

/**
 * Fetch sidebar data (contact, skills, languages)
 * @returns {Promise<Object>} Sidebar data object
 */
export const fetchSidebar = async () => {
  await delay(150)
  return {
    ...profileData.sidebar,
    ...sidebarData,
  }
}

/**
 * Update profile availability status
 * @param {boolean} status - New availability status
 * @returns {Promise<Object>} Updated profile data
 */
export const updateAvailability = async (status) => {
  await delay(200)
  // In a real app, this would make a PUT/PATCH request to the backend
  return {
    ...profileData.profile,
    availability: {
      ...profileData.profile.availability,
      status,
      label: status ? 'Available for Consultancy' : 'Currently Unavailable',
    },
  }
}

/**
 * Submit contact form
 * @param {Object} formData - Contact form data
 * @returns {Promise<Object>} Submission response
 */
export const submitContactForm = async (formData) => {
  const data = await apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  })
  return data
}

/**
 * Download profile PDF (mock)
 * @returns {Promise<Blob>} PDF blob
 */
export const downloadProfile = async () => {
  await delay(800)
  // In a real app, this would fetch a PDF from the backend
  return new Blob(['Mock PDF content'], { type: 'application/pdf' })
}

/**
 * Fetch real-time Bitcoin market data from backend API
 * Enhanced to support comprehensive market data and historical charts
 * Normalises backend response shape for frontend components
 * @returns {Promise<Object>} Comprehensive Bitcoin market data
 */
export const fetchBitcoinMarket = async () => {
  try {
    const json = await apiRequest('/api/market/bitcoin')

    // Handle API-level errors
    if (!json.success) {
      const errorMessage = json.error?.message || json.message || 'Bitcoin market data unavailable'
      throw new Error(errorMessage)
    }

    // Validate essential data structure
    if (!json.data || !json.data.current) {
      throw new Error('Invalid market data structure received')
    }

    return json
  } catch (error) {
    console.error('Error fetching Bitcoin market data:', error)
    throw error
  }
}

export const authApi = {
  registerCustomer: async (payload) => {
    const data = await apiRequest('/api/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return { token: data.token, user: data.user }
  },

  loginCustomer: async (payload) => {
    const data = await apiRequest('/api/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return { token: data.token, user: data.user }
  },

  registerAdmin: async (payload) => {
    const data = await apiRequest('/api/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return { token: data.token, user: data.user }
  },

  loginAdmin: async (payload) => {
    const data = await apiRequest('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return { token: data.token, user: data.user }
  },

  getCurrentUser: async (token) => {
    const data = await apiRequest('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data.user
  },
}

export const appointmentApi = {
  getBookedSlots: async (date) => {
    const data = await apiRequest(`/api/appointments/booked-slots?date=${encodeURIComponent(date)}`)
    return data.bookedTimes || []
  },

  scheduleConsultation: async (payload) => {
    const data = await apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data.data || data
  },

  createBooking: async (token, payload) => {
    const data = await apiRequest('/api/appointments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    return data.data
  },

  getMyBookings: async (token) => {
    const data = await apiRequest('/api/appointments/mine', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data.data || []
  },

  getAllBookings: async (token, status = 'all') => {
    const data = await apiRequest(`/api/appointments?status=${encodeURIComponent(status)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data.data || []
  },

  updateBookingStatus: async (token, id, status) => {
    const data = await apiRequest(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    })
    return data.data
  },

  setupMeeting: async (token, id, consultationType, meetingLink = null) => {
    const data = await apiRequest(`/api/appointments/${id}/meeting`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ consultationType, meetingLink }),
    })
    return data.data
  },

  deleteBooking: async (token, id) => {
    return apiRequest(`/api/appointments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
