
// controllers/faculty.js
const db = require('../db');
const express = require("express");
const router = express.Router();

// Get all faculty members
router.get('/', (req, res) => {
    db.query('SELECT * FROM faculty', (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});


// Route to insert attendance for a whole class
router.post('/:classId/attendance', async (req, res) => {
    const { date, attendance } = req.body;
    const classId = req.params.classId;

    // Validate input
    if (!date || !attendance || !Array.isArray(attendance)) {
        return res.status(400).json({ message: 'Date and attendance array are required.' });
    }

    try {
        // Prepare an array to hold promises for the insertions
        const insertPromises = attendance.map(student => {
            const { rollno, status } = student;

            // Query to insert attendance record
            const query = `INSERT INTO attendance (sub_id, rollno, att_date, status) VALUES (?, ?, ?, ?)`;
            return new Promise((resolve, reject) => {
                db.query(query, [classId, rollno, date, status], (err, result) => {
                    if (err) {
                        return reject(err); // Reject if there's an error
                    }
                    resolve(result); // Resolve if insertion was successful
                });
            });
        });

        // Wait for all insertions to complete
        await Promise.all(insertPromises);

        return res.status(201).json({ message: 'Attendance recorded successfully!' });
    } catch (err) {
        return res.status(500).json({ message: 'Error inserting attendance', error: err });
    }
});

module.exports = router;