export const CATEGORIES = [
  'Heart Health',
  'Nutrition',
  'Sleep',
  'Mental Health',
  'Skin',
  'Fitness',
  'General Health',
];

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=320&fit=crop';

export const articles = [
  {
    slug: 'heart-disease',
    title: 'Early Signs of Heart Disease',
    excerpt: 'Know the warning symptoms and when to see a cardiologist.',
    category: 'Heart Health',
    author: 'Dr. Sarah Johnson, Cardiologist',
    date: 'Jan 15, 2026',
    image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=500&h=320&fit=crop',
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
    category: 'Skin',
    author: 'Dr. Michael Chen, Dermatologist',
    date: 'Jan 10, 2026',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&h=320&fit=crop',
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
    category: 'General Health',
    author: 'Dr. Emily Rodriguez, Neurologist',
    date: 'Jan 5, 2026',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=500&h=320&fit=crop',
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
  {
    slug: 'sleep-health',
    title: 'Why Quality Sleep Matters for Your Health',
    excerpt: 'How sleep affects your heart, mood, and immune system — and simple habits that help.',
    category: 'Sleep',
    author: 'Dr. Lena Ortiz, Sleep Medicine',
    date: 'Feb 2, 2026',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&h=320&fit=crop',
    specialtyLink: '/find-doctors',
    ctaLabel: 'Find a Doctor',
    paragraphs: [
      'Sleep isn’t just downtime — it’s when your body repairs tissue, consolidates memory, and regulates hormones that affect appetite, mood, and immune function. Chronic poor sleep is linked to higher risk of heart disease, diabetes, and anxiety.',
    ],
    sections: [
      {
        heading: 'How much sleep do you need?',
        body: 'Most adults need 7–9 hours per night. Consistently sleeping less (or drastically more) is associated with worse cardiovascular and metabolic health, even if you feel used to it.',
      },
      {
        heading: 'Habits that improve sleep quality',
        body: 'Keep a consistent sleep and wake time, limit caffeine after midday, dim screens an hour before bed, and keep your bedroom cool and dark. If you regularly struggle to fall or stay asleep, a doctor can screen for underlying issues like sleep apnea.',
      },
    ],
  },
  {
    slug: 'nutrition-basics',
    title: 'Building a Balanced Plate: Nutrition Basics',
    excerpt: 'A simple framework for balanced meals, portion sizes, and reading nutrition labels.',
    category: 'Nutrition',
    author: 'Dr. Aisha Bello, Clinical Nutrition',
    date: 'Jan 28, 2026',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=320&fit=crop',
    specialtyLink: '/find-doctors',
    ctaLabel: 'Find a Doctor',
    paragraphs: [
      'Good nutrition doesn’t require strict rules or eliminating entire food groups. A balanced plate — built around vegetables, lean protein, whole grains, and healthy fats — covers most people’s needs.',
    ],
    sections: [
      {
        heading: 'A simple plate framework',
        body: 'Aim for half your plate as vegetables and fruit, a quarter as lean protein (poultry, fish, beans, tofu), and a quarter as whole grains or starchy vegetables, plus a small amount of healthy fat like olive oil or avocado.',
      },
      {
        heading: 'Reading nutrition labels',
        body: 'Check serving size first, since other numbers scale from it. Watch added sugars and sodium, and favor foods with recognizable, whole-food ingredients over heavily processed options.',
      },
    ],
  },
  {
    slug: 'managing-anxiety',
    title: 'Understanding and Managing Anxiety',
    excerpt: 'Recognizing common symptoms and evidence-based strategies that can help.',
    category: 'Mental Health',
    author: 'Dr. Marcus Webb, Psychiatry',
    date: 'Jan 22, 2026',
    image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=500&h=320&fit=crop',
    specialtyLink: '/find-doctors',
    ctaLabel: 'Find a Doctor',
    paragraphs: [
      'Occasional worry is normal, but persistent anxiety that interferes with daily life — work, relationships, sleep — may be a treatable condition rather than just "stress."',
    ],
    sections: [
      {
        heading: 'Common symptoms',
        body: 'Racing thoughts, restlessness, muscle tension, difficulty concentrating, and physical symptoms like a racing heart or upset stomach can all be signs of an anxiety disorder, especially when they persist for weeks.',
      },
      {
        heading: 'What can help',
        body: 'Regular exercise, sleep, and limiting caffeine/alcohol help many people. Cognitive behavioral therapy and, in some cases, medication are effective evidence-based treatments — a doctor or therapist can help find the right combination.',
      },
    ],
  },
  {
    slug: 'diabetes-management',
    title: 'Everyday Diabetes Management Tips',
    excerpt: 'Blood sugar monitoring, diet, and lifestyle habits for living well with diabetes.',
    category: 'General Health',
    author: 'Dr. Priya Nair, Endocrinology',
    date: 'Jan 18, 2026',
    image: 'https://images.unsplash.com/photo-1554177255-61502b352de3?w=500&h=320&fit=crop',
    specialtyLink: '/find-doctors',
    ctaLabel: 'Find a Doctor',
    paragraphs: [
      'Managing diabetes well is about consistent daily habits more than occasional big changes. Small, sustainable routines around monitoring, diet, and activity make the biggest difference over time.',
    ],
    sections: [
      {
        heading: 'Monitoring and medication',
        body: 'Check blood sugar as often as your care plan recommends, and take medications on schedule. Keeping a simple log helps you and your doctor spot patterns and adjust treatment.',
      },
      {
        heading: 'Diet and activity habits',
        body: 'Favor high-fiber, low-glycemic foods, spread carbohydrates evenly across meals, and aim for regular movement — even short walks after meals can help stabilize blood sugar.',
      },
    ],
  },
  {
    slug: 'cold-vs-flu',
    title: 'Common Cold vs. Flu: Know the Difference',
    excerpt: 'Comparing symptoms and duration so you know when to rest and when to call a doctor.',
    category: 'General Health',
    author: 'Dr. Tom Baker, Family Medicine',
    date: 'Jan 12, 2026',
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&h=320&fit=crop',
    specialtyLink: '/find-doctors',
    ctaLabel: 'Find a Doctor',
    paragraphs: [
      'Colds and flu share some symptoms — congestion, cough, sore throat — which makes them easy to confuse. Flu tends to come on faster and hit harder.',
    ],
    sections: [
      {
        heading: 'Key symptom differences',
        body: 'Colds usually develop gradually with mild symptoms. Flu typically starts suddenly with high fever, body aches, chills, and fatigue that can last a week or more.',
      },
      {
        heading: 'When to see a doctor',
        body: 'Most colds resolve with rest and fluids. See a doctor for flu-like symptoms if you’re at higher risk of complications, symptoms are severe, or you’re not improving after several days — early antiviral treatment can help with flu.',
      },
    ],
  },
  {
    slug: 'joint-health-exercise',
    title: 'Exercise Tips for Healthy Joints',
    excerpt: 'Low-impact routines and habits that help protect your joints as you stay active.',
    category: 'Fitness',
    author: 'Dr. Grace Kim, Orthopedics',
    date: 'Jan 8, 2026',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=320&fit=crop',
    specialtyLink: '/find-doctors',
    ctaLabel: 'Find a Doctor',
    paragraphs: [
      'Staying active is one of the best things you can do for joint health, but the wrong routine — or ignoring warning signs — can do more harm than good.',
    ],
    sections: [
      {
        heading: 'Low-impact options',
        body: 'Swimming, cycling, and walking put less stress on joints than high-impact sports while still building strength and endurance. Pairing cardio with light strength training helps support the muscles around your joints.',
      },
      {
        heading: 'Warning signs to watch for',
        body: 'Sharp pain, swelling that doesn’t subside, or joint pain that worsens with activity are signs to slow down and check in with a doctor rather than pushing through.',
      },
    ],
  },
];

export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

export function getArticleImage(article) {
  return article?.image || FALLBACK_IMAGE;
}

export function estimateReadingTime(article) {
  const words = [
    ...(article.paragraphs || []),
    ...(article.sections || []).flatMap((section) => [section.heading, section.body]),
  ]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function getRelatedArticles(article, count = 3) {
  const others = articles.filter((candidate) => candidate.slug !== article.slug);
  const sameCategory = others.filter((candidate) => candidate.category === article.category);
  const rest = others.filter((candidate) => candidate.category !== article.category);
  return [...sameCategory, ...rest].slice(0, count);
}
