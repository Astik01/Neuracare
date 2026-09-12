import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

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
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm text-slate-500">Name</dt>
          <dd className="text-slate-900">{profile.name}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Email</dt>
          <dd className="text-slate-900">{profile.email}</dd>
        </div>
      </dl>
    </div>
  );
}
