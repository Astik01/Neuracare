const express = require('express');
const Contact = require('../models/Contact');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ error: 'All fields (name, email, subject, message) are required' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const contact = await new Contact({ name, email, subject, message }).save();

    return res.status(201).json({ message: 'Contact message received successfully!', contact });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to submit contact message. Please try again.' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ count: contacts.length, contacts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

module.exports = router;
