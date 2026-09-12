const mongoose = require('mongoose');

async function connectDB(uri) {
  await mongoose.connect(uri || process.env.MONGO_URI);
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
