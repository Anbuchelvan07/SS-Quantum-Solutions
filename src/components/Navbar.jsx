import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/experience', label: 'Experience' },
  { path: '/engagements', label: 'Real Time Bitcoin' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const location = useLocation()
  const { isAdmin, isCustomer, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-sky-600 shadow-sm dark:bg-sky-500">
            <img src="/images/profile.jpeg" alt="SS Quantum Solution" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              SS Quantum Solutions
            </span>
            
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center sm:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>

          <ul className="hidden items-center gap-4 text-xs font-medium text-slate-600 sm:flex sm:gap-6 dark:text-slate-300">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
                    location.pathname === item.path
                      ? 'text-sky-600 font-semibold dark:text-sky-400'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isCustomer && (
              <li>
                <Link
                  to="/book"
                  className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
                    location.pathname === '/book' ? 'font-semibold text-sky-600 dark:text-sky-400' : ''
                  }`}
                >
                  My Bookings
                </Link>
              </li>
            )}
            {isAdmin ? (
              <li>
                <Link
                  to="/admin"
                  className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
                    location.pathname === '/admin' ? 'font-semibold text-sky-600 dark:text-sky-400' : ''
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/admin/auth"
                  className={`transition-colors hover:text-slate-900 dark:hover:text-white ${
                    location.pathname === '/admin/auth' ? 'font-semibold text-sky-600 dark:text-sky-400' : ''
                  }`}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
          {isCustomer && (
            <Link
              to="/book"
              className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 sm:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
            >
              Bookings
            </Link>
          )}
          {!isCustomer && (
            <Link
              to={isAdmin ? '/admin' : '/admin/auth'}
              className="inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 sm:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
            >
              {isAdmin ? 'Dashboard' : 'Admin'}
            </Link>
          )}
          {(isCustomer || isAdmin) && (
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
            >
              Logout
            </button>
          )}
          {!isCustomer && !isAdmin && (
            <Link
              to="/customer-auth"
              className="rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400"
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className=\"border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:hidden\">
          <div className=\"space-y-1 px-4 py-3\">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isCustomer && (
              <Link
                to=\"/book\"
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/book'
                    ? 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link
                to=\"/admin\"
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                Dashboard
              </Link>
            )}
            {!isAdmin && (
              <Link
                to=\"/admin/auth\"
                onClick={() => setMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/admin/auth'
                    ? 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

