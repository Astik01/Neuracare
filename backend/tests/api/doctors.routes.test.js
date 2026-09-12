const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../src/app');
const Doctor = require('../../src/models/Doctor');
const db = require('../db/setup');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

async function seedDoctors() {
  return Doctor.insertMany([
    { name: 'Dr. Sarah Johnson', specialty: 'cardiology', rating: 4.9 },
    { name: 'Dr. Michael Chen', specialty: 'dermatology', rating: 4.8 },
  ]);
}

describe('GET /api/doctors', () => {
  it('returns all doctors when no filter is given', async () => {
    await seedDoctors();

    const res = await request(app).get('/api/doctors');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });

  it('filters by specialty', async () => {
    await seedDoctors();

    const res = await request(app).get('/api/doctors').query({ specialty: 'cardiology' });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.doctors[0].specialty).toBe('cardiology');
  });

  it('returns an empty list for a specialty with no matches', async () => {
    await seedDoctors();

    const res = await request(app).get('/api/doctors').query({ specialty: 'neurology' });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });
});

describe('GET /api/doctors/:id', () => {
  it('returns a single doctor by id', async () => {
    const [doctor] = await seedDoctors();

    const res = await request(app).get(`/api/doctors/${doctor._id}`);

    expect(res.status).toBe(200);
    expect(res.body.doctor.name).toBe('Dr. Sarah Johnson');
  });

  it('returns 400 for a malformed id', async () => {
    const res = await request(app).get('/api/doctors/not-an-object-id');

    expect(res.status).toBe(400);
  });

  it('returns 404 for a well-formed id that does not exist', async () => {
    const missingId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/api/doctors/${missingId}`);

    expect(res.status).toBe(404);
  });
});
