import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/find-doctors', label: 'Find Doctors' },
  { to: '/symptom-checker', label: 'Symptom Checker' },
  { to: '/contact', label: 'Contact' },
];

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <nav
          aria-label="Main navigation"
          className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3"
        >
          <Link to="/" className="text-xl font-bold text-teal-700">
            Neuracare
          </Link>
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-slate-700 hover:text-teal-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/my-bookings" className="text-slate-700 hover:text-teal-700">
                  My Bookings
                </Link>
                <Link to="/profile" className="text-slate-700 hover:text-teal-700">
                  {user?.name || 'Profile'}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
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

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Neuracare. For educational and demonstration purposes.
      </footer>
    </div>
  );
}
