import { Link } from 'react-router-dom';
import { articles } from '../../data/articles';

export default function HealthLibrary() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-sm font-medium text-teal-700 mb-2">Health Library</p>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Medical Articles &amp; Health Tips</h1>
      <p className="text-slate-600 mb-8">
        Evidence-based reads to help you make informed decisions about your health.
      </p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.slug} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">{article.title}</h2>
            <p className="text-sm text-slate-600 mb-3">{article.excerpt}</p>
            <Link
              to={`/health-library/${article.slug}`}
              className="text-sm font-medium text-teal-700 hover:underline"
            >
              Read article →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
