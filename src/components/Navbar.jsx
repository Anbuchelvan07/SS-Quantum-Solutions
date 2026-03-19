import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/about', label: 'About', icon: 'ℹ️' },
  { path: '/experience', label: 'Experience', icon: '💼' },
  { path: '/engagements', label: 'Bitcoin', icon: '₿' },
  { path: '/contact', label: 'Contact', icon: '📧' },
]

export default function Navbar() {
  const location = useLocation()
  const { isAdmin, isCustomer, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 shadow-sm">
      {/* Main navbar container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo section */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 shadow-md group-hover:shadow-lg transition-shadow">
              <img src="/images/profile.jpeg" alt="SS Quantum" className="h-full w-full object-cover" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white">SS Quantum</span>
              <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">Solutions</span>
            </div>
          </Link>

          {/* Desktop navigation - center */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right section - buttons and controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop action buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {isCustomer && (
                <>
                  <Link
                    to="/book"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/book')
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    📅 Bookings
                  </Link>
                  <Link
                    to="/online-classes"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/online-classes')
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    🎓 Classes
                  </Link>
                </>
              )}
              
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/admin')
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    ⚙️ Dashboard
                  </Link>
                  <Link
                    to="/admin/online-classes"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/admin/online-classes')
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    🎓 Classes
                  </Link>
                </>
              )}

              {!isCustomer && !isAdmin && (
                <Link
                  to="/admin/auth"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all"
                >
                  👤 Admin
                </Link>
              )}

              {(isCustomer || isAdmin) && (
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
                >
                  🚪 Logout
                </button>
              )}

              {!isCustomer && !isAdmin && (
                <Link
                  to="/customer-auth"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all shadow-sm hover:shadow-md"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 space-y-2">
            
            {/* Main nav items */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isActive(item.path)
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {/* Divider */}
            {(isCustomer || isAdmin) && <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />}

            {/* Customer links */}
            {isCustomer && (
              <>
                <Link
                  to="/book"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    isActive('/book')
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  📅 My Bookings
                </Link>
                <Link
                  to="/online-classes"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    isActive('/online-classes')
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  🎓 Online Classes
                </Link>
              </>
            )}

            {/* Admin links */}
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    isActive('/admin')
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  ⚙️ Dashboard
                </Link>
                <Link
                  to="/admin/online-classes"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    isActive('/admin/online-classes')
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  🎓 Classes Management
                </Link>
              </>
            )}

            {/* Auth section divider */}
            {!((isCustomer || isAdmin)) && <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />}

            {/* Auth actions */}
            {!isCustomer && !isAdmin && (
              <>
                <Link
                  to="/admin/auth"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg font-medium text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-all"
                >
                  👤 Admin Login
                </Link>
                <Link
                  to="/customer-auth"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg font-semibold text-sm bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all mt-2"
                >
                  Sign In
                </Link>
              </>
            )}

            {/* Logout button */}
            {(isCustomer || isAdmin) && (
              <button
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                }}
                className="w-full px-4 py-2.5 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all mt-2"
              >
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}


