const SECTIONS = [
  {
    heading: '1. Acceptance',
    body: 'By creating an account or using our website and services, you agree to be bound by these Terms and our Privacy Policy.',
  },
  {
    heading: '2. Services',
    body: 'Neuracare provides a platform for symptom checking (AI-assisted), doctor discovery, and telemedicine consultations. Our AI tools are for informational purposes only and do not replace professional medical advice, diagnosis, or treatment.',
  },
  {
    heading: '3. User Responsibilities',
    body: 'You must provide accurate information, be at least 18 years old (or have guardian consent), and use the service only for lawful purposes. You may not share your account or misuse the platform.',
  },
  {
    heading: '4. Appointments and Cancellations',
    body: 'Appointments are subject to doctor availability. Cancellations must be made at least 24 hours in advance for a full refund where applicable. No-shows may be charged according to our cancellation policy.',
  },
  {
    heading: '5. Limitation of Liability',
    body: 'To the fullest extent permitted by law, Neuracare is not liable for any indirect, incidental, or consequential damages arising from your use of the platform or reliance on AI-generated information.',
  },
];

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-1 font-display text-3xl font-bold text-slate-900 dark:text-white">
        Terms of Service
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Last updated: January 2026</p>
      <p className="mb-6 text-slate-700 dark:text-slate-300">
        By using the Neuracare platform, you agree to these Terms of Service. Please read them
        carefully.
      </p>
      {SECTIONS.map((section) => (
        <div key={section.heading} className="mb-5">
          <h2 className="mb-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
            {section.heading}
          </h2>
          <p className="text-slate-700 dark:text-slate-300">{section.body}</p>
        </div>
      ))}
    </div>
  );
}
