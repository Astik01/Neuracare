const bcrypt = require('bcrypt');
const User = require('../../src/models/User');
const db = require('../db/setup');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

describe('User model', () => {
  it('comparePassword resolves true for the correct password and false otherwise', async () => {
    const passwordHash = await bcrypt.hash('correct-horse-battery-staple', 10);
    const user = await new User({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      passwordHash,
    }).save();

    await expect(user.comparePassword('correct-horse-battery-staple')).resolves.toBe(true);
    await expect(user.comparePassword('wrong-password')).resolves.toBe(false);
  });

  it('rejects a duplicate email', async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    await new User({ name: 'User One', email: 'dup@example.com', passwordHash }).save();

    await expect(
      new User({ name: 'User Two', email: 'dup@example.com', passwordHash }).save(),
    ).rejects.toThrow();
  });
});
