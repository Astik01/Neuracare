const SECTIONS = [
  {
    heading: '1. Information We Collect',
    body: 'We collect information you provide (name, email, phone, date of birth, health symptoms, consultation notes, and payment details) and information from your use of our platform (device, IP address, logs). Health information is treated as Protected Health Information (PHI) where applicable.',
  },
  {
    heading: '2. How We Use Your Information',
    body: 'We use your information to provide telemedicine services, process bookings, facilitate consultations, send reminders, improve our AI and platform, and comply with legal obligations. We do not sell your health data.',
  },
  {
    heading: '3. Data Security',
    body: 'We use industry-standard encryption (TLS/SSL), access controls, and secure storage. Our systems are designed to meet HIPAA and GDPR requirements. We conduct regular risk assessments and training.',
  },
  {
    heading: '4. Your Rights',
    body: 'You have the right to access, correct, export, or delete your data where permitted by law. You may withdraw consent or object to certain processing. To exercise these rights, contact us at privacy@neuracare.com.',
  },
  {
    heading: '5. Data Retention',
    body: 'We retain health and account data as required by law and our legitimate business needs. You may request deletion subject to legal retention obligations.',
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-1 font-display text-3xl font-bold text-slate-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Last updated: January 2026</p>
      <p className="mb-6 text-slate-700 dark:text-slate-300">
        Neuracare Inc. ("we", "us", "our") is committed to protecting your personal and health
        information. This policy describes how we collect, use, disclose, and safeguard
        information in compliance with HIPAA, GDPR, and applicable laws.
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
