import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthShell from '../../components/AuthShell';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell eyebrow="Welcome back to calmer, clearer healthcare.">
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Log in</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        New here?{' '}
        <Link to="/signup" className="font-medium text-brand-700 hover:underline dark:text-brand-400">
          Create an account
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
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
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthShell>
  );
}
