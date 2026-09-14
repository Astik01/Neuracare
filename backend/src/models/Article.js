const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const articleSchema = new mongoose.Schema({
  slug: { type: String, required: true, trim: true, unique: true },
  title: { type: String, required: true, trim: true },
  excerpt: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  specialtyLink: { type: String, trim: true },
  ctaLabel: { type: String, trim: true },
  paragraphs: { type: [String], default: [] },
  sections: { type: [sectionSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', articleSchema);
