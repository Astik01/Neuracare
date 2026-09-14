import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTilt } from '../../hooks/useTilt';
import { apiFetch } from '../../api/client';
import { getArticleImage } from '../../data/articles';

const TRUST_HIGHLIGHTS = ['Licensed specialists', 'Private & secure', 'Available anytime'];

const QUICK_ACTIONS = [
  {
    title: 'Check Symptoms',
    description: 'Describe what you feel and get ranked, educational condition matches.',
    to: '/symptom-checker',
    icon: (
      <path
        d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2m-9 9-2 2m0-13 2 2m9 9 2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: 'Find a Doctor',
    description: 'Browse licensed specialists by specialty, rating, and availability.',
    to: '/find-doctors',
    icon: (
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'My Appointments',
    description: 'View, track, and manage the visits you have already booked.',
    to: '/my-bookings',
    icon: (
      <path
        d="M8 2v4m8-4v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Health Library',
    description: 'Read evidence-based articles on conditions, prevention, and wellness.',
    to: '/health-library',
    icon: (
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const HOW_IT_WORKS = [
  {
    number: '01',
    title: 'Describe symptoms',
    description: 'Add what you’re feeling in plain language — no medical jargon needed.',
    icon: (
      <path
        d="M21 12a8 8 0 1 1-3.4-6.5M21 3v5h-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    number: '02',
    title: 'Understand symptoms',
    description: 'Get a clear breakdown of possible conditions and how urgent they are.',
    icon: (
      <path
        d="M11 3a8 8 0 1 0 5.3 14.02L21 21m-10-8v4m0-8h.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    number: '03',
    title: 'Find specialist',
    description: 'See matched, licensed doctors ranked by rating, fee, and availability.',
    icon: (
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    number: '04',
    title: 'Book appointment',
    description: 'Pick a date and time that works for you and get an instant confirmation.',
    icon: (
      <path
        d="M8 2v4m8-4v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const BENEFITS = [
  {
    title: 'AI Symptom Checker',
    description:
      'Describe what you’re feeling and get a clear, ranked list of likely conditions in seconds.',
    icon: (
      <path
        d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2 2m-9 9-2 2m0-13 2 2m9 9 2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: 'Verified Specialists',
    description:
      'Browse licensed doctors by specialty, see real ratings, and pick the right fit for your care.',
    icon: (
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Book in Minutes',
    description:
      'Pick a date and time that works for you and get an instant confirmation — no phone calls.',
    icon: (
      <path
        d="M8 2v4m8-4v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const FALLBACK_DOCTOR_PHOTO =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop';

function PreviewCardSkeleton() {
  return (
    <li className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div className="h-40 w-full bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </li>
  );
}

function StarRating({ rating = 0 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-amber-500" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L10 1.5Z" />
      </svg>
      <span className="font-medium text-slate-700 dark:text-slate-200">{rating || '—'}</span>
    </span>
  );
}

export default function Home() {
  const tilt = useTilt();
  const [doctors, setDoctors] = useState([]);
  const [doctorsStatus, setDoctorsStatus] = useState('loading');
  const [previewArticles, setPreviewArticles] = useState([]);
  const [articlesStatus, setArticlesStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    apiFetch('/doctors')
      .then((data) => {
        if (cancelled) return;
        setDoctors((data.doctors || []).slice(0, 3));
        setDoctorsStatus('success');
      })
      .catch(() => {
        if (cancelled) return;
        setDoctorsStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/articles')
      .then((data) => {
        if (cancelled) return;
        setPreviewArticles((data.articles || []).slice(0, 3));
        setArticlesStatus('success');
      })
      .catch(() => {
        if (cancelled) return;
        setArticlesStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden sm:min-h-[640px]">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop"
          alt="Doctor reviewing a patient's chart on a tablet during a telehealth consultation"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/30" />

        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-xl animate-fade-up">
            <p className="mb-4 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur">
              Trusted virtual care
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Your health, understood faster.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-100">
              Check your symptoms, find the right doctor, and book an appointment in minutes —
              all in one calm, uncluttered place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/symptom-checker"
                className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white shadow-soft transition hover:bg-brand-700"
              >
                Check Symptoms
              </Link>
              <Link
                to="/find-doctors"
                className="rounded-full border border-white/70 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Find a Doctor
              </Link>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
              {TRUST_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-100">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 flex-shrink-0 text-brand-300">
                    <path
                      d="m4 10 4 4 8-8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          ref={tilt.ref}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          className="absolute bottom-8 left-4 hidden animate-float rounded-2xl bg-white p-4 shadow-soft transition-transform duration-200 ease-out will-change-transform dark:bg-slate-800 sm:left-6 sm:block"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">Example symptom match</p>
          <p className="font-display text-lg font-bold text-brand-700 dark:text-brand-400">
            96% confidence
          </p>
        </div>

        <div
          className="absolute right-4 top-8 hidden animate-float rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-800 sm:right-6 sm:block"
          style={{ animationDelay: '1.5s' }}
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">Example availability</p>
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Today, 4:30 PM
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Quick Actions</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
            Jump straight to what you need
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  {action.icon}
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                {action.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{action.description}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-700 group-hover:underline dark:text-brand-400">
                Go →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-800 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-brand-700 dark:text-brand-400">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
              How Neuracare Works
            </h2>
          </div>
          <div className="relative mt-14 grid gap-10 sm:grid-cols-4 sm:gap-6">
            <div
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-0.5 bg-brand-200 dark:bg-brand-700 sm:block"
            />
            {HOW_IT_WORKS.map((step) => (
              <div key={step.number} className="relative text-center sm:text-left">
                <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft sm:mx-0">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                    {step.icon}
                  </svg>
                </div>
                <p className="mt-4 font-display text-sm font-semibold text-brand-600 dark:text-brand-400">
                  Step {step.number}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Why Neuracare</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
            Everything you need to feel better, sooner
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  {benefit.icon}
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {(doctorsStatus === 'loading' || (doctorsStatus === 'success' && doctors.length > 0)) && (
        <section className="bg-slate-50 py-16 dark:bg-slate-800 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-brand-700 dark:text-brand-400">
                  Featured Doctors
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  Meet some of our specialists
                </h2>
              </div>
              <Link
                to="/find-doctors"
                className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
              >
                View all doctors →
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctorsStatus === 'loading' &&
                [1, 2, 3].map((index) => <PreviewCardSkeleton key={index} />)}
              {doctors.map((doctor) => (
                <li
                  key={doctor._id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900"
                >
                  <img
                    src={doctor.photo || FALLBACK_DOCTOR_PHOTO}
                    alt={doctor.name}
                    className="h-40 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                        {doctor.name}
                      </h3>
                      <StarRating rating={doctor.rating} />
                    </div>
                    <p className="text-sm capitalize text-brand-700 dark:text-brand-400">
                      {doctor.specialty}
                    </p>
                    <div className="mt-4 flex flex-1 items-end justify-between">
                      <p className="font-display font-semibold text-slate-900 dark:text-white">
                        {doctor.fee}
                      </p>
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
                      >
                        View profile →
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(articlesStatus === 'loading' || (articlesStatus === 'success' && previewArticles.length > 0)) && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Health Library</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                Learn something new about your health
              </h2>
            </div>
            <Link
              to="/health-library"
              className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
            >
              View all articles →
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articlesStatus === 'loading' &&
              [1, 2, 3].map((index) => <PreviewCardSkeleton key={index} />)}
            {previewArticles.map((article) => (
              <li
                key={article.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800"
              >
                <img
                  src={getArticleImage(article)}
                  alt={article.title}
                  className="h-40 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                    {article.title}
                  </h3>
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
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-brand-700 px-8 py-12 text-center shadow-soft sm:px-16">
          <h2 className="font-display text-3xl font-bold text-white">
            Ready to feel better sooner?
          </h2>
          <p className="mt-3 text-brand-100">
            Create a free account to save your bookings and health history.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-medium text-brand-700 shadow-soft transition hover:bg-brand-50"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
