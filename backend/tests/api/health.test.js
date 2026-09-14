const request = require('supertest');
const app = require('../../src/app');

describe('GET /', () => {
  it('returns 200 with a running message', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Backend running!' });
  });
});

describe('GET /api/health', () => {
  it('returns 200 with a status of ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
