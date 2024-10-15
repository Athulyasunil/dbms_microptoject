const db = require('../db');
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();

router.get('/viewUsers', (req, res) => {
    const query = "SELECT * FROM users"; // Assuming class table has columns you want to display

    db.query(query, (err, classes) => {
        if (err) return res.status(500).json(err);
        
        return res.status(200).json(classes);
    });
});

router.post('/add', async (req, res) => {
    const { username, password, role, details } = req.body;
    const { email, phone_no, dept_id, rollno, cid, name, fid } = details || {};  // Handle undefined details for admin

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required.' });
    }

    // Start a transaction
    db.query('START TRANSACTION', async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error starting transaction', err });
        }

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the users table
            const insertUserQuery = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
            db.query(insertUserQuery, [username, hashedPassword, role], (err, result) => {
                if (err) {
                    return db.query('ROLLBACK', () => {
                        res.status(500).json({ message: 'Error adding user to database', err });
                    });
                }

                const userId = result.insertId;

                // For admin, no further details are needed
                if (role === 'admin') {
                    db.query('COMMIT', (err) => {
                        if (err) {
                            return db.query('ROLLBACK', () => {
                                res.status(500).json({ message: 'Error committing transaction', err });
                            });
                        }
                        return res.status(201).json({ message: 'Admin user registered successfully!' });
                    });
                } else if (role === 'student') {
                    if (!name) {
                        return db.query('ROLLBACK', () => {
                            res.status(400).json({ message: 'Name is required for students.' });
                        });
                    }

                    const insertStudentQuery = `INSERT INTO student (rollno, email, phone_no, dept_id, cid, user_id, name) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    db.query(insertStudentQuery, [rollno, email, phone_no, dept_id, cid, userId, name], (err) => {
                        if (err) {
                            return db.query('ROLLBACK', () => {
                                res.status(500).json({ message: 'Error adding student details', err });
                            });
                        }

                        db.query('COMMIT', (err) => {
                            if (err) {
                                return db.query('ROLLBACK', () => {
                                    res.status(500).json({ message: 'Error committing transaction', err });
                                });
                            }
                            res.status(201).json({ message: 'User registered successfully as student!' });
                        });
                    });
                } else if (role === 'faculty') {
                    const insertFacultyQuery = `INSERT INTO faculty (name, email, phone_no, dept_id, user_id) VALUES (?, ?, ?, ?, ?)`;
                    db.query(insertFacultyQuery, [name, email, phone_no, dept_id, userId], (err) => {
                        if (err) {
                            return db.query('ROLLBACK', () => {
                                res.status(500).json({ message: 'Error adding faculty details', err });
                            });
                        }

                        db.query('COMMIT', (err) => {
                            if (err) {
                                return db.query('ROLLBACK', () => {
                                    res.status(500).json({ message: 'Error committing transaction', err });
                                });
                            }
                            res.status(201).json({ message: 'User registered successfully as faculty!' });
                        });
                    });
                }
            });
        } catch (err) {
            // Roll back the transaction in case of any error
            db.query('ROLLBACK', () => {
                res.status(500).json({ message: 'Error during registration process', err });
            });
        }
    });
});


// Route to delete a user by ID
router.delete('/deleteUser/:userid', (req, res) => {
    const { userid } = req.params;

    const deleteUserQuery = 'DELETE FROM users WHERE userid = ?';

    db.query(deleteUserQuery, [userid], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting user', err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: `User with ID ${userid} deleted successfully` });
    });
});

// Route to delete an entire class by ID
router.delete('/deleteClass/:cid', (req, res) => {
    const { cid } = req.params;

    const deleteClassQuery = 'DELETE FROM class WHERE cid = ?';

    db.query(deleteClassQuery, [cid], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting class', err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }
        return res.status(200).json({ message: `Class with ID ${cid} deleted successfully` });
    });
});

module.exports = router;
