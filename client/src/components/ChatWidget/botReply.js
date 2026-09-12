const RULES = [
  {
    keyword: 'headache',
    condition: 'Possible tension headache or migraine',
    suggestion:
      'Rest, hydration, and over-the-counter pain relief may help. If severe or frequent, consider booking a doctor for evaluation.',
  },
  {
    keyword: 'fever',
    condition: 'Possible infection or viral illness',
    suggestion:
      'Monitor your temperature and stay hydrated. If fever is high or lasts more than 3 days, book a doctor for assessment.',
  },
  {
    keyword: 'chest pain',
    condition: 'Chest pain can have many causes',
    suggestion:
      'Seek urgent care if pain is severe or you have shortness of breath. For mild or recurring symptoms, book a cardiologist or GP.',
  },
  {
    keyword: 'anxious',
    condition: 'Anxiety or stress-related symptoms',
    suggestion:
      'Talking to a mental health professional or GP can help. You can book a consultation with one of our doctors.',
  },
  {
    keyword: 'rash',
    condition: 'Possible skin condition or allergic reaction',
    suggestion: 'A dermatologist can diagnose and recommend treatment. Book a consultation to get expert advice.',
  },
  {
    keyword: 'skin',
    condition: 'Possible skin condition or allergic reaction',
    suggestion: 'A dermatologist can diagnose and recommend treatment. Book a consultation to get expert advice.',
  },
  {
    keyword: 'breath',
    condition: 'Shortness of breath can be serious',
    suggestion:
      'If severe or sudden, seek emergency care. For mild or chronic symptoms, book a doctor to rule out asthma, anxiety, or other causes.',
  },
];

const DEFAULT_REPLY = {
  condition: 'General health concern',
  suggestion: 'I recommend speaking with a doctor for personalized advice. You can book a consultation on our Find Doctors page.',
};

export function getBotReply(message) {
  const lower = (message || '').toLowerCase();
  const match = RULES.find((rule) => lower.includes(rule.keyword));
  return match ? { condition: match.condition, suggestion: match.suggestion } : DEFAULT_REPLY;
}
