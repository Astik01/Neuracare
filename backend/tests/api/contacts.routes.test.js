const request = require('supertest');
const app = require('../../src/app');
const db = require('../db/setup');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

const validPayload = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Question about appointments',
  message: 'How do I book a same-day appointment?',
};

describe('POST /api/contacts', () => {
  it('creates a contact message with valid data', async () => {
    const res = await request(app).post('/api/contacts').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.contact).toMatchObject(validPayload);
    expect(res.body.contact.status).toBe('new');
  });

  it.each(['name', 'email', 'subject', 'message'])('returns 400 when %s is missing', async (field) => {
    const payload = { ...validPayload };
    delete payload[field];

    const res = await request(app).post('/api/contacts').send(payload);

    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid email format', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .send({ ...validPayload, email: 'not-an-email' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/contacts', () => {
  it('returns 200 and all submitted contacts, newest first', async () => {
    await request(app).post('/api/contacts').send(validPayload);
    await request(app)
      .post('/api/contacts')
      .send({ ...validPayload, email: 'second@example.com' });

    const res = await request(app).get('/api/contacts');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.contacts[0].email).toBe('second@example.com');
  });
});
