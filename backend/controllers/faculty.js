// controllers/faculty.js
const db = require('../db');
const express = require("express");
const router = express.Router();

// To get all classes where a faculty is teaching subjects
router.get('/class/:fid', async (req, res) => {
    const { fid } = req.params; // Extract faculty ID from the URL parameters

    if (!fid) {
        return res.status(400).json({ message: "Faculty ID is required." });
    }

    const query = `
        SELECT DISTINCT class.cid, class.classname, subject.subname, subject.sid
        FROM class
        JOIN subject ON class.cid = subject.cid  -- Join class with subjects taught in that class
        WHERE subject.fid = ?`;  // Only get subjects taught by the given faculty

    db.query(query, [fid], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving classes', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No classes found for this faculty member.' });
        }

        return res.status(200).json({ classes: results });
    });
});

// To get students in a particular class
router.get('/students/:classId', async (req, res) => {
    const { classId } = req.params; // Extract class ID from the URL parameters

    if (!classId) {
        return res.status(400).json({ message: "Class ID is required." });
    }

    const query = `
        SELECT student.rollno, student.name, student.email, student.phone_no
        FROM student
        WHERE student.cid = ?`;

    db.query(query, [classId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving students', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No students found for this class.' });
        }

        return res.status(200).json({ students: results });
    });
});


// Route to insert attendance for a whole class
router.post('/:classId/:subjectId/attendance', async (req, res) => {
    const { classId, subjectId } = req.params;
    const { date, attendance } = req.body; // attendance is an array of { rollno, status }
    
    if (!date || !attendance || !Array.isArray(attendance)) {
        return res.status(400).json({ message: 'Date and attendance array are required.' });
    }

    try {
        // Retrieve timetable for the subject on the given date (if needed)
        const timetableQuery = `
            SELECT t_id FROM timetable 
            WHERE cid = ? AND sub_id = ? AND day_of_week = DAYNAME(?)
        `;
        const [timetableResult] = await db.query(timetableQuery, [classId, subjectId, date]);

        if (!timetableResult || timetableResult.length === 0) {
            return res.status(404).json({ message: 'No timetable found for this class and subject on the specified date.' });
        }

        const t_id = timetableResult[0].t_id; // Get the timetable ID

        // Prepare an array to hold promises for the insertions
        const insertPromises = attendance.map(student => {
            const { rollno, status } = student;

            if (!rollno || !status) {
                return Promise.reject({ message: 'Roll number and status are required.' });
            }

            // Insert attendance for each student
            const query = `
                INSERT INTO attendance (sub_id, rollno, t_id, att_date, status) 
                VALUES (?, ?, ?, ?, ?)
            `;
            return new Promise((resolve, reject) => {
                db.query(query, [subjectId, rollno, t_id, date, status], (err, result) => {
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
