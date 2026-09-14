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

  it('returns 400 for an invalid consultation type', async () => {
    const token = await signup();
    const doctor = await seedDoctor();

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload(doctor._id, { consultationType: 'holographic' }));

    expect(res.status).toBe(400);
  });

  it('defaults consultationType to in-person', async () => {
    const token = await signup();
    const doctor = await seedDoctor();

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload(doctor._id));

    expect(res.body.booking.consultationType).toBe('in-person');
  });

  it('returns 409 when the same doctor, date and time is already confirmed', async () => {
    const doctor = await seedDoctor();
    const tokenA = await signup();
    const tokenB = await signup();
    const payload = generate_booking_payload(doctor._id);

    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(payload);

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenB}`)
      .send(payload);

    expect(res.status).toBe(409);
  });

  it('allows booking a slot that was previously cancelled', async () => {
    const doctor = await seedDoctor();
    const tokenA = await signup();
    const tokenB = await signup();
    const payload = generate_booking_payload(doctor._id);

    const first = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(payload);
    await request(app)
      .delete(`/api/bookings/${first.body.booking._id}`)
      .set('Authorization', `Bearer ${tokenA}`);

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenB}`)
      .send(payload);

    expect(res.status).toBe(201);
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

describe('PATCH /api/bookings/:id/reschedule', () => {
  it('reschedules a booking owned by the caller', async () => {
    const token = await signup();
    const doctor = await seedDoctor();
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload(doctor._id));

    const res = await request(app)
      .patch(`/api/bookings/${created.body.booking._id}/reschedule`)
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-02-02', time: '11:00' });

    expect(res.status).toBe(200);
    expect(res.body.booking.date).toBe('2026-02-02');
    expect(res.body.booking.time).toBe('11:00');
  });

  it('returns 400 when date or time is missing', async () => {
    const token = await signup();
    const doctor = await seedDoctor();
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload(doctor._id));

    const res = await request(app)
      .patch(`/api/bookings/${created.body.booking._id}/reschedule`)
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-02-02' });

    expect(res.status).toBe(400);
  });

  it("returns 403 when rescheduling another user's booking", async () => {
    const doctor = await seedDoctor();
    const tokenA = await signup();
    const tokenB = await signup();
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(generate_booking_payload(doctor._id));

    const res = await request(app)
      .patch(`/api/bookings/${created.body.booking._id}/reschedule`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ date: '2026-02-02', time: '11:00' });

    expect(res.status).toBe(403);
  });

  it('returns 404 for a booking that does not exist', async () => {
    const token = await signup();
    const missingId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/bookings/${missingId}/reschedule`)
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-02-02', time: '11:00' });

    expect(res.status).toBe(404);
  });

  it('returns 400 when rescheduling a cancelled booking', async () => {
    const token = await signup();
    const doctor = await seedDoctor();
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload(doctor._id));
    await request(app)
      .delete(`/api/bookings/${created.body.booking._id}`)
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .patch(`/api/bookings/${created.body.booking._id}/reschedule`)
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-02-02', time: '11:00' });

    expect(res.status).toBe(400);
  });

  it('returns 409 when the new slot is already confirmed for another booking', async () => {
    const doctor = await seedDoctor();
    const tokenA = await signup();
    const tokenB = await signup();

    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(generate_booking_payload(doctor._id, { date: '2026-02-02', time: '11:00' }));

    const secondCreated = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenB}`)
      .send(generate_booking_payload(doctor._id, { date: '2026-03-03', time: '09:00' }));

    const res = await request(app)
      .patch(`/api/bookings/${secondCreated.body.booking._id}/reschedule`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ date: '2026-02-02', time: '11:00' });

    expect(res.status).toBe(409);
  });

  it('allows rescheduling a booking to its own current slot', async () => {
    const token = await signup();
    const doctor = await seedDoctor();
    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(generate_booking_payload(doctor._id, { date: '2026-02-02', time: '11:00' }));

    const res = await request(app)
      .patch(`/api/bookings/${created.body.booking._id}/reschedule`)
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-02-02', time: '11:00' });

    expect(res.status).toBe(200);
  });
});
