import { Link } from 'react-router-dom';
import { articles } from '../../data/articles';

const ARTICLE_IMAGES = {
  'heart-disease': 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=500&h=320&fit=crop',
  dermatologist: 'https://images.unsplash.com/photo-1642844816891-14ecb3667a2f?w=500&h=320&fit=crop',
  migraines: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=500&h=320&fit=crop',
};
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=320&fit=crop';

export default function HealthLibrary() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Health Library</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-white">
        Medical Articles &amp; Health Tips
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        Evidence-based reads to help you make informed decisions about your health.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li
            key={article.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800"
          >
            <img
              src={ARTICLE_IMAGES[article.slug] || FALLBACK_IMAGE}
              alt=""
              className="h-40 w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {article.title}
              </h2>
              <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300">
                {article.excerpt}
              </p>
              <Link
                to={`/health-library/${article.slug}`}
                className="mt-4 text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
              >
                Read article →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
