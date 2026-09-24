const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, uppercase: true },
    description: { type: String, default: '' },
    color: { type: String, default: '#3b82f6' },
    icon: { type: String, default: '📁' },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
