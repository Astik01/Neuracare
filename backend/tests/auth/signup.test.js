const request = require('supertest');
const app = require('../../src/app');
const db = require('../db/setup');
const { generate_user, generate_invalid_user } = require('../generators');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

describe('POST /api/auth/signup', () => {
  it('creates a user and returns a token, without leaking the password hash', async () => {
    const payload = generate_user();

    const res = await request(app).post('/api/auth/signup').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ name: payload.name, email: payload.email });
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it.each(['name', 'email', 'password'])('returns 400 when %s is missing', async (field) => {
    const payload = generate_invalid_user(field);

    const res = await request(app).post('/api/auth/signup').send(payload);

    expect(res.status).toBe(400);
  });

  it('returns 400 for a duplicate email', async () => {
    const payload = generate_user();
    await request(app).post('/api/auth/signup').send(payload);

    const res = await request(app).post('/api/auth/signup').send(payload);

    expect(res.status).toBe(400);
  });

  it('returns 400 when the password is shorter than 8 characters', async () => {
    const payload = generate_user({ password: 'short' });

    const res = await request(app).post('/api/auth/signup').send(payload);

    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid email format', async () => {
    const payload = generate_user({ email: 'not-an-email' });

    const res = await request(app).post('/api/auth/signup').send(payload);

    expect(res.status).toBe(400);
  });
});
