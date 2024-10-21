// controllers/faculty.js
const db = require('../db');
const express = require("express");
const router = express.Router();

//faculty profile
router.get('/profile/:fid', (req, res) => {
    const fid = req.params.fid;
    const query = 'SELECT * FROM FACULTY WHERE fid = ?';

    db.query(query, [fid], (error, results) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        console.log("Query Results:", results); // Log the results returned from the database

        if (results.length === 0) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const facultyProfile = results[0];
        res.status(200).json(facultyProfile);
    });
});

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
// Route to update attendance
router.put('/:rollno/attendance', (req, res) => {
    const { rollno } = req.params;
    const { date, subject, status } = req.body; // Expecting { date, subject, status }

    // Find and update the attendance record
    const record = attendanceRecords.find(record => 
        record.rollno === rollno && record.date === date && record.subject === subject
    );

    if (record) {
        record.status = status; // Update the status (e.g., 'present' or 'absent')
        return res.status(200).json({ message: 'Attendance updated successfully', record });
    }

    return res.status(404).json({ message: 'Record not found' });
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

router.get('/classes/:cid/students/:sid/attendance', (req, res) => {
    const { cid, sid } = req.params;

    const query = `
        SELECT att_date AS date, status
        FROM attendance
        WHERE cid = ? AND rollno = ?
    `;

    db.query(query, [cid, sid], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving attendance data', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this student.' });
        }

        res.status(200).json({ attendanceRecords: results });
    });
});

// POST: Update attendance data for a student in a class
router.post('/classes/:cid/students/:sid/attendance/update', (req, res) => {
    const { cid, sid } = req.params;
    const { attendanceData } = req.body; // The updated attendance records

    if (!attendanceData || !Array.isArray(attendanceData)) {
        return res.status(400).json({ message: 'Attendance data must be provided as an array.' });
    }

    // Loop through attendanceData and update each record
    attendanceData.forEach(record => {
        const { date, status } = record;

        const updateQuery = `
            UPDATE attendance
            SET status = ?
            WHERE rollno = ? AND att_date = ? AND cid = ?
        `;

        db.query(updateQuery, [status, sid, date, cid], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating attendance', error: err });
            }
        });
    });

    res.status(200).json({ message: 'Attendance updated successfully.' });
});




// Route to insert attendance for a whole class
router.post('/:classId/:subjectId/attendance', (req, res) => {
    const { classId, subjectId } = req.params;
    const { date, attendance } = req.body;

    if (!date || !attendance || !Array.isArray(attendance)) {
        return res.status(400).json({ message: 'Date and attendance array are required.' });
    }

    console.log('Inserting attendance for:', { classId, subjectId, date });

    // Retrieve timetable for the subject on the given date
    const timetableQuery = `
        SELECT t_id FROM timetable 
        WHERE cid = ? AND sub_id = ? AND day_of_week = DAYNAME(?)
    `;
    db.query(timetableQuery, [classId, subjectId, date], (err, timetableResult) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error retrieving timetable', error: err });
        }

        if (!timetableResult || timetableResult.length === 0) {
            return res.status(404).json({ message: 'No timetable found for this class and subject on the specified date.' });
        }

        const t_id = timetableResult[0].t_id;

        // Now insert attendance for each student
        attendance.forEach((student) => {
            const { rollno, status } = student;

            if (!rollno || !status) {
                return res.status(400).json({ message: 'Roll number and status are required.' });
            }

            const insertQuery = `
                INSERT INTO attendance (sub_id, rollno, t_id, att_date, status) 
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(insertQuery, [subjectId, rollno, t_id, date, status], (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting attendance:', insertErr);
                    return res.status(500).json({ message: 'Error inserting attendance', error: insertErr });
                }

                console.log(`Attendance inserted for student ${rollno}`);
            });
        });

        // Return success response after inserting attendance
        return res.status(201).json({ message: 'Attendance recorded successfully!' });
    });
});

module.exports = router;
