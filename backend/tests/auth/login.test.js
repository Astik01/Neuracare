const request = require('supertest');
const app = require('../../src/app');
const db = require('../db/setup');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

const signupPayload = { name: 'Ada Lovelace', email: 'ada@example.com', password: 'password123' };

async function registerUser() {
  await request(app).post('/api/auth/signup').send(signupPayload);
}

describe('POST /api/auth/login', () => {
  beforeEach(async () => registerUser());

  it('returns 200 and a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: signupPayload.email, password: signupPayload.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it('returns 401 for an invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: signupPayload.email, password: 'wrong-password' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for an unknown email, with the same message as a wrong password', async () => {
    const wrongPassword = await request(app)
      .post('/api/auth/login')
      .send({ email: signupPayload.email, password: 'wrong-password' });
    const unknownEmail = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: signupPayload.password });

    expect(unknownEmail.status).toBe(401);
    expect(unknownEmail.body.error).toBe(wrongPassword.body.error);
  });

  it.each(['email', 'password'])('returns 400 when %s is missing', async (field) => {
    const payload = { email: signupPayload.email, password: signupPayload.password };
    delete payload[field];

    const res = await request(app).post('/api/auth/login').send(payload);

    expect(res.status).toBe(400);
  });
});
