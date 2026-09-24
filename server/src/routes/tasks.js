const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Member = require('../models/Member');

// Helper to update active tasks count for members
async function updateMemberTaskCounts() {
  try {
    const activeTasks = await Task.find({ status: { $ne: 'completed' } });
    const countMap = {};
    activeTasks.forEach((t) => {
      (t.assignees || []).forEach((mId) => {
        const idStr = mId.toString();
        countMap[idStr] = (countMap[idStr] || 0) + 1;
      });
    });

    const members = await Member.find({});
    for (const member of members) {
      const activeCount = countMap[member._id.toString()] || 0;
      if (member.activeTasksCount !== activeCount) {
        member.activeTasksCount = activeCount;
        await member.save();
      }
    }
  } catch (e) {
    console.error('Error updating member task counts:', e);
  }
}

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const { status, priority, assignee, projectId, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (projectId) filter.projectId = projectId;
    if (assignee) filter.assignees = assignee;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const tasks = await Task.find(filter)
      .populate('assignees', 'name email role department avatar color')
      .populate('projectId', 'name key color')
      .sort({ order: 1, createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignees', 'name email role department avatar color')
      .populate('projectId', 'name key color');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    await updateMemberTaskCounts();

    const populated = await Task.findById(task._id)
      .populate('assignees', 'name email role department avatar color')
      .populate('projectId', 'name key color');

    // Emit real-time event if socket.io is available
    if (req.app.get('io')) {
      req.app.get('io').emit('task:created', populated);
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE task
router.put('/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignees', 'name email role department avatar color')
      .populate('projectId', 'name key color');

    if (!updated) return res.status(404).json({ error: 'Task not found' });

    await updateMemberTaskCounts();

    if (req.app.get('io')) {
      req.app.get('io').emit('task:updated', updated);
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// CLEAR all tasks
router.delete('/', async (req, res) => {
  try {
    await Task.deleteMany({});
    await updateMemberTaskCounts();
    if (req.app.get('io')) {
      req.app.get('io').emit('tasks:cleared');
    }
    res.json({ message: 'All tasks cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE single task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });

    await updateMemberTaskCounts();

    if (req.app.get('io')) {
      req.app.get('io').emit('task:deleted', req.params.id);
    }

    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD comment to task
router.post('/:id/comments', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const { author, avatar, text } = req.body;
    task.comments.push({ author, avatar, text, createdAt: new Date() });
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignees', 'name email role department avatar color')
      .populate('projectId', 'name key color');

    if (req.app.get('io')) {
      req.app.get('io').emit('task:updated', populated);
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
