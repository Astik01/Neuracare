const request = require('supertest');
const app = require('../../src/app');
const db = require('../db/setup');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

describe('GET /api/users', () => {
  it('returns 200 and an empty list when no users exist', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.users).toEqual([]);
  });
});
