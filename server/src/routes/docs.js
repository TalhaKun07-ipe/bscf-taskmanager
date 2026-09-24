const express = require('express');
const router = express.Router();
const Doc = require('../models/Doc');

// Helper to escape user input for safe RegExp usage (prevents ReDoS attacks)
function escapeRegex(string) {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET all docs (or search)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (q && typeof q === 'string') {
      const safeQuery = escapeRegex(q.trim());
      if (safeQuery) {
        const regex = new RegExp(safeQuery, 'i');
        const results = await Doc.find({
          isArchived: false,
          $or: [{ title: regex }, { content: regex }]
        }).sort({ updatedAt: -1 });

        const mapped = results.map(doc => ({
          id: doc._id,
          _id: doc._id,
          title: doc.title,
          icon: doc.icon,
          updatedAt: doc.updatedAt,
          snippet: doc.content ? doc.content.substring(0, 150) : ''
        }));
        return res.json(mapped);
      }
    }

    const docs = await Doc.find({ isArchived: false }).sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// GET single doc
router.get('/:id', async (req, res) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// CREATE doc
router.post('/', async (req, res) => {
  try {
    const { title, icon, parentId, content, coverImage } = req.body;
    const newDoc = await Doc.create({
      title: typeof title === 'string' && title.trim() ? title.trim() : 'Untitled Doc',
      icon: typeof icon === 'string' ? icon : '📄',
      parentId: parentId || null,
      content: typeof content === 'string' ? content : '',
      coverImage: typeof coverImage === 'string' ? coverImage : null
    });
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create document' });
  }
});

// UPDATE doc
router.put('/:id', async (req, res) => {
  try {
    const updated = await Doc.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Document not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update document' });
  }
});

// DELETE doc
router.delete('/:id', async (req, res) => {
  try {
    await Doc.findByIdAndDelete(req.params.id);
    res.json({ success: true, deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
