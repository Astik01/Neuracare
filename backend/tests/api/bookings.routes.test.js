const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../src/app');
const Doctor = require('../../src/models/Doctor');
const db = require('../db/setup');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

async function signup(email) {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Test User', email, password: 'password123' });
  return res.body.token;
}

async function seedDoctor() {
  return new Doctor({ name: 'Dr. Sarah Johnson', specialty: 'cardiology' }).save();
}

describe('POST /api/bookings', () => {
  it('returns 401 without a token', async () => {
    const doctor = await seedDoctor();

    const res = await request(app)
      .post('/api/bookings')
      .send({ doctorId: doctor._id, date: '2026-01-01', time: '10:00' });

    expect(res.status).toBe(401);
  });

  it('creates a booking with valid data', async () => {
    const token = await signup('patient@example.com');
    const doctor = await seedDoctor();

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctorId: doctor._id, date: '2026-01-01', time: '10:00', reason: 'Checkup' });

    expect(res.status).toBe(201);
    expect(res.body.booking.status).toBe('confirmed');
    expect(res.body.booking.doctor.name).toBe('Dr. Sarah Johnson');
  });

  it.each(['doctorId', 'date', 'time'])('returns 400 when %s is missing', async (field) => {
    const token = await signup('patient@example.com');
    const doctor = await seedDoctor();
    const payload = { doctorId: doctor._id, date: '2026-01-01', time: '10:00' };
    delete payload[field];

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(400);
  });

  it('returns 400 for a malformed doctor id', async () => {
    const token = await signup('patient@example.com');

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctorId: 'not-an-id', date: '2026-01-01', time: '10:00' });

    expect(res.status).toBe(400);
  });

  it('returns 404 when the doctor does not exist', async () => {
    const token = await signup('patient@example.com');
    const missingDoctorId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctorId: missingDoctorId, date: '2026-01-01', time: '10:00' });

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
    const tokenA = await signup('a@example.com');
    const tokenB = await signup('b@example.com');

    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ doctorId: doctor._id, date: '2026-01-01', time: '10:00' });

    const res = await request(app).get('/api/bookings').set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });
});

describe('DELETE /api/bookings/:id', () => {
  it('cancels a booking owned by the caller', async () => {
    const token = await signup('patient@example.com');
    const doctor = await seedDoctor();
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctorId: doctor._id, date: '2026-01-01', time: '10:00' });

    const res = await request(app)
      .delete(`/api/bookings/${created.body.booking._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe('cancelled');
  });

  it('returns 403 when cancelling another user\'s booking', async () => {
    const doctor = await seedDoctor();
    const tokenA = await signup('a@example.com');
    const tokenB = await signup('b@example.com');
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ doctorId: doctor._id, date: '2026-01-01', time: '10:00' });

    const res = await request(app)
      .delete(`/api/bookings/${created.body.booking._id}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  it('returns 404 for a booking that does not exist', async () => {
    const token = await signup('patient@example.com');
    const missingId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/bookings/${missingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('returns 400 for a malformed booking id', async () => {
    const token = await signup('patient@example.com');

    const res = await request(app)
      .delete('/api/bookings/not-an-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});
