const express = require('express');
const db = require('./db'); // Import your db.js
const router = express.Router();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).send('Unauthorized');
};

// Fetch notifications (for admin dashboard)
router.get('/notifications', isAuthenticated, (req, res) => {
  const query = 'SELECT * FROM notifications ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
});

// Add a new notification (admin only)
router.post('/notifications', isAuthenticated, (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send('Message is required');
  }

  const query = 'INSERT INTO notifications (message) VALUES (?)';
  db.query(query, [message], (err, results) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).send('Notification added');
  });
});

// Delete a notification (admin only)
router.delete('/notifications/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM notifications WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.send('Notification deleted');
  });
});

module.exports = router;
