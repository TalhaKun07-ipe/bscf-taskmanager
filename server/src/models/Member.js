const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'Team Member' },
    department: { type: String, default: 'General' },
    avatar: { type: String },
    color: { type: String, default: '#ea580c' },
    capacityHours: { type: Number, default: 35 },
    activeTasksCount: { type: Number, default: 0 },
    network: { type: String, default: 'Core Team' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', MemberSchema);
