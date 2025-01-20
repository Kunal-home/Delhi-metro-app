const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost", // or your MySQL server host
  user: "root",      // MySQL username
  password: "", // MySQL password
  database: "delhi_metro",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = db;
