const mysql = require('mysql2');

// Create a single MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',   // Replace with your MySQL host
  user: 'root',        // Replace with your MySQL username
  password: 'athulyA@879?',// Replace with your MySQL password
  database: 'dbms_microproject' // Replace with your database name
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;
