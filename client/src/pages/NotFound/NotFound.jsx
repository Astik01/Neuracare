import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-slate-600 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="font-medium text-teal-700 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
