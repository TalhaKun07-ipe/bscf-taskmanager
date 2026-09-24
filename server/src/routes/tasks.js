const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Member = require('../models/Member');

// Helper to escape user input for safe RegExp usage (prevents ReDoS attacks)
function escapeRegex(string) {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

// GET all tasks (with sanitized search query)
router.get('/', async (req, res) => {
  try {
    const { status, priority, assignee, projectId, search } = req.query;
    const filter = {};

    if (status && typeof status === 'string') filter.status = status;
    if (priority && typeof priority === 'string') filter.priority = priority;
    if (projectId && typeof projectId === 'string') filter.projectId = projectId;
    if (assignee && typeof assignee === 'string') filter.assignees = assignee;
    
    if (search && typeof search === 'string') {
      const safeSearch = escapeRegex(search.trim());
      if (safeSearch) {
        filter.$or = [
          { title: { $regex: safeSearch, $options: 'i' } },
          { description: { $regex: safeSearch, $options: 'i' } },
          { tags: { $in: [new RegExp(safeSearch, 'i')] } }
        ];
      }
    }

    const tasks = await Task.find(filter)
      .populate('assignees', 'name email role department avatar color')
      .populate('projectId', 'name key color')
      .sort({ order: 1, createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
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
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// CREATE task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, estimatedHours, tags, assignees, projectId } = req.body;
    
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: typeof description === 'string' ? description : '',
      status: ['todo', 'in_progress', 'completed'].includes(status) ? status : 'todo',
      priority: ['low', 'medium', 'high', 'urgent'].includes(priority) ? priority : 'medium',
      dueDate: dueDate || null,
      estimatedHours: typeof estimatedHours === 'number' ? Math.max(0, estimatedHours) : 0,
      tags: Array.isArray(tags) ? tags : [],
      assignees: Array.isArray(assignees) ? assignees : [],
      projectId: projectId || null
    });

    await task.save();
    await updateMemberTaskCounts();

    const populated = await Task.findById(task._id)
      .populate('assignees', 'name email role department avatar color')
      .populate('projectId', 'name key color');

    if (req.app.get('io')) {
      req.app.get('io').emit('task:created', populated);
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create task' });
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
    res.status(400).json({ error: err.message || 'Failed to update task' });
  }
});

// NOTE: Bulk DELETE /api/tasks route was removed for Critical security (preventing unauthenticated collection wipe)

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
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ADD comment to task
router.post('/:id/comments', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const { author, avatar, text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    task.comments.push({
      author: typeof author === 'string' ? author.trim() : 'Anonymous',
      avatar: typeof avatar === 'string' ? avatar : null,
      text: text.trim(),
      createdAt: new Date()
    });
    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignees', 'name email role department avatar color')
      .populate('projectId', 'name key color');

    if (req.app.get('io')) {
      req.app.get('io').emit('task:updated', populated);
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to add comment' });
  }
});

module.exports = router;
