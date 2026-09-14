import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-6xl font-bold text-brand-200 dark:text-brand-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-brand-700 px-6 py-3 font-medium text-white shadow-soft transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
      >
        Back to home
      </Link>
    </div>
  );
}
