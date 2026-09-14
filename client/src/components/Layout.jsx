import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';
import ChatWidget from './ChatWidget/ChatWidget';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/symptom-checker', label: 'Symptom Checker' },
  { to: '/find-doctors', label: 'Find Doctors' },
  { to: '/health-library', label: 'Health Library' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const FOOTER_COLUMNS = [
  {
    heading: 'Explore',
    links: [
      { to: '/symptom-checker', label: 'Symptom Checker' },
      { to: '/find-doctors', label: 'Find Doctors' },
      { to: '/health-library', label: 'Health Library' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { to: '/help-centre', label: 'Help Centre' },
      { to: '/privacy-policy', label: 'Privacy Policy' },
      { to: '/terms-of-service', label: 'Terms of Service' },
    ],
  },
];

function UserAvatarIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" fill="currentColor" />
      <path
        d="M4.5 19.5a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7 text-brand-600 dark:text-brand-400"
      fill="none"
    >
      <path
        d="M12 21s-7.5-4.6-10-9.3C.5 8.1 2.3 4.5 6 4c2.1-.3 4 .8 6 3 2-2.2 3.9-3.3 6-3 3.7.5 5.5 4.1 4 7.7C19.5 16.4 12 21 12 21Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M3 12h3.5l1.8-3.2L11 15l2-5.5 1.6 2.5H21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function initialsFor(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function DesktopNavLink({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `border-b-2 pb-0.5 text-sm font-medium transition ${
          isActive
            ? 'border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-400'
            : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-brand-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-brand-400'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function MobileNavLink({ to, label, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `block rounded-lg border-l-4 px-3 py-2 text-sm font-medium transition ${
          isActive
            ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
            : 'border-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const initials = initialsFor(user?.name);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 transition hover:ring-2 hover:ring-brand-300 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:ring-brand-700"
      >
        {initials || <UserAvatarIcon />}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-soft dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {user?.name || 'Account'}
            </p>
            {user?.email && (
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            )}
          </div>
          <Link
            role="menuitem"
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Profile
          </Link>
          <Link
            role="menuitem"
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Settings
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDark, toggleDarkMode] = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-brand-700 focus:shadow-lg"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6"
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-display font-bold text-brand-700 dark:text-brand-400"
          >
            <BrandMark />
            Neuracare
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <DesktopNavLink {...link} />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className="hidden text-sm font-medium text-slate-600 transition hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400 sm:inline-block"
              >
                My Bookings
              </Link>
            )}

            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {isAuthenticated ? (
              <div className="hidden sm:block">
                <UserMenu user={user} onLogout={handleLogout} />
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full bg-brand-700 px-4 py-1.5 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 sm:inline-block"
              >
                Get Started
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:hidden">
            {isAuthenticated && (
              <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  {initialsFor(user?.name) || <UserAvatarIcon />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name || 'Account'}
                  </p>
                  {user?.email && (
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            )}
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <MobileNavLink {...link} onNavigate={closeMobileMenu} />
                </li>
              ))}
              {isAuthenticated ? (
                <>
                  <li>
                    <MobileNavLink to="/my-bookings" label="My Bookings" onNavigate={closeMobileMenu} />
                  </li>
                  <li>
                    <MobileNavLink to="/profile" label="Profile" onNavigate={closeMobileMenu} />
                  </li>
                  <li>
                    <MobileNavLink to="/settings" label="Settings" onNavigate={closeMobileMenu} />
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="block w-full rounded-lg border-l-4 border-transparent px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block rounded-lg bg-brand-700 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
                  >
                    Get Started
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <ChatWidget />

      <footer className="border-t border-slate-200 bg-white py-12 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 text-lg font-display font-bold text-brand-700 dark:text-brand-400">
              <BrandMark />
              Neuracare
            </Link>
            <p className="mt-3 max-w-xs text-slate-500 dark:text-slate-400">
              Symptom checking, doctor discovery, and appointment booking in one clear, calm
              experience.
            </p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="font-display font-semibold text-slate-900 dark:text-slate-100">
                {column.heading}
              </p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="hover:text-brand-700 dark:hover:text-brand-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-slate-100 px-4 pt-6 text-center dark:border-slate-800 sm:px-6">
          <p>© {new Date().getFullYear()} Neuracare. For educational and demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
}
