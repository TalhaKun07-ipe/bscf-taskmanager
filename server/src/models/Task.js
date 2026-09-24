const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  avatar: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const SubtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['backlog', 'todo', 'in_progress', 'in_review', 'completed'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['urgent', 'high', 'medium', 'low'],
      default: 'medium'
    },
    dueDate: { type: Date },
    startDate: { type: Date },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    tags: [{ type: String }],
    subtasks: [SubtaskSchema],
    estimatedHours: { type: Number, default: 0 },
    loggedHours: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    comments: [CommentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
