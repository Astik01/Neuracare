import { Link, useParams } from 'react-router-dom';
import {
  estimateReadingTime,
  getArticleBySlug,
  getArticleImage,
  getRelatedArticles,
} from '../../data/articles';

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
          Article not found
        </h1>
        <Link to="/health-library" className="text-brand-700 hover:underline dark:text-brand-400">
          Back to Health Library
        </Link>
      </div>
    );
  }

  const relatedArticles = getRelatedArticles(article, 3);

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link
        to="/health-library"
        className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
      >
        ← Health Library
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-400">
          {article.category}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {estimateReadingTime(article)}
        </span>
      </div>

      <h1 className="mb-2 mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
        {article.title}
      </h1>
      <p className="mb-4 text-slate-600 dark:text-slate-300">{article.excerpt}</p>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        By {article.author} · {article.date}
      </p>

      <img
        src={getArticleImage(article)}
        alt=""
        className="mb-8 h-64 w-full rounded-2xl object-cover sm:h-80"
      />

      {article.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 20)} className="mb-4 text-slate-700 dark:text-slate-300">
          {paragraph}
        </p>
      ))}

      {article.sections.map((section) => (
        <div key={section.heading} className="mb-4">
          <h2 className="mb-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
            {section.heading}
          </h2>
          <p className="text-slate-700 dark:text-slate-300">{section.body}</p>
        </div>
      ))}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-2 font-display font-semibold text-slate-900 dark:text-white">
          Talk to a specialist
        </h3>
        <Link
          to={article.specialtyLink}
          className="inline-block rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-800"
        >
          {article.ctaLabel}
        </Link>
      </div>

      <p className="mt-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
        This article is for general health information only and is not medical advice. Consult a
        qualified healthcare professional for guidance specific to your situation.
      </p>

      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
            Related Articles
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <li
                key={related.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800"
              >
                <img src={getArticleImage(related)} alt="" className="h-32 w-full object-cover" />
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-400">
                    {related.category}
                  </span>
                  <h3 className="mt-1 font-display text-base font-semibold text-slate-900 dark:text-white">
                    {related.title}
                  </h3>
                  <Link
                    to={`/health-library/${related.slug}`}
                    className="mt-3 text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
                  >
                    Read article →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
