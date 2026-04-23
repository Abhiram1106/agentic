const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    try {
      console.log(`Attempting to connect to: ${mongoUri?.split('@').pop()}`);
      // Set a short timeout so we fallback quickly if MongoDB is not running locally
      const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (initialError) {
      console.log(`Failed to connect to ${mongoUri?.split('@').pop()}. Starting fallback in-memory database...`);

      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
