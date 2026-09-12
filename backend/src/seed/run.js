require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/db');
const Doctor = require('../models/Doctor');
const doctors = require('./doctors.seed');

async function run() {
  await connectDB();
  await Doctor.deleteMany({});
  await Doctor.insertMany(doctors);
  console.log(`Seeded ${doctors.length} doctors.`);
  await disconnectDB();
}

run().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
