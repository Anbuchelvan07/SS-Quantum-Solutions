import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import ExperiencePage from './pages/ExperiencePage'
import EngagementsPage from './pages/EngagementsPage'
import EducationPage from './pages/EducationPage'
import ContactPage from './pages/ContactPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { AdminAccessProvider } from './context/AdminAccessContext'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminAuthPage from './pages/AdminAuthPage'
import AdminAccessPage from './pages/AdminAccessPage'
import BookingPage from './pages/BookingPage'
import CustomerAuthPage from './pages/CustomerAuthPage'
import AdminOnlineClassPage from './pages/AdminOnlineClassPage'
import UserOnlineClassPage from './pages/UserOnlineClassPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAccessProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/engagements" element={<EngagementsPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/customer-auth" element={<CustomerAuthPage />} />
            <Route path="/admin/auth" element={<AdminAuthPage />} />
            <Route path="/admin/access" element={<AdminAccessPage />} />
            <Route
              path="/book"
              element={
                <ProtectedRoute roles={['customer']}>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-classes"
              element={
                <ProtectedRoute roles={['customer']}>
                  <UserOnlineClassPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboardPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/online-classes"
              element={
                <AdminProtectedRoute>
                  <AdminOnlineClassPage />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </AdminAccessProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
