export const EMERGENCY_SYMPTOMS = [
  'chest pain',
  'shortness of breath',
  'difficulty breathing',
  'severe bleeding',
  'loss of consciousness',
  'unconsciousness',
  'unresponsive',
  'slurred speech',
];

export const EMERGENCY_CONDITIONS = ['heart attack'];

const CONDITION_INFO = {
  migraine: {
    info: 'A migraine is a neurological condition that causes intense, often throbbing headaches, sometimes with nausea or sensitivity to light and sound.',
    steps: [
      'Rest in a quiet, dark room',
      'Stay hydrated and avoid known triggers',
      'Consider an over-the-counter pain reliever if appropriate',
    ],
    specialtyKeywords: ['internal medicine', 'neurology'],
  },
  'tension headache': {
    info: 'Tension headaches are the most common type of headache, often caused by stress, poor posture, or muscle tension.',
    steps: [
      'Take short breaks to stretch your neck and shoulders',
      'Stay hydrated and manage stress levels',
      'Use an over-the-counter pain reliever if needed',
    ],
    specialtyKeywords: ['general practice', 'family medicine', 'internal medicine'],
  },
  sinusitis: {
    info: 'Sinusitis is inflammation of the sinuses, often following a cold, causing congestion, facial pressure, and headache.',
    steps: [
      'Use steam inhalation or a saline rinse to ease congestion',
      'Stay hydrated and rest',
      'See a doctor if symptoms last more than 10 days or worsen',
    ],
    specialtyKeywords: ['general practice', 'family medicine'],
  },
  stress: {
    info: "Physical symptoms like headaches or fatigue can sometimes be your body's response to ongoing stress.",
    steps: [
      'Practice relaxation techniques like deep breathing',
      'Prioritize sleep and regular movement',
      'Talk to a professional if stress feels unmanageable',
    ],
    specialtyKeywords: ['psychiatry', 'general practice'],
  },
  'viral infection': {
    info: 'Viral infections are common and usually resolve on their own with rest and supportive care.',
    steps: [
      'Rest and drink plenty of fluids',
      'Monitor your temperature',
      'See a doctor if symptoms worsen or last more than a week',
    ],
    specialtyKeywords: ['family medicine', 'internal medicine', 'general practice'],
  },
  'bacterial infection': {
    info: 'Bacterial infections may need medical evaluation, and some require antibiotics to treat effectively.',
    steps: [
      'See a doctor for an accurate diagnosis',
      'Avoid self-medicating with leftover antibiotics',
      'Rest and stay hydrated while awaiting care',
    ],
    specialtyKeywords: ['family medicine', 'internal medicine'],
  },
  flu: {
    info: 'The flu is a contagious respiratory illness that can cause fever, body aches, and fatigue lasting a week or more.',
    steps: [
      'Rest and stay hydrated',
      'Consider early care if you are at higher risk of complications',
      'See a doctor if breathing becomes difficult or symptoms worsen',
    ],
    specialtyKeywords: ['family medicine', 'internal medicine'],
  },
  'common cold': {
    info: 'The common cold is a mild viral infection of the nose and throat that usually clears up within a week or two.',
    steps: [
      'Rest and stay hydrated',
      'Use over-the-counter remedies to ease symptoms',
      'See a doctor if symptoms last beyond 10 days',
    ],
    specialtyKeywords: ['family medicine', 'general practice'],
  },
  angina: {
    info: 'Angina is chest discomfort caused by reduced blood flow to the heart and should always be medically evaluated.',
    steps: [
      'Avoid strenuous activity until evaluated',
      'Seek medical attention promptly',
      'Track when the discomfort occurs and how long it lasts',
    ],
    specialtyKeywords: ['cardiology'],
  },
  'heart attack': {
    info: 'A heart attack is a medical emergency caused by blocked blood flow to the heart muscle.',
    steps: [
      'Call your local emergency number right away',
      'Avoid physical exertion while waiting for help',
      'Do not drive yourself — wait for emergency responders',
    ],
    specialtyKeywords: ['cardiology'],
  },
  'muscle strain': {
    info: 'Muscle strains happen when muscle fibers are overstretched or torn, often from overuse or sudden movement.',
    steps: [
      'Rest the affected area and apply ice',
      'Avoid activities that worsen the pain',
      'See a doctor if pain is severe or does not improve in a few days',
    ],
    specialtyKeywords: ['general practice', 'family medicine'],
  },
  anxiety: {
    info: 'Anxiety can cause both emotional and physical symptoms, including a racing heart, tension, and shortness of breath.',
    steps: [
      'Practice grounding or breathing exercises',
      'Limit caffeine and prioritize consistent sleep',
      'Consider speaking with a mental health professional',
    ],
    specialtyKeywords: ['psychiatry'],
  },
  bronchitis: {
    info: 'Bronchitis is inflammation of the airways that causes coughing, often following a cold or viral illness.',
    steps: [
      'Rest and stay hydrated',
      'Use a humidifier to ease coughing',
      'See a doctor if you cough up blood or have trouble breathing',
    ],
    specialtyKeywords: ['family medicine', 'internal medicine'],
  },
  pneumonia: {
    info: 'Pneumonia is a lung infection that can range from mild to serious and often needs medical evaluation.',
    steps: [
      'See a doctor promptly for evaluation',
      'Rest and stay hydrated',
      'Seek urgent care if breathing becomes difficult',
    ],
    specialtyKeywords: ['internal medicine', 'family medicine'],
  },
  allergies: {
    info: 'Allergies occur when your immune system reacts to a substance like pollen, dust, or pet dander.',
    steps: [
      'Try to identify and avoid your triggers',
      'Over-the-counter antihistamines may help',
      'See a doctor if symptoms are severe or persistent',
    ],
    specialtyKeywords: ['family medicine', 'general practice'],
  },
  asthma: {
    info: 'Asthma is a condition where airways narrow and swell, making breathing difficult.',
    steps: [
      'Use your prescribed inhaler if you have one',
      'Avoid known triggers like smoke or allergens',
      'Seek urgent care if you have severe difficulty breathing',
    ],
    specialtyKeywords: ['internal medicine', 'family medicine'],
  },
  'heart failure': {
    info: "Heart failure means the heart isn't pumping blood as well as it should, which needs ongoing medical care.",
    steps: [
      'Seek medical evaluation promptly',
      'Watch for swelling, weight gain, or worsening breathlessness',
      'Follow up regularly with a cardiologist',
    ],
    specialtyKeywords: ['cardiology'],
  },
};

const DEFAULT_CONDITION_INFO = {
  info: 'This is a general match based on the symptoms you described. A healthcare professional can give you an accurate diagnosis.',
  steps: [
    'Monitor your symptoms and note any changes',
    'Rest and stay hydrated',
    'Schedule a visit with a healthcare provider if symptoms persist or worsen',
  ],
  specialtyKeywords: ['general practice', 'family medicine', 'internal medicine'],
};

export function getConditionInfo(condition) {
  return CONDITION_INFO[condition?.toLowerCase()] || DEFAULT_CONDITION_INFO;
}

export function isEmergencyCase({ symptoms = [], results = [] }) {
  const hasEmergencySymptom = symptoms.some((symptom) =>
    EMERGENCY_SYMPTOMS.includes(symptom.toLowerCase()),
  );
  const hasEmergencyCondition = results.some((result) =>
    EMERGENCY_CONDITIONS.includes(result.condition?.toLowerCase()),
  );
  return hasEmergencySymptom || hasEmergencyCondition;
}
