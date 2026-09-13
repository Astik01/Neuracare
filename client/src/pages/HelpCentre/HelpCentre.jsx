import { useState } from 'react';
import { faqCategories } from '../../data/faqs';

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-slate-900 dark:text-white"
      >
        <span>{question}</span>
        <span aria-hidden="true" className="text-brand-600 dark:text-brand-400">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <p className="px-4 pb-3 text-sm text-slate-600 dark:text-slate-300">{answer}</p>
      )}
    </div>
  );
}

export default function HelpCentre() {
  const [search, setSearch] = useState('');

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.question.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Help Centre</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-white">
        How can we help?
      </h1>

      <label htmlFor="help-search" className="sr-only">
        Search FAQs
      </label>
      <input
        id="help-search"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search FAQs…"
        className="mb-10 mt-6 w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

      {filteredCategories.length === 0 && (
        <p className="text-slate-600 dark:text-slate-300">No FAQs match your search.</p>
      )}

      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div key={category.category}>
            <h2 className="mb-3 font-display text-lg font-semibold text-slate-900 dark:text-white">
              {category.category}
            </h2>
            <div className="space-y-2">
              {category.items.map((item) => (
                <FaqItem key={item.question} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
