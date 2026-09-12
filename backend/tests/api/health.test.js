const request = require('supertest');
const app = require('../../src/app');

describe('GET /', () => {
  it('returns 200 with a running message', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Backend running!' });
  });
});
