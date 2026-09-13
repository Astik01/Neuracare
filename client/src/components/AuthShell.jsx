const BENEFITS = [
  'Free AI symptom checks, anytime',
  'Book verified specialists in minutes',
  'Your health history, all in one place',
];

export default function AuthShell({ eyebrow, children }) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden sm:my-10 sm:min-h-0 sm:rounded-3xl sm:shadow-soft lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-brand-700 p-10 text-white lg:flex">
        <div>
          <p className="font-display text-lg font-bold">Neuracare</p>
          <p className="mt-1 text-sm text-brand-100">{eyebrow}</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=700&h=700&fit=crop"
          alt="Smiling doctor in a clinic hallway"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <ul className="relative space-y-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-brand-50">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-shrink-0">
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.4 7.4a1 1 0 0 1-1.4 0L3.3 9.5a1 1 0 1 1 1.4-1.4L8 11.4l6.7-6.7a1 1 0 0 1 1.4 0Z"
                  clipRule="evenodd"
                />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center bg-white px-4 py-16 dark:bg-slate-900 sm:px-10">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
