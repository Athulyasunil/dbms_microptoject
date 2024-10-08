const db = require('../db');
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();

// Get all classes
router.get('/', (req, res) => {
    const query = "SELECT * FROM class"; // Assuming class table has columns you want to display

    db.query(query, (err, classes) => {
        if (err) return res.status(500).json(err);
        
        return res.status(200).json(classes);
    });
});

// Route to register or add a new user
router.post('/add', async (req, res) => {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required.' });
    }

    // Check if the username already exists
    const checkQuery = `SELECT * FROM users WHERE username = ?`;

    db.query(checkQuery, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking username', err });
        }

        if (results.length > 0) {
            // Username already exists
            return res.status(409).json({ message: 'Username already exists. Please choose a different username.' });
        }

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Query to insert new user with hashed password
            const insertQuery = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;

            db.query(insertQuery, [username, hashedPassword, role], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error adding user to database', err });
                }
                res.status(201).json({ message: 'User registered successfully!' });
            });
        } catch (err) {
            return res.status(500).json({ message: 'Error registering user', err });
        }
    });
});

module.exports = router;
