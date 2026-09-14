import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, articles, estimateReadingTime, getArticleImage } from '../../data/articles';

function sortByDateDesc(list) {
  return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function ArticleCard({ article }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800">
      <img src={getArticleImage(article)} alt="" className="h-40 w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-400">
            {article.category}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {estimateReadingTime(article)}
          </span>
        </div>
        <h2 className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
          {article.title}
        </h2>
        <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300">{article.excerpt}</p>
        <Link
          to={`/health-library/${article.slug}`}
          className="mt-4 text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
        >
          Read article →
        </Link>
      </div>
    </li>
  );
}

export default function HealthLibrary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((article) => {
      if (category && article.category !== category) return false;
      if (!query) return true;
      const haystack = `${article.title} ${article.excerpt} ${article.category}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [search, category]);

  const isBrowsing = !search.trim() && !category;
  const sorted = sortByDateDesc(filteredArticles);
  const featured = isBrowsing ? sorted[0] : null;
  const rest = featured ? sorted.slice(1) : sorted;

  function clearFilters() {
    setSearch('');
    setCategory('');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Health Library</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-white">
        Medical Articles &amp; Health Tips
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        Evidence-based reads to help you make informed decisions about your health.
      </p>

      <div className="mt-8">
        <label htmlFor="article-search" className="sr-only">
          Search articles
        </label>
        <input
          id="article-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles…"
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              category === ''
                ? 'bg-brand-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                category === cat
                  ? 'bg-brand-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-slate-600 dark:text-slate-300">No articles found.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full bg-brand-700 px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {featured && (
            <div className="mt-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Featured Article
              </p>
              <Link
                to={`/health-library/${featured.slug}`}
                className="grid gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:shadow-soft dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2"
              >
                <img src={getArticleImage(featured)} alt="" className="h-56 w-full object-cover sm:h-full" />
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-400">
                      {featured.category}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {estimateReadingTime(featured)}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {featured.title}
                  </h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{featured.excerpt}</p>
                  <span className="mt-4 text-sm font-medium text-brand-700 dark:text-brand-400">
                    Read article →
                  </span>
                </div>
              </Link>
            </div>
          )}

          <div className="mt-10">
            {!isBrowsing && (
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'} found
              </p>
            )}
            {isBrowsing && rest.length > 0 && (
              <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Latest Articles
              </p>
            )}
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
