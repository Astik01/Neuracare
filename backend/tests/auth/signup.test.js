const request = require('supertest');
const app = require('../../src/app');
const db = require('../db/setup');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

const validPayload = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'password123' };

describe('POST /api/auth/signup', () => {
  it('creates a user and returns a token, without leaking the password hash', async () => {
    const res = await request(app).post('/api/auth/signup').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ name: validPayload.name, email: validPayload.email });
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it.each(['name', 'email', 'password'])('returns 400 when %s is missing', async (field) => {
    const payload = { ...validPayload };
    delete payload[field];

    const res = await request(app).post('/api/auth/signup').send(payload);

    expect(res.status).toBe(400);
  });

  it('returns 400 for a duplicate email', async () => {
    await request(app).post('/api/auth/signup').send(validPayload);

    const res = await request(app).post('/api/auth/signup').send(validPayload);

    expect(res.status).toBe(400);
  });

  it('returns 400 when the password is shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ ...validPayload, password: 'short' });

    expect(res.status).toBe(400);
  });
});
