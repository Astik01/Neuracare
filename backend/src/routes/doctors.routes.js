const express = require('express');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { specialty } = req.query;
    const filter = specialty ? { specialty: specialty.toLowerCase() } : {};
    const doctors = await Doctor.find(filter).sort({ rating: -1 });
    res.json({ count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid doctor id' });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    return res.json({ doctor });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

module.exports = router;
