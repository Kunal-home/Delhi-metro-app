const express = require("express");
const axios = require("axios");
const cors = require("cors");
const db = require("./routes/db"); // Import the database connection

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.adminId) {
      return next();
    }
    return res.status(401).send('Unauthorized');
  };
const app = express();
app.use(express.json()); // Middleware to parse JSON in the request body

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Allow only your frontend's URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Include PUT and DELETE methods
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions)); // Enable CORS for all routes

const GOOGLE_API_KEY = "your api key";

app.get("/api/fare-rates", async (req, res) => {
    console.log("Received request for /api/fare-rates");
      const query = 'SELECT * FROM fare_rates ORDER BY maxDistance ASC';
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).send('Internal Server Error');
        }
        res.json(results);
      });
     
  });
  app.put("/api/fare-rates", isAuthenticated , async (req, res) => {
    console.log("Received request to update fare rates");
    const { rates } = req.body;
  
    // Ensure the rates are in the correct format
    if (!Array.isArray(rates)) {
      return res.status(400).json({ error: "Invalid fare rates format" });
    }
  
    try {
      // Loop through each rate and update it
      for (const rate of rates) {
        const updateQuery = "UPDATE fare_rates SET fare = ? WHERE maxDistance = ?";
       db.query(updateQuery, [rate.fare, rate.maxDistance]);
      }
  
      res.status(200).json({ message: "Fare rates updated successfully" });
    } catch (err) {
      console.error("Error updating fare rates:", err);
      res.status(500).json({ error: err.message });
    }
    
  });
  
// GET route to calculate distance using Google API
app.get("/api/distance", async (req, res) => {
  const { origin, destination } = req.query;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
