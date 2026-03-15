# Dynamic HR Consultancy Profile - Architecture Documentation

## Overview

This React application has been transformed from a static profile into a fully dynamic, data-driven application ready for backend integration.

## Architecture Highlights

### ✅ **Data-Driven Architecture**
- All content is stored in JSON files under `/src/data/`
- No hard-coded text in components
- Centralized data structure via `ProfileContext`
- Ready for API integration

### ✅ **React Router Navigation**
- Multi-page navigation with dedicated routes:
  - `/` - Home (full profile)
  - `/about` - About section
  - `/experience` - Experience timeline
  - `/services` - Consultancy services
  - `/engagements` - Achievements gallery
  - `/education` - Education & certifications
  - `/contact` - Contact form

### ✅ **State Management**
- **ProfileContext**: Centralized profile data management
- **ThemeContext**: Dark/light mode with localStorage persistence
- **Dynamic Availability**: Toggle availability status (click badge in header)
- **Form State**: Contact form with validation and API submission

### ✅ **API Service Layer**
- Mock API functions in `/src/services/api.js`
- Simulated network delays for realistic development
- Ready for backend integration (Node.js/MongoDB/CMS)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProfileHeader.jsx    # Dynamic header with availability toggle
│   ├── AboutSection.jsx     # About section (uses context)
│   ├── ExperienceTimeline.jsx
│   ├── ConsultancyServices.jsx
│   ├── AchievementsGallery.jsx
│   ├── EducationSection.jsx
│   ├── ContactForm.jsx       # Form with API integration
│   ├── SidebarContact.jsx
│   ├── SidebarSkills.jsx
│   ├── SidebarLanguages.jsx
│   ├── HRMetrics.jsx
│   └── ...
├── context/            # React Context providers
│   ├── ProfileContext.jsx   # Profile data management
│   └── ThemeContext.jsx     # Theme management
├── data/              # JSON data files
│   ├── profileData.json     # Consolidated profile structure
│   ├── experience.json
│   ├── services.json
│   ├── achievements.json
│   ├── education.json
│   ├── metrics.json
│   └── sidebar.json
├── services/          # API service layer
│   └── api.js        # Mock API functions
├── pages/            # Route pages
│   ├── Home.jsx
│   ├── AboutPage.jsx
│   ├── ExperiencePage.jsx
│   ├── ServicesPage.jsx
│   ├── EngagementsPage.jsx
│   ├── EducationPage.jsx
│   └── ContactPage.jsx
├── App.jsx           # Router setup
└── main.jsx          # App entry point
```

## Key Features

### 1. **Dynamic Availability Status**
- Click the availability badge in the header to toggle status
- Updates via API call (currently mocked)
- State persists in ProfileContext

### 2. **API Service Layer**
All API calls are abstracted in `/src/services/api.js`:

```javascript
// Example API functions:
- fetchProfile()           // Get complete profile
- fetchExperience()        // Get experience data
- fetchServices()          // Get services
- updateAvailability()    // Update availability status
- submitContactForm()      // Submit contact form
- downloadProfile()        // Download PDF
```

### 3. **Component Props Pattern**
All components use `useProfile()` hook to access data:

```javascript
import { useProfile } from '../context/ProfileContext'

export default function MyComponent() {
  const { profile, loading, error } = useProfile()
  
  if (loading) return <Loading />
  if (!profile) return null
  
  // Use profile data dynamically
  return <div>{profile.profile.name}</div>
}
```

## Backend Integration Guide

### Step 1: Update API Service

Replace mock functions in `/src/services/api.js` with real API calls:

```javascript
// Before (mock):
export const fetchProfile = async () => {
  await delay()
  return profileData
}

// After (real API):
export const fetchProfile = async () => {
  const response = await fetch('/api/profile')
  if (!response.ok) throw new Error('Failed to fetch profile')
  return response.json()
}
```

### Step 2: Environment Variables

Create `.env` file for API endpoints:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Update `api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const fetchProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`)
  // ...
}
```

### Step 3: Error Handling

Add error boundaries and better error handling:

```javascript
// In ProfileContext.jsx
const loadProfile = async () => {
  try {
    setLoading(true)
    const data = await api.fetchProfile()
    setProfile(data)
  } catch (err) {
    setError(err.message)
    // Show user-friendly error message
  } finally {
    setLoading(false)
  }
}
```

### Step 4: Backend API Endpoints

Expected API endpoints:

```
GET  /api/profile              # Complete profile
GET  /api/profile/header       # Header data only
GET  /api/experience           # Experience timeline
GET  /api/services             # Consultancy services
GET  /api/achievements         # Achievements/engagements
GET  /api/education            # Education & certifications
GET  /api/metrics              # HR metrics
GET  /api/sidebar              # Sidebar data
PUT  /api/profile/availability # Update availability
POST /api/contact              # Submit contact form
GET  /api/profile/download     # Download PDF
```

## Data Structure

### Profile Data Structure

```json
{
  "profile": {
    "id": "K Shivasankari",
    "name": "K Shivasankari",
    "headline": "Bitcoin & Blockchain Advisory",
    "location": "1/131,Telephone colony, Uierialpoonga road, vinayagampatti(PO), salem-636008,Tamil nadu.",
    "availability": {
      "status": true,
      "label": "Available for Consultancy",
      "tone": "available"
    }
  },
  "sections": {
    "about": { "eyebrow": "...", "title": "...", "summary": [...] },
    "experience": { ... },
    "services": { ... }
  },
  "experience": [...],
  "services": [...],
  "achievements": [...],
  "education": [...],
  "metrics": [...],
  "sidebar": { ... }
}
```

## Usage Examples

### Accessing Profile Data

```javascript
import { useProfile } from '../context/ProfileContext'

function MyComponent() {
  const { profile, loading, updateAvailability } = useProfile()
  
  // Access profile data
  const name = profile?.profile?.name
  const services = profile?.services || []
  
  // Update availability
  const handleToggle = async () => {
    await updateAvailability(!profile.profile.availability.status)
  }
}
```

### Using API Service

```javascript
import * as api from '../services/api'

// Fetch data
const profile = await api.fetchProfile()

// Submit form
const result = await api.submitContactForm(formData)

// Update availability
await api.updateAvailability(true)
```

## Future Enhancements

1. **Authentication**: Add user authentication for admin panel
2. **CMS Integration**: Connect to headless CMS (Contentful, Strapi)
3. **Real-time Updates**: WebSocket for live availability updates
4. **Analytics**: Track page views and form submissions
5. **Internationalization**: Multi-language support
6. **SEO**: Add meta tags and structured data
7. **Performance**: Implement code splitting and lazy loading

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Notes

- All components are fully dynamic and use context/API
- No hard-coded content remains in components
- Ready for production deployment
- Scalable architecture for future features
