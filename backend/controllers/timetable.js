const db = require('../db');
const express = require("express");
const router = express.Router();


// Get student timetable by roll number
router.get('/:rollno/timetable', (req, res) => {
    const rollno = req.params.rollno;
    const q = `
        SELECT 
            t.day_of_week,
            t.start_time,
            t.end_time,
            t.period_no,
            s.subname AS subject_name,
            f.name AS faculty_name
        FROM
            student st
        JOIN
            class c ON st.cid = c.cid
        JOIN
            subject s ON s.cid = c.cid
        JOIN
            timetable t ON t.cid = c.cid
        JOIN
            faculty f ON s.fid = f.fid
        WHERE
            st.rollno = ?
        ORDER BY 
            t.day_of_week, t.period_no;
    `;

    db.query(q, [rollno], (err, data) => {
        if (err) return res.status(500).json(err);
        
        // Format the response
        const timetable = {};
        
        data.forEach(entry => {
            const day = entry.day_of_week;
            const timeRange = `${entry.start_time} - ${entry.end_time}`;
            const periodDetails = `Period No ${entry.period_no}: ${entry.subject_name} (Faculty: ${entry.faculty_name})`;
            
            if (!timetable[day]) {
                timetable[day] = [];
            }
            timetable[day].push(`${timeRange} - ${periodDetails}`);
        });

        // Send formatted timetable
        return res.status(200).json(timetable);
    });
});

// Admin adds timetable
router.post('/add', (req, res) => {
    const { cid, sub_id, day_of_week, start_time, end_time, period_no } = req.body;
    console.log(req.body);
    // Check for overlapping timetable entries
    const overlapCheckQuery = `
        SELECT * FROM timetable 
        WHERE cid = ? 
        AND day_of_week = ? 
        AND (
            (start_time < ? AND end_time > ?) OR 
            (start_time < ? AND end_time > ?)
        )
    `;

    db.query(overlapCheckQuery, [cid, sub_id, day_of_week, start_time, end_time, period_no], (err, results) => {
        if (err) return res.status(500).json(err);
        
        if (results.length > 0) {
            return res.status(400).json({ message: "Timetable entry overlaps with an existing entry." });
        }

        const insertQuery = `
            INSERT INTO timetable (cid, sub_id, day_of_week, start_time, end_time, period_no)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [cid, sub_id, day_of_week, start_time, end_time, period_no], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(201).json({ message: "Timetable entry added successfully!" });
        });
    });
});

module.exports = router;
