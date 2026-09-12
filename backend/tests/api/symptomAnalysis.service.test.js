const { analyzeSymptoms, urgencyFor } = require('../../src/services/symptomAnalysis');

describe('urgencyFor', () => {
  it('maps probability ranges to the correct urgency level', () => {
    expect(urgencyFor(0.9)).toBe('high');
    expect(urgencyFor(0.5)).toBe('medium');
    expect(urgencyFor(0.1)).toBe('low');
  });
});

describe('analyzeSymptoms', () => {
  it('produces one result per known condition for a mapped symptom', () => {
    const results = analyzeSymptoms(['fever']);

    expect(results.length).toBeGreaterThan(0);
    results.forEach((result) => {
      expect(result.probability).toBeGreaterThanOrEqual(20);
      expect(result.probability).toBeLessThanOrEqual(100);
      expect(['low', 'medium', 'high']).toContain(result.urgency);
      expect(result.symptoms).toEqual(['fever']);
    });
  });

  it('caps results at 3 even with many symptoms', () => {
    const results = analyzeSymptoms(['headache', 'fever', 'chest pain', 'cough']);

    expect(results.length).toBeLessThanOrEqual(3);
  });
});
