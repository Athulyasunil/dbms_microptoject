const db = require('../db');
const express = require("express");
const router = express.Router();

// Get timetable by class ID
router.get('/:classId', (req, res) => {
    const classId = req.params.classId;

    const query = `
        SELECT 
            t.day_of_week,
            t.period_no,
            s.subname AS subject_name,
            f.name AS faculty_name
        FROM 
            timetable t
        JOIN 
            subject s ON t.sub_id = s.sid
        JOIN 
            faculty f ON s.fid = f.fid
        WHERE 
            t.cid = ?
        ORDER BY 
            FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), 
            t.period_no;
    `;

    db.query(query, [classId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Check if any timetable entries were found
        if (results.length === 0) {
            return res.status(404).json({ message: "No timetable entries found for this class." });
        }

        // Restructure data into grid format
        const timetableGrid = {};
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Initialize grid with empty arrays
        daysOfWeek.forEach(day => {
            timetableGrid[day] = new Array(7).fill(null); // Assuming a maximum of 10 periods
        });

        // Fill the grid with the data
        results.forEach(entry => {
            const { day_of_week, period_no, subject_name, faculty_name } = entry;
            const periodIndex = period_no - 1; // Adjust for 0-indexed array
            timetableGrid[day_of_week][periodIndex] = `${subject_name} (Faculty: ${faculty_name})`;
        });

        // Send the formatted timetable grid as a response
        res.status(200).json(timetableGrid);
    });
});

module.exports = router;


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
