const STATS = [
  { label: 'Founded', value: '2019' },
  { label: 'Countries', value: '50+' },
  { label: 'Providers', value: '500+' },
  { label: 'Patients', value: '10K+' },
];

const VALUES = [
  {
    title: 'Accessibility',
    description:
      'Quality care shouldn’t depend on your zip code or your schedule — we meet you wherever you are, day or night.',
    icon: (
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: 'Precision',
    description:
      'AI-assisted insights paired with licensed clinicians, so the guidance you get is both fast and sound.',
    icon: (
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    ),
  },
  {
    title: 'Trust',
    description:
      'Every provider on our platform is verified and licensed, and your health data stays protected.',
    icon: (
      <path
        d="M12 3 4 6v6c0 4.5 3.2 7.6 8 9 4.8-1.4 8-4.5 8-9V6l-8-3Zm-1.2 10.2L8.5 11l-1.4 1.4 3.7 3.7 6-6-1.4-1.4-4.6 4.5Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
      />
    ),
  },
];

const OFFERINGS = [
  {
    title: 'AI Symptom Checker',
    description:
      'Describe how you feel and get ranked, evidence-informed condition matches in seconds.',
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
    title: 'Doctor Discovery',
    description: 'Search licensed specialists by specialty, rating, and availability to find your fit.',
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
    title: 'Appointment Booking',
    description: 'Book, reschedule, or cancel visits in a few taps — no phone tag required.',
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

const TEAM = [
  {
    name: 'Dr. Amara Whitfield',
    role: 'Chief Medical Officer',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
  },
  {
    name: 'Jordan Lee',
    role: 'Head of Product',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
  },
  {
    name: 'Priya Nair',
    role: 'Head of Engineering',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
  },
  {
    name: 'Marcus Chen',
    role: 'Patient Experience Lead',
    photo: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop',
  },
];

export default function About() {
  return (
    <div>
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden sm:min-h-[480px]">
        <img
          src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1920&h=900&fit=crop"
          alt="Team of healthcare professionals collaborating in a clinic"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/30" />

        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-brand-300">Our Story</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Transforming Healthcare One Click at a Time
            </h1>
            <p className="mt-5 text-slate-100">
              Neuracare was founded in 2019 with a simple yet powerful vision: quality healthcare
              should be accessible to everyone, everywhere. We believe technology can bridge the
              gap between patients and providers — making medical consultations more convenient,
              affordable, and precise.
            </p>
            <p className="mt-4 text-slate-100">
              Our platform blends clinical-grade AI with a curated network of licensed healthcare
              professionals to deliver truly personalised care. From symptom analysis to
              specialist consultations and long-term health management, we're your end-to-end
              health partner.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:-mt-10 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-card dark:border-slate-700 dark:bg-slate-800"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-2xl font-bold text-brand-700 dark:text-brand-400">
                {stat.value}
              </dd>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </dl>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Our Values</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
            What drives how we build
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  {value.icon}
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-800 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-brand-700 dark:text-brand-400">What We Offer</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
              One platform, from first symptom to booked visit
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {OFFERINGS.map((offering) => (
              <div
                key={offering.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                    {offering.icon}
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                  {offering.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {offering.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Leadership</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
            Meet the team
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Placeholder team profiles for this demo build — swap in real photos and bios when
            available.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-card dark:border-slate-700 dark:bg-slate-800"
            >
              <img
                src={member.photo}
                alt=""
                className="mx-auto h-20 w-20 rounded-full object-cover"
              />
              <p className="mt-4 font-display font-semibold text-slate-900 dark:text-white">
                {member.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
