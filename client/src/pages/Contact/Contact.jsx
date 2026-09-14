import { useState } from 'react';
import { apiFetch } from '../../api/client';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT_DETAILS = [
  { label: 'Email', value: 'support@neuracare.com' },
  { label: 'Phone', value: '+1 (555) 010-1234' },
  { label: 'Hours', value: 'Mon–Fri, 9am–6pm' },
];

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Please enter your name.';
  if (!form.email.trim()) {
    errors.email = 'Please enter your email.';
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!form.subject.trim()) errors.subject = 'Please enter a subject.';
  if (!form.message.trim()) {
    errors.message = 'Please enter a message.';
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.';
  }
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField(field) {
    return (event) => {
      const { value } = event.target;
      setForm((current) => ({ ...current, [field]: value }));
      setFieldErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          ✓
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-slate-900 dark:text-white">
          Message Sent
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Thanks for contacting Neuracare. We'll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          Send another message
        </button>
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
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            {fieldErrors.name && (
              <p id="name-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.name}
              </p>
            )}
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
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Subject
            </label>
            <input
              id="subject"
              value={form.subject}
              onChange={updateField('subject')}
              aria-invalid={Boolean(fieldErrors.subject)}
              aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            {fieldErrors.subject && (
              <p id="subject-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.subject}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Message
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={updateField('message')}
              rows={4}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? 'message-error' : undefined}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            {fieldErrors.message && (
              <p id="message-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.message}
              </p>
            )}
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
