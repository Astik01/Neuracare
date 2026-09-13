import { useState } from 'react';
import { apiFetch } from '../../api/client';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };

const CONTACT_DETAILS = [
  { label: 'Email', value: 'support@neuracare.com' },
  { label: 'Phone', value: '+1 (555) 010-1234' },
  { label: 'Hours', value: 'Mon–Fri, 9am–6pm' },
];

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiFetch('/contacts', { method: 'POST', body: form });
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl dark:bg-brand-900/40">
          ✅
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-slate-900 dark:text-white">
          Message sent
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          We'll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Get in touch</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
            Contact Us
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Questions about a booking, your account, or our platform? Send us a message and we'll
            reply within one business day.
          </p>
          <dl className="mt-8 space-y-4">
            {CONTACT_DETAILS.map((detail) => (
              <div key={detail.label}>
                <dt className="text-sm text-slate-500 dark:text-slate-400">{detail.label}</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800"
          noValidate
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={updateField('name')}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Subject
            </label>
            <input
              id="subject"
              value={form.subject}
              onChange={updateField('subject')}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Message
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={updateField('message')}
              required
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand-700 px-4 py-2.5 font-medium text-white shadow-soft transition hover:bg-brand-800 disabled:opacity-60"
          >
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
