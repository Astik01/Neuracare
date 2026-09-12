const request = require('supertest');
const app = require('../../src/app');
const db = require('../db/setup');
const { generate_user } = require('../generators');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

const signupPayload = generate_user();

async function signupAndGetToken() {
  const res = await request(app).post('/api/auth/signup').send(signupPayload);
  return res.body.token;
}

describe('GET /api/users/me', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/users/me');

    expect(res.status).toBe(401);
  });

  it('returns the caller own profile with a valid token, never a password hash', async () => {
    const token = await signupAndGetToken();

    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ name: signupPayload.name, email: signupPayload.email });
    expect(res.body.user.passwordHash).toBeUndefined();
  });
});

describe('GET /api/users', () => {
  it('returns 401 without a token now that the endpoint requires auth', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(401);
  });

  it('returns the user list with a valid token', async () => {
    const token = await signupAndGetToken();

    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.users[0].passwordHash).toBeUndefined();
  });
});
