const db = require('../db');
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt'); // Import bcrypt

// Route to insert a new user into the database with hashed password
router.post('/addUser', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Hash the password using bcrypt with a saltRounds of 10
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user with the hashed password into the 'user' table
        const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
        db.query(sql, [username, hashedPassword, role], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                res.status(500).json({ error: 'Database error' });
                return;
            }

            res.status(201).json({ message: 'User added successfully', userid: result.insertId });
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;