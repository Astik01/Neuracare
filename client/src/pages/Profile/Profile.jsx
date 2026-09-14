import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../hooks/useDarkMode';
import ErrorState from '../../components/ErrorState';

const MIN_PASSWORD_LENGTH = 8;

function initialsFor(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function Profile() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, toggleDarkMode] = useDarkMode();

  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileErrors, setProfileErrors] = useState({});
  const [profileStatus, setProfileStatus] = useState('idle');
  const [profileError, setProfileError] = useState(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifStatus, setNotifStatus] = useState('idle');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordStatus, setPasswordStatus] = useState('idle');
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);
    apiFetch('/users/me', { token })
      .then((data) => {
        if (cancelled) return;
        setProfile(data.user);
        setName(data.user.name || '');
        setPhone(data.user.phone || '');
        setNotificationsEnabled(data.user.notificationsEnabled !== false);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [token, retryCount]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setProfileErrors({ name: 'Name is required.' });
      return;
    }
    setProfileErrors({});
    setProfileStatus('saving');
    setProfileError(null);
    try {
      const data = await apiFetch('/users/me', {
        method: 'PATCH',
        token,
        body: { name: name.trim(), phone: phone.trim() },
      });
      setProfile(data.user);
      setProfileStatus('success');
    } catch (err) {
      setProfileError(err.message);
      setProfileStatus('error');
    }
  }

  async function handleNotificationsSubmit(event) {
    event.preventDefault();
    setNotifStatus('saving');
    try {
      const data = await apiFetch('/users/me', {
        method: 'PATCH',
        token,
        body: { notificationsEnabled },
      });
      setProfile(data.user);
      setNotifStatus('success');
    } catch {
      setNotifStatus('error');
    }
  }

  function validatePasswordForm() {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required.';
    if (!passwordForm.newPassword || passwordForm.newPassword.length < MIN_PASSWORD_LENGTH) {
      errors.newPassword = `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    const errors = validatePasswordForm();
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setPasswordStatus('saving');
    setPasswordError(null);
    try {
      await apiFetch('/users/me/password', {
        method: 'PATCH',
        token,
        body: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      });
      setPasswordStatus('success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message);
      setPasswordStatus('error');
    }
  }

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <div className="mt-6 animate-pulse space-y-4">
          <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <div className="mt-6">
          <ErrorState message={error} onRetry={() => setRetryCount((count) => count + 1)} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>

      <div className="mt-6 flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-xl font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          {initialsFor(profile.name) || '🙂'}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            {profile.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email}</p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
          Profile Information
        </h2>
        <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4" noValidate>
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </label>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            {profileErrors.name && (
              <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {profileErrors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="profile-email"
              value={profile.email}
              disabled
              className="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
            />
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Contact support to change your email address.
            </p>
          </div>
          <div>
            <label htmlFor="profile-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Phone
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 555 010 1234"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {profileStatus === 'success' && (
            <p className="text-sm text-brand-700 dark:text-brand-400">Profile updated.</p>
          )}
          {profileStatus === 'error' && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {profileError}
            </p>
          )}

          <button
            type="submit"
            disabled={profileStatus === 'saving'}
            className="rounded-lg bg-brand-700 px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800 disabled:opacity-60"
          >
            {profileStatus === 'saving' ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
          Account Settings
        </h2>

        <div className="mt-4 border-b border-slate-100 pb-6 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</h3>
          <form onSubmit={handlePasswordSubmit} className="mt-3 space-y-3" noValidate>
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((form) => ({ ...form, currentPassword: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              {passwordErrors.currentPassword && (
                <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((form) => ({ ...form, newPassword: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              {passwordErrors.newPassword && (
                <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((form) => ({ ...form, confirmPassword: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              {passwordErrors.confirmPassword && (
                <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            {passwordStatus === 'success' && (
              <p className="text-sm text-brand-700 dark:text-brand-400">Password updated.</p>
            )}
            {passwordStatus === 'error' && (
              <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              disabled={passwordStatus === 'saving'}
              className="rounded-lg bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-60 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {passwordStatus === 'saving' ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="mt-6 border-b border-slate-100 pb-6 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notifications</h3>
          <form onSubmit={handleNotificationsSubmit} className="mt-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-200">
                Email me about my appointments
              </span>
            </label>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              This preference is saved to your account, but Neuracare doesn't send any emails yet
              in this demo — nothing will actually be delivered.
            </p>
            <button
              type="submit"
              disabled={notifStatus === 'saving'}
              className="mt-3 rounded-lg bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-60 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {notifStatus === 'saving' ? 'Saving…' : 'Save Preference'}
            </button>
            {notifStatus === 'success' && (
              <p className="mt-2 text-sm text-brand-700 dark:text-brand-400">Preference saved.</p>
            )}
            {notifStatus === 'error' && (
              <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                Something went wrong. We couldn't save that. Please try again.
              </p>
            )}
          </form>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Appearance</h3>
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">Switch between light and dark mode.</p>
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-pressed={isDark}
              className="flex-shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
          Account Actions
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
      </section>
    </div>
  );
}
