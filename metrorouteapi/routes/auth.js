const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db'); 
const session = require('express-session');

const router = express.Router();

// Admin login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const query = 'SELECT * FROM admin WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching admin:', err.message);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    const admin = results[0];
    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).send('Invalid username or password');
      }

      // Create session for the user
      req.session.adminId = admin.id;
      req.session.username = admin.username;

      res.send('Login successful');
    });
  });
});

// Admin logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.send('Logout successful');
  });
});

module.exports = router;
