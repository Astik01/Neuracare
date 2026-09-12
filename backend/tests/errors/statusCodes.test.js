const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../src/app');
const Doctor = require('../../src/models/Doctor');
const db = require('../db/setup');
const { generate_user, generate_doctor, generate_booking_payload } = require('../generators');

beforeAll(async () => db.connect());
afterEach(async () => {
  jest.restoreAllMocks();
  await db.clearDatabase();
});
afterAll(async () => db.closeDatabase());

async function signup(overrides = {}) {
  const res = await request(app).post('/api/auth/signup').send(generate_user(overrides));
  return res.body.token;
}

describe('Error handling: status code matrix', () => {
  it('400 - a malformed/incomplete request body is rejected', async () => {
    const res = await request(app).post('/api/symptom-check').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(expect.any(String));
  });

  it('401 - a protected route rejects a caller with no credentials', async () => {
    const res = await request(app).get('/api/bookings');

    expect(res.status).toBe(401);
  });

  it("403 - a caller cannot act on another user's resource", async () => {
    const doctor = await new Doctor(generate_doctor()).save();
    const tokenA = await signup();
    const tokenB = await signup();
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(generate_booking_payload(doctor._id));

    const res = await request(app)
      .delete(`/api/bookings/${created.body.booking._id}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  it('404 - a well-formed but nonexistent resource id', async () => {
    const missingId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/api/doctors/${missingId}`);

    expect(res.status).toBe(404);
  });

  it('404 - an entirely unknown route falls through to the global handler', async () => {
    const res = await request(app).get('/api/this-route-does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Route not found' });
  });

  it('500 - a downstream/DB failure is reported without leaking internals (simulated DB-unavailable)', async () => {
    jest.spyOn(Doctor, 'find').mockImplementationOnce(() => {
      throw new Error('connection timed out');
    });

    const res = await request(app).get('/api/doctors');

    expect(res.status).toBe(500);
    expect(res.body.error).not.toMatch(/connection timed out/);
  });
});
