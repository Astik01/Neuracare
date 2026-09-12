const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  specialties: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  experience: { type: String, trim: true },
  fee: { type: String, trim: true },
  availability: { type: String, trim: true, default: 'Available' },
  avatar: { type: String, trim: true, default: 'fas fa-user-md' },
  photo: { type: String, trim: true },
  bio: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Doctor', doctorSchema);
