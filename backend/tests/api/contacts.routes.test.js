const request = require('supertest');
const app = require('../../src/app');
const db = require('../db/setup');
const { generate_contact_payload, generate_user } = require('../generators');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

async function signup() {
  const res = await request(app).post('/api/auth/signup').send(generate_user());
  return res.body.token;
}

describe('POST /api/contacts', () => {
  it('creates a contact message with valid data', async () => {
    const payload = generate_contact_payload();

    const res = await request(app).post('/api/contacts').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.contact).toMatchObject(payload);
    expect(res.body.contact.status).toBe('new');
  });

  it.each(['name', 'email', 'subject', 'message'])('returns 400 when %s is missing', async (field) => {
    const payload = generate_contact_payload();
    delete payload[field];

    const res = await request(app).post('/api/contacts').send(payload);

    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid email format', async () => {
    const payload = generate_contact_payload({ email: 'not-an-email' });

    const res = await request(app).post('/api/contacts').send(payload);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/contacts', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/contacts');

    expect(res.status).toBe(401);
  });

  it('returns 200 and all submitted contacts, newest first, for an authenticated caller', async () => {
    await request(app).post('/api/contacts').send(generate_contact_payload({ email: 'first@example.com' }));
    await request(app).post('/api/contacts').send(generate_contact_payload({ email: 'second@example.com' }));
    const token = await signup();

    const res = await request(app).get('/api/contacts').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.contacts[0].email).toBe('second@example.com');
  });
});
