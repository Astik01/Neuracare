import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

function initialsFor(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/users/me', { token })
      .then((data) => {
        if (cancelled) return;
        setProfile(data.user);
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
  }, [token]);

  if (status === 'loading') return <p className="px-4 py-12">Loading profile…</p>;
  if (status === 'error')
    return (
      <p role="alert" className="px-4 py-12 text-red-600">
        {error}
      </p>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>

      <div className="mt-6 flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-xl font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          {initialsFor(profile.name) || '🙂'}
        </div>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Name</dt>
            <dd className="font-medium text-slate-900 dark:text-white">{profile.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Email</dt>
            <dd className="font-medium text-slate-900 dark:text-white">{profile.email}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
