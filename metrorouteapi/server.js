// server.js

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
const port = 5000;

// Import routes
const routeRouter = require('./routes/route');
const notificationRouter = require('./routes/notification');
const authRouter = require('./routes/auth');

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true, // Allow cookies to be sent
}));

// Middleware for parsing JSON requests
app.use(express.json());

// Set up session middleware
app.use(session({
  secret: '1234', // Change this secret key for security
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// Route for checking if the admin is logged in
app.get('/api/check-session', (req, res) => {
  if (req.session && req.session.adminId) {
    // Admin is logged in
    return res.status(200).send({ loggedIn: true });
  }
  // Admin is not logged in
  return res.status(401).send({ loggedIn: false });
});

// Use the routes
app.use('/api', routeRouter);
app.use('/api', notificationRouter);
app.use('/api', authRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
