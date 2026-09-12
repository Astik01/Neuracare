const STATS = [
  { label: 'Founded', value: '2019' },
  { label: 'Countries', value: '50+' },
  { label: 'Providers', value: '500+' },
  { label: 'Patients', value: '10K+' },
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-sm font-medium text-teal-700 mb-2">Our Story</p>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Transforming Healthcare One Click at a Time
      </h1>
      <p className="text-slate-700 mb-4">
        Neuracare was founded in 2019 with a simple yet powerful vision: quality healthcare
        should be accessible to everyone, everywhere. We believe technology can bridge the gap
        between patients and providers — making medical consultations more convenient,
        affordable, and precise.
      </p>
      <p className="text-slate-700 mb-8">
        Our platform blends clinical-grade AI with a curated network of licensed healthcare
        professionals to deliver truly personalised care. From symptom analysis to specialist
        consultations and long-term health management, we're your end-to-end health partner.
      </p>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-2xl font-bold text-teal-700">{stat.value}</dd>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </dl>
    </div>
  );
}
