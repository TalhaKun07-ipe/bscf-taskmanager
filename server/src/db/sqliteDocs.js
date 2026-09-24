const { sqliteDb } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

function getAllDocs() {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM documents WHERE isArchived = 0 ORDER BY updatedAt DESC', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getDocById(id) {
  return new Promise((resolve, reject) => {
    sqliteDb.get('SELECT * FROM documents WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function createDoc({ id = uuidv4(), title = 'Untitled Doc', icon = '📄', parentId = null, content = '', coverImage = null }) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    const query = `
      INSERT OR REPLACE INTO documents (id, title, icon, parentId, content, coverImage, isArchived, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
    `;
    sqliteDb.run(query, [id, title, icon, parentId, content, coverImage, now, now], function (err) {
      if (err) return reject(err);
      resolve({ id, title, icon, parentId, content, coverImage, isArchived: 0, createdAt: now, updatedAt: now });
    });
  });
}

function updateDoc(id, fields = {}) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    const updates = [];
    const values = [];

    if (fields.title !== undefined) {
      updates.push('title = ?');
      values.push(fields.title);
    }
    if (fields.icon !== undefined) {
      updates.push('icon = ?');
      values.push(fields.icon);
    }
    if (fields.parentId !== undefined) {
      updates.push('parentId = ?');
      values.push(fields.parentId);
    }
    if (fields.content !== undefined) {
      updates.push('content = ?');
      values.push(fields.content);
    }
    if (fields.coverImage !== undefined) {
      updates.push('coverImage = ?');
      values.push(fields.coverImage);
    }
    if (fields.isArchived !== undefined) {
      updates.push('isArchived = ?');
      values.push(fields.isArchived ? 1 : 0);
    }

    updates.push('updatedAt = ?');
    values.push(now);

    values.push(id);

    const query = `UPDATE documents SET ${updates.join(', ')} WHERE id = ?`;

    sqliteDb.run(query, values, function (err) {
      if (err) return reject(err);

      // Also record revision if content changed
      if (fields.content) {
        sqliteDb.run(
          'INSERT INTO doc_revisions (id, docId, content, savedAt) VALUES (?, ?, ?, ?)',
          [uuidv4(), id, fields.content, now],
          () => {}
        );
      }

      getDocById(id).then(resolve).catch(reject);
    });
  });
}

function deleteDoc(id) {
  return new Promise((resolve, reject) => {
    sqliteDb.run('DELETE FROM documents WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve({ success: true, deletedId: id });
    });
  });
}

function searchDocs(query) {
  return new Promise((resolve, reject) => {
    const pattern = `%${query}%`;
    sqliteDb.all(
      'SELECT id, title, icon, updatedAt, SUBSTR(content, 1, 150) as snippet FROM documents WHERE (title LIKE ? OR content LIKE ?) AND isArchived = 0',
      [pattern, pattern],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

function deleteAllDocs() {
  return new Promise((resolve, reject) => {
    sqliteDb.run('DELETE FROM documents', [], function (err) {
      if (err) return reject(err);
      sqliteDb.run('DELETE FROM doc_revisions', [], () => {});
      resolve({ success: true });
    });
  });
}

module.exports = {
  getAllDocs,
  getDocById,
  createDoc,
  updateDoc,
  deleteDoc,
  deleteAllDocs,
  searchDocs
};
