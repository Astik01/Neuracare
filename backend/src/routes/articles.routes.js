const express = require('express');
const Article = require('../models/Article');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // `date` is a display string (e.g. "Jan 15, 2026"), not sortable lexicographically -
    // the client already parses and sorts these properly, so just return insertion order.
    const articles = await Article.find();
    return res.json({ count: articles.length, articles });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    return res.json({ article });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch article' });
  }
});

module.exports = router;
