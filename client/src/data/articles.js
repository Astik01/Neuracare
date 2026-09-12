export const articles = [
  {
    slug: 'heart-disease',
    title: 'Early Signs of Heart Disease',
    excerpt: 'Know the warning symptoms and when to see a cardiologist.',
    author: 'Dr. Sarah Johnson, Cardiologist',
    date: 'Jan 15, 2026',
    specialtyLink: '/find-doctors?specialty=cardiology',
    ctaLabel: 'Book a Cardiologist',
    paragraphs: [
      'Heart disease remains one of the leading causes of death worldwide. Recognizing early warning signs can lead to earlier diagnosis and better outcomes.',
    ],
    sections: [
      {
        heading: 'Common early symptoms',
        body: 'Chest discomfort (pressure, tightness, or pain), shortness of breath—especially with activity—fatigue, and swelling in the legs or ankles can signal heart issues. Some people experience jaw or back pain, nausea, or lightheadedness.',
      },
      {
        heading: 'When to see a cardiologist',
        body: "If you have risk factors (family history, high blood pressure, diabetes, smoking, obesity) or notice any of these symptoms regularly, it's important to get evaluated. A cardiologist can run tests such as ECG, stress tests, or echocardiograms to assess your heart health.",
      },
    ],
  },
  {
    slug: 'dermatologist',
    title: 'When to See a Dermatologist',
    excerpt: 'Skin changes, rashes, and moles: when to get them checked.',
    author: 'Dr. Michael Chen, Dermatologist',
    date: 'Jan 10, 2026',
    specialtyLink: '/find-doctors?specialty=dermatology',
    ctaLabel: 'Book a Dermatologist',
    paragraphs: [
      'Your skin can signal everything from minor irritation to serious conditions. Knowing when to see a dermatologist helps you get the right care at the right time.',
    ],
    sections: [
      {
        heading: 'Skin changes to watch for',
        body: 'New or changing moles (asymmetry, irregular borders, color variation, diameter larger than a pencil eraser), persistent rashes, unexplained itching, open sores that don’t heal, or sudden acne in adults warrant a professional evaluation.',
      },
      {
        heading: 'Common reasons to book a visit',
        body: "Acne that doesn't improve with over-the-counter products, eczema or psoriasis flare-ups, hair loss, nail changes, or any lesion that bleeds, crusts, or grows. Skin cancer screening is also recommended for at-risk individuals or annual check-ups.",
      },
    ],
  },
  {
    slug: 'migraines',
    title: 'Understanding Migraines',
    excerpt: 'Triggers, types, and when to seek specialist care.',
    author: 'Dr. Emily Rodriguez, Neurologist',
    date: 'Jan 5, 2026',
    specialtyLink: '/find-doctors',
    ctaLabel: 'Find a Doctor',
    paragraphs: [
      'Migraines are more than "bad headaches." They’re a neurological condition that can cause throbbing pain, nausea, sensitivity to light and sound, and sometimes aura (visual or sensory disturbances).',
    ],
    sections: [
      {
        heading: 'Triggers and types',
        body: 'Common triggers include stress, lack of sleep, certain foods (aged cheese, chocolate, caffeine), dehydration, hormonal changes, and bright lights or loud noises. Migraines can be episodic (fewer than 15 days per month) or chronic (15 or more headache days per month).',
      },
      {
        heading: 'When to seek specialist care',
        body: 'If headaches are severe, frequent, or interfere with your life, or if you experience a sudden "worst headache of your life," vision changes, or numbness, see a doctor. A neurologist or headache specialist can help with diagnosis, preventive medication, and acute treatments.',
      },
    ],
  },
];

export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}
