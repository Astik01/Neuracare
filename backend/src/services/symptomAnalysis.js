const symptomDatabase = require('../data/symptomDatabase');

function urgencyFor(probability) {
  if (probability > 0.7) return 'high';
  if (probability > 0.4) return 'medium';
  return 'low';
}

// Mock AI: not a real diagnostic model, mirrors the legacy client-side
// symptom checker. Probability is randomized per the original behavior,
// so callers should assert on shape/ranges rather than exact values.
function analyzeSymptoms(symptoms) {
  const results = [];

  symptoms.forEach((symptom) => {
    const possibleConditions = symptomDatabase.conditions[symptom] || ['General condition'];

    possibleConditions.forEach((condition) => {
      const probability = Math.random() * 0.8 + 0.2; // 20-100%

      results.push({
        condition,
        probability: Math.round(probability * 100),
        urgency: urgencyFor(probability),
        symptoms: [symptom],
      });
    });
  });

  return results.sort((a, b) => b.probability - a.probability).slice(0, 3);
}

module.exports = { analyzeSymptoms, urgencyFor };
