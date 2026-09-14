import {
  articles,
  CATEGORIES,
  estimateReadingTime,
  getArticleBySlug,
  getArticleImage,
  getRelatedArticles,
} from './articles';

describe('articles data', () => {
  it('gives every article a category from the known category list', () => {
    articles.forEach((article) => {
      expect(CATEGORIES).toContain(article.category);
    });
  });

  it('gives every article an image', () => {
    articles.forEach((article) => {
      expect(article.image).toEqual(expect.stringContaining('http'));
    });
  });
});

describe('getArticleBySlug', () => {
  it('finds an article by slug', () => {
    expect(getArticleBySlug('heart-disease')?.title).toBe('Early Signs of Heart Disease');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getArticleBySlug('does-not-exist')).toBeUndefined();
  });
});

describe('getArticleImage', () => {
  it("returns the article's own image", () => {
    const article = getArticleBySlug('heart-disease');
    expect(getArticleImage(article)).toBe(article.image);
  });

  it('falls back to a default image when missing', () => {
    expect(getArticleImage({})).toEqual(expect.stringContaining('http'));
  });
});

describe('estimateReadingTime', () => {
  it('returns a "N min read" string', () => {
    const article = getArticleBySlug('heart-disease');
    expect(estimateReadingTime(article)).toMatch(/^\d+ min read$/);
  });

  it('never returns less than 1 minute', () => {
    const tinyArticle = { paragraphs: ['short'], sections: [] };
    expect(estimateReadingTime(tinyArticle)).toBe('1 min read');
  });
});

describe('getRelatedArticles', () => {
  it('prefers articles from the same category', () => {
    const article = getArticleBySlug('cold-vs-flu');
    const related = getRelatedArticles(article, 3);

    expect(related).not.toContainEqual(expect.objectContaining({ slug: 'cold-vs-flu' }));
    const sameCategoryCount = related.filter((a) => a.category === article.category).length;
    expect(sameCategoryCount).toBeGreaterThan(0);
  });

  it('respects the requested count', () => {
    const article = getArticleBySlug('heart-disease');
    expect(getRelatedArticles(article, 2)).toHaveLength(2);
  });
});
