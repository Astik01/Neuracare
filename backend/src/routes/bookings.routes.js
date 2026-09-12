const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Doctor = require('../models/Doctor');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.post('/', async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: 'doctorId, date and time are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: 'Invalid doctor id' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const booking = await new Booking({
      user: req.user.id,
      doctor: doctorId,
      date,
      time,
      reason,
    }).save();

    return res.status(201).json({ booking: await booking.populate('doctor') });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('doctor')
      .sort({ createdAt: -1 });
    return res.json({ count: bookings.length, bookings });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid booking id' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You do not have access to this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    return res.json({ booking });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
