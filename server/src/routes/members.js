const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Task = require('../models/Task');

// GET all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET allocation summary matrix
router.get('/allocation-matrix', async (req, res) => {
  try {
    const members = await Member.find();
    const tasks = await Task.find();

    const allocation = members.map((m) => {
      const memberTasks = tasks.filter((t) =>
        (t.assignees || []).some((a) => a.toString() === m._id.toString())
      );

      const inProgressCount = memberTasks.filter((t) => t.status === 'in_progress').length;
      const todoCount = memberTasks.filter((t) => t.status === 'todo').length;
      const completedCount = memberTasks.filter((t) => t.status === 'completed').length;
      const totalEstimatedHours = memberTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

      const capacityHours = m.capacityHours || 40;
      const utilizationRate = Math.min(Math.round((totalEstimatedHours / capacityHours) * 100), 100);

      return {
        member: m,
        totalTasks: memberTasks.length,
        inProgressCount,
        todoCount,
        completedCount,
        totalEstimatedHours,
        capacityHours,
        utilizationRate,
        tasks: memberTasks
      };
    });

    res.json(allocation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE member
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE member
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
