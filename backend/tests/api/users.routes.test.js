const request = require('supertest');
const app = require('../../src/app');
const db = require('../db/setup');
const { generate_user } = require('../generators');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

async function signup(overrides = {}) {
  const payload = generate_user(overrides);
  const res = await request(app).post('/api/auth/signup').send(payload);
  return { token: res.body.token, user: res.body.user, password: payload.password };
}

describe('GET /api/users/me', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it("returns the caller's profile including phone and notificationsEnabled defaults", async () => {
    const { token } = await signup({ name: 'Ada Lovelace' });

    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Ada Lovelace');
    expect(res.body.user.phone).toBe('');
    expect(res.body.user.notificationsEnabled).toBe(true);
  });
});

describe('PATCH /api/users/me', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).patch('/api/users/me').send({ name: 'New Name' });
    expect(res.status).toBe(401);
  });

  it('updates name and phone', async () => {
    const { token } = await signup();

    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', phone: '+1 555 0100' });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Updated Name');
    expect(res.body.user.phone).toBe('+1 555 0100');
  });

  it('updates notificationsEnabled independently', async () => {
    const { token } = await signup();

    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ notificationsEnabled: false });

    expect(res.status).toBe(200);
    expect(res.body.user.notificationsEnabled).toBe(false);
  });

  it('returns 400 for an empty name', async () => {
    const { token } = await signup();

    const res = await request(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '   ' });

    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/users/me/password', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .patch('/api/users/me/password')
      .send({ currentPassword: 'password123', newPassword: 'newpassword123' });
    expect(res.status).toBe(401);
  });

  it('changes the password when the current password is correct', async () => {
    const { token, user, password } = await signup();

    const res = await request(app)
      .patch('/api/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: password, newPassword: 'brand-new-password' });

    expect(res.status).toBe(200);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'brand-new-password' });
    expect(loginRes.status).toBe(200);
  });

  it('returns 401 when the current password is wrong', async () => {
    const { token } = await signup();

    const res = await request(app)
      .patch('/api/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'totally-wrong', newPassword: 'brand-new-password' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when the new password is too short', async () => {
    const { token, password } = await signup();

    const res = await request(app)
      .patch('/api/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: password, newPassword: 'short' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when fields are missing', async () => {
    const { token } = await signup();

    const res = await request(app)
      .patch('/api/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'password123' });

    expect(res.status).toBe(400);
  });
});
