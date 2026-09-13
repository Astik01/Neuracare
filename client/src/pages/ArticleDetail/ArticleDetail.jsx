import { Link, useParams } from 'react-router-dom';
import { getArticleBySlug } from '../../data/articles';

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

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Link
        to="/health-library"
        className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
      >
        ← Health Library
      </Link>
      <h1 className="mb-2 mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">
        {article.title}
      </h1>
      <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
        By {article.author} · {article.date}
      </p>

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
    </article>
  );
}
