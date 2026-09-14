import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function Settings() {
  const { user, logout } = useAuth();
  const [isDark, toggleDarkMode] = useDarkMode();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Settings</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
        Account Settings
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Manage your account and how Neuracare looks for you.
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Account
          </h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm text-slate-500 dark:text-slate-400">Name</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{user?.name || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{user?.email || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Appearance
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Switch between light and dark mode.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-pressed={isDark}
            className="flex-shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Session
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Sign out of Neuracare on this device.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
