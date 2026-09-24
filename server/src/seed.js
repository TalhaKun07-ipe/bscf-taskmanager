require('dotenv').config();
const mongoose = require('mongoose');
const { connectMongoDB } = require('./config/db');
const Task = require('./models/Task');
const Member = require('./models/Member');
const Project = require('./models/Project');
const Doc = require('./models/Doc');

async function seedData(force = false) {
  try {
    console.log('🌱 Starting database seeding check...');
    await connectMongoDB();

    const memberCount = await Member.countDocuments();

    if (force) {
      console.log('⚠️ Force mode: cleaning existing collections...');
      await Task.deleteMany({});
      await Member.deleteMany({});
      await Project.deleteMany({});
      await Doc.deleteMany({});
    }

    if (memberCount === 0 || force) {
      // 1. Seed Official BSCF Members (Core Team & Youth Network)
      const bscfMembers = require('./data/bscfMembers.json');
      const members = await Member.insertMany(bscfMembers);
      console.log(`✅ Seeded ${members.length} official BSCF team & youth network members`);
    } else {
      console.log(`ℹ️ BSCF Team members already present (${memberCount} members). Preserving database state.`);
    }

    console.log('🎉 Seeding check complete successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

module.exports = seedData;

if (require.main === module) {
  const isForce = process.argv.includes('--force');
  seedData(isForce).then(() => process.exit(0));
}
