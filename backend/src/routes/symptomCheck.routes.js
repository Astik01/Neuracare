const express = require('express');
const { analyzeSymptoms } = require('../services/symptomAnalysis');

const router = express.Router();

router.post('/', (req, res) => {
  const { symptoms } = req.body;

  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: 'symptoms must be a non-empty array' });
  }

  const results = analyzeSymptoms(symptoms);
  return res.json({ results });
});

module.exports = router;
