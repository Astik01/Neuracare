const request = require('supertest');
const app = require('../../src/app');
const Article = require('../../src/models/Article');
const db = require('../db/setup');
const { generate_article } = require('../generators');

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

async function seedArticles() {
  return Article.insertMany([
    generate_article({ slug: 'article-one', title: 'Article One', category: 'Heart Health' }),
    generate_article({ slug: 'article-two', title: 'Article Two', category: 'Skin' }),
  ]);
}

describe('GET /api/articles', () => {
  it('returns all articles', async () => {
    await seedArticles();

    const res = await request(app).get('/api/articles');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.articles.map((a) => a.slug).sort()).toEqual(['article-one', 'article-two']);
  });

  it('returns an empty list when there are no articles', async () => {
    const res = await request(app).get('/api/articles');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });

  it('does not require authentication', async () => {
    await seedArticles();

    const res = await request(app).get('/api/articles');

    expect(res.status).not.toBe(401);
  });
});

describe('GET /api/articles/:slug', () => {
  it('returns a single article by slug', async () => {
    await seedArticles();

    const res = await request(app).get('/api/articles/article-one');

    expect(res.status).toBe(200);
    expect(res.body.article.title).toBe('Article One');
    expect(res.body.article.sections).toEqual(
      expect.arrayContaining([expect.objectContaining({ heading: 'Test heading' })]),
    );
  });

  it('returns 404 for an unknown slug', async () => {
    const res = await request(app).get('/api/articles/does-not-exist');

    expect(res.status).toBe(404);
  });
});
