import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthShell from '../../components/AuthShell';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell eyebrow="Join thousands getting clearer answers about their health.">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-700 hover:underline dark:text-brand-400">
          Log in
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">At least 8 characters.</p>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand-700 px-4 py-2.5 font-medium text-white shadow-soft transition hover:bg-brand-800 disabled:opacity-60 dark:bg-brand-600 dark:hover:bg-brand-500"
        >
          {isSubmitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
    </AuthShell>
  );
}
