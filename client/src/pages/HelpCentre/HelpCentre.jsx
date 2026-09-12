import { useState } from 'react';
import { faqCategories } from '../../data/faqs';

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-slate-900"
      >
        <span>{question}</span>
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <p className="px-4 pb-3 text-sm text-slate-600">{answer}</p>}
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
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-sm font-medium text-teal-700 mb-2">Help Centre</p>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">How can we help?</h1>

      <label htmlFor="help-search" className="sr-only">
        Search FAQs
      </label>
      <input
        id="help-search"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search FAQs…"
        className="w-full max-w-sm mb-8 rounded border border-slate-300 px-3 py-2"
      />

      {filteredCategories.length === 0 && <p>No FAQs match your search.</p>}

      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div key={category.category}>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">{category.category}</h2>
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
