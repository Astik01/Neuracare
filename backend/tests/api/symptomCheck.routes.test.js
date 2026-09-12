const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/symptom-check', () => {
  it('returns up to 3 ranked results for known symptoms', async () => {
    const res = await request(app)
      .post('/api/symptom-check')
      .send({ symptoms: ['headache', 'fever'] });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results.length).toBeLessThanOrEqual(3);
  });

  it('returns results sorted by probability descending', async () => {
    const res = await request(app).post('/api/symptom-check').send({ symptoms: ['headache'] });

    const probabilities = res.body.results.map((r) => r.probability);
    const sorted = [...probabilities].sort((a, b) => b - a);
    expect(probabilities).toEqual(sorted);
  });

  it('falls back to "General condition" for an unknown symptom', async () => {
    const res = await request(app)
      .post('/api/symptom-check')
      .send({ symptoms: ['made-up-symptom'] });

    expect(res.status).toBe(200);
    expect(res.body.results[0].condition).toBe('General condition');
  });

  it('returns 400 when symptoms is missing', async () => {
    const res = await request(app).post('/api/symptom-check').send({});

    expect(res.status).toBe(400);
  });

  it('returns 400 when symptoms is an empty array', async () => {
    const res = await request(app).post('/api/symptom-check').send({ symptoms: [] });

    expect(res.status).toBe(400);
  });

  it('returns 400 when symptoms is not an array', async () => {
    const res = await request(app).post('/api/symptom-check').send({ symptoms: 'headache' });

    expect(res.status).toBe(400);
  });
});
