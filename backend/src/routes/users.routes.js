const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email createdAt');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await User.find().select('name email createdAt').sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
