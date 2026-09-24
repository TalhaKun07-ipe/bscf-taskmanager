const mongoose = require('mongoose');

let mongoServer = null;

async function connectMongoDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGODB_URI;
  
  // 1. Attempt to connect to provided MongoDB Atlas URI
  if (uri && uri.trim()) {
    try {
      // Mask password in logs for security
      const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
      console.log(`Connecting to MongoDB Atlas (${maskedUri})...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log('✅ Connected to MongoDB Atlas successfully! All data is permanently persistent.');
      return;
    } catch (err) {
      console.error(`⚠️ Could not connect to configured MONGODB_URI: ${err.message}`);
      console.warn('Falling back to local/in-memory database...');
    }
  }

  // 2. Try local mongod daemon if running on machine
  try {
    const localUri = 'mongodb://127.0.0.1:27017/bscf_taskmanager';
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected to local MongoDB daemon (mongodb://127.0.0.1:27017/bscf_taskmanager).');
    return;
  } catch (err) {
    console.log('ℹ️ Local MongoDB daemon not running. Launching embedded in-memory MongoDB for local dev preview...');
  }

  // 3. Fallback: Spin up MongoMemoryServer for instant zero-config experience
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ Connected to Embedded In-Memory MongoDB (${memoryUri})`);
    console.log('💡 Note: Set MONGODB_URI in server/.env with your MongoDB Atlas connection string for permanent cloud storage.');
  } catch (memErr) {
    console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
    throw memErr;
  }
}

module.exports = {
  connectMongoDB,
  getMongoServer: () => mongoServer
};
