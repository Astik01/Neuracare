require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/db');
const Doctor = require('../models/Doctor');
const Article = require('../models/Article');
const doctors = require('./doctors.seed');
const articles = require('./articles.seed');

async function run() {
  await connectDB();

  await Doctor.deleteMany({});
  await Doctor.insertMany(doctors);
  console.log(`Seeded ${doctors.length} doctors.`);

  await Article.deleteMany({});
  await Article.insertMany(articles);
  console.log(`Seeded ${articles.length} articles.`);

  await disconnectDB();
}

run().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
