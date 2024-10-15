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

    // Query to find user by username, joining with student and faculty tables
    const query = `
        SELECT u.userid, u.username, u.password, u.role, 
               s.rollno, 
               f.fid 
        FROM users u
        LEFT JOIN student s ON u.userid = s.user_id 
        LEFT JOIN faculty f ON u.userid = f.user_id 
        WHERE u.username = ?`;

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
            const isMatch = await bcrypt.compare(password, user.password); // Fetching password for comparison

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Prepare the response based on the user's role
            const userDetails = {
                userid: user.userid,
                username: user.username,
                role: user.role,
                // Add rollno or fid based on role
                ...(user.role === 'student' && { rollno: user.rollno }),
                ...(user.role === 'faculty' && { fid: user.fid })
            };
            console.log(userDetails);
            // If password matches, return user details
            res.status(200).json({
                message: 'Login successful!',
                user: userDetails
            });
        } catch (err) {
            console.error('Error during password comparison:', err); // Log actual error
            return res.status(500).json({ message: 'Error during password comparison', err });
        }
    });
});

module.exports = router;
