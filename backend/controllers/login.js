const bcrypt = require('bcrypt');
const db = require('../db');
const express = require('express');
const router = express.Router();

// POST route for user login
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Query to find user by username
    const query = `SELECT * FROM users WHERE username = ?`;

    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error querying the database' });
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        // Compare the provided password with the hashed password
        try {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // If password matches, return user details
            res.status(200).json({
                message: 'Login successful!',
                user: {
                    userid: user.userid,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (err) {
            return res.status(500).json({ message: 'Error during password comparison', err });
        }
    });
});

module.exports = router;
