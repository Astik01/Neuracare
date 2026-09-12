import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';
import ChatWidget from './ChatWidget/ChatWidget';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/symptom-checker', label: 'Symptom Checker' },
  { to: '/find-doctors', label: 'Find Doctors' },
  { to: '/health-library', label: 'Health Library' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDark, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <nav
          aria-label="Main navigation"
          className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3"
        >
          <Link to="/" className="text-xl font-bold text-teal-700 dark:text-teal-400">
            Neuracare
          </Link>
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/my-bookings"
                  className="text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-400"
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-400"
                >
                  {user?.name || 'Profile'}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded bg-teal-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-800"
              >
                Get Started
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <ChatWidget />

      <footer className="bg-white border-t border-slate-200 py-8 text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/help-centre" className="hover:text-teal-700">
            Help Centre
          </Link>
          <Link to="/privacy-policy" className="hover:text-teal-700">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-teal-700">
            Terms of Service
          </Link>
        </div>
        <p className="text-center mt-4">
          © {new Date().getFullYear()} Neuracare. For educational and demonstration purposes.
        </p>
      </footer>
    </div>
  );
}
