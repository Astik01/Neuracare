const STATS = [
  { label: 'Founded', value: '2019' },
  { label: 'Countries', value: '50+' },
  { label: 'Providers', value: '500+' },
  { label: 'Patients', value: '10K+' },
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
        <dl className="-mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
    </div>
  );
}
