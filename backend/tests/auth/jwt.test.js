const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../src/app');
const db = require('../db/setup');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

describe('JWT verification via a protected route', () => {
  it('returns 401 with no Authorization header', async () => {
    const res = await request(app).get('/api/users/me');

    expect(res.status).toBe(401);
  });

  it('returns 401 for a malformed token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid token/i);
  });

  it('returns 401 for an expired token', async () => {
    const expiredToken = jwt.sign({ sub: 'someid', email: 'a@b.com' }, process.env.JWT_SECRET, {
      expiresIn: '-1s',
    });

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/token expired/i);
  });

  it('returns 401 when the Authorization header has no Bearer scheme', async () => {
    const token = jwt.sign({ sub: 'someid', email: 'a@b.com' }, process.env.JWT_SECRET);

    const res = await request(app).get('/api/users/me').set('Authorization', token);

    expect(res.status).toBe(401);
  });
});
