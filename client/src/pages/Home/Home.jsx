import { Link } from 'react-router-dom';
import { useTilt } from '../../hooks/useTilt';

const TRUST_STATS = [
  { value: '500+', label: 'Verified doctors' },
  { value: '10K+', label: 'Patients helped' },
  { value: '4.9/5', label: 'Average rating' },
];

const FEATURES = [
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

const STEPS = [
  {
    number: '01',
    title: 'Tell us what’s wrong',
    description: 'Add your symptoms to the checker or search doctors by specialty directly.',
  },
  {
    number: '02',
    title: 'Review your matches',
    description: 'See likely conditions and urgency, or compare doctor ratings and fees.',
  },
  {
    number: '03',
    title: 'Book your appointment',
    description: 'Confirm a date and time and get everything you need in one place.',
  },
];

export default function Home() {
  const tilt = useTilt();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className="mb-4 inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              Trusted virtual care
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-5xl">
              Your health, understood faster.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600 dark:text-slate-300">
              Check your symptoms, find the right doctor, and book an appointment in minutes —
              all in one calm, uncluttered place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/symptom-checker"
                className="rounded-full bg-brand-700 px-6 py-3 font-medium text-white shadow-soft transition hover:bg-brand-800"
              >
                Check Symptoms
              </Link>
              <Link
                to="/find-doctors"
                className="rounded-full border border-brand-700 px-6 py-3 font-medium text-brand-700 transition hover:bg-brand-50 dark:hover:bg-slate-800"
              >
                Find a Doctor
              </Link>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </dd>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div
              ref={tilt.ref}
              onMouseMove={tilt.onMouseMove}
              onMouseLeave={tilt.onMouseLeave}
              className="relative rounded-3xl shadow-glow transition-transform duration-200 ease-out will-change-transform"
            >
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=1000&fit=crop"
                alt="Doctor reviewing a patient's chart on a tablet during a telehealth consultation"
                className="h-full w-full rounded-3xl object-cover"
              />
            </div>

            <div className="absolute -left-6 top-8 hidden animate-float rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-800 sm:block">
              <p className="text-xs text-slate-500 dark:text-slate-400">Symptom match</p>
              <p className="font-display text-lg font-bold text-brand-700 dark:text-brand-400">
                96% confidence
              </p>
            </div>

            <div
              className="absolute -bottom-6 -right-4 hidden animate-float rounded-2xl bg-white p-4 shadow-soft dark:bg-slate-800 sm:block"
              style={{ animationDelay: '1.5s' }}
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">Next available</p>
              <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Today, 4:30 PM
              </p>
            </div>
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
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-800/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-brand-700 dark:text-brand-400">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
              Three steps to your next appointment
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number}>
                <p className="font-display text-3xl font-bold text-brand-200 dark:text-brand-900">
                  {step.number}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
