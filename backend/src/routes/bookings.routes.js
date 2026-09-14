const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Doctor = require('../models/Doctor');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

const CONSULTATION_TYPES = ['in-person', 'video'];
const SLOT_TAKEN_MESSAGE = 'This time slot is no longer available. Please choose another.';

router.use(requireAuth);

async function isSlotTaken({ doctorId, date, time, excludeBookingId }) {
  const query = { doctor: doctorId, date, time, status: 'confirmed' };
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  const existing = await Booking.findOne(query);
  return Boolean(existing);
}

router.post('/', async (req, res) => {
  try {
    const { doctorId, date, time, reason, consultationType } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ error: 'doctorId, date and time are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: 'Invalid doctor id' });
    }

    if (consultationType && !CONSULTATION_TYPES.includes(consultationType)) {
      return res.status(400).json({ error: 'Invalid consultation type' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (await isSlotTaken({ doctorId, date, time })) {
      return res.status(409).json({ error: SLOT_TAKEN_MESSAGE });
    }

    const booking = await new Booking({
      user: req.user.id,
      doctor: doctorId,
      date,
      time,
      reason,
      consultationType,
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

router.patch('/:id/reschedule', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid booking id' });
    }

    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ error: 'date and time are required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You do not have access to this booking' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ error: 'Only confirmed bookings can be rescheduled' });
    }

    if (
      await isSlotTaken({
        doctorId: booking.doctor,
        date,
        time,
        excludeBookingId: booking._id,
      })
    ) {
      return res.status(409).json({ error: SLOT_TAKEN_MESSAGE });
    }

    booking.date = date;
    booking.time = time;
    await booking.save();

    return res.json({ booking: await booking.populate('doctor') });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reschedule booking' });
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
