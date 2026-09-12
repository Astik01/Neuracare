import { Link, useParams } from 'react-router-dom';
import { getArticleBySlug } from '../../data/articles';

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Article not found</h1>
        <Link to="/health-library" className="text-teal-700 hover:underline">
          Back to Health Library
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-16">
      <Link to="/health-library" className="text-sm text-teal-700 hover:underline">
        ← Health Library
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">{article.title}</h1>
      <p className="text-sm text-slate-500 mb-8">
        By {article.author} · {article.date}
      </p>

      {article.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 20)} className="text-slate-700 mb-4">
          {paragraph}
        </p>
      ))}

      {article.sections.map((section) => (
        <div key={section.heading} className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{section.heading}</h2>
          <p className="text-slate-700">{section.body}</p>
        </div>
      ))}

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900 mb-2">Talk to a specialist</h3>
        <Link
          to={article.specialtyLink}
          className="inline-block rounded bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          {article.ctaLabel}
        </Link>
      </div>
    </article>
  );
}
