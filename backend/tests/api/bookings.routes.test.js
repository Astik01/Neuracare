const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../src/app');
const Doctor = require('../../src/models/Doctor');
const db = require('../db/setup');
const { generate_user, generate_doctor, generate_booking_payload } = require('../generators');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

async function signup(overrides = {}) {
  const res = await request(app).post('/api/auth/signup').send(generate_user(overrides));
  return res.body.token;
}

async function seedDoctor(overrides = {}) {
  return new Doctor(generate_doctor(overrides)).save();
}

describe('POST /api/bookings', () => {
  it('returns 401 without a token', async () => {
    const doctor = await seedDoctor();

    const res = await request(app).post('/api/bookings').send(generate_booking_payload(doctor._id));

    expect(res.status).toBe(401);
  });

  it('creates a booking with valid data', async () => {
    const token = await signup();
    const doctor = await seedDoctor({ name: 'Dr. Sarah Johnson' });

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload(doctor._id));

    expect(res.status).toBe(201);
    expect(res.body.booking.status).toBe('confirmed');
    expect(res.body.booking.doctor.name).toBe('Dr. Sarah Johnson');
  });

  it.each(['doctorId', 'date', 'time'])('returns 400 when %s is missing', async (field) => {
    const token = await signup();
    const doctor = await seedDoctor();
    const payload = generate_booking_payload(doctor._id);
    delete payload[field];

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(400);
  });

  it('returns 400 for a malformed doctor id', async () => {
    const token = await signup();

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload('not-an-id'));

    expect(res.status).toBe(400);
  });

  it('returns 404 when the doctor does not exist', async () => {
    const token = await signup();
    const missingDoctorId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload(missingDoctorId));

    expect(res.status).toBe(404);
  });
});

describe('GET /api/bookings', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/bookings');

    expect(res.status).toBe(401);
  });

  it("only returns the caller's own bookings", async () => {
    const doctor = await seedDoctor();
    const tokenA = await signup();
    const tokenB = await signup();

    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(generate_booking_payload(doctor._id));

    const res = await request(app).get('/api/bookings').set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });
});

describe('DELETE /api/bookings/:id', () => {
  it('cancels a booking owned by the caller', async () => {
    const token = await signup();
    const doctor = await seedDoctor();
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload(doctor._id));

    const res = await request(app)
      .delete(`/api/bookings/${created.body.booking._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('cancelled');
  });

  it("returns 403 when cancelling another user's booking", async () => {
    const doctor = await seedDoctor();
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

  it('returns 404 for a booking that does not exist', async () => {
    const token = await signup();
    const missingId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/bookings/${missingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('returns 400 for a malformed booking id', async () => {
    const token = await signup();

    const res = await request(app)
      .delete('/api/bookings/not-an-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});
