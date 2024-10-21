const db = require('../db');
const express = require("express");
const router = express.Router();

// Get student profile by roll number
router.get('/profile/:rollno', (req, res) => {
    const rollno = req.params.rollno;
    console.log(`Fetching profile for rollno: ${rollno}`); // Log the roll number being queried
    const query = 'SELECT * FROM STUDENT WHERE rollno = ?';

    db.query(query, [rollno], (error, results) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        console.log("Query Results:", results); // Log the results returned from the database

        if (results.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const studentProfile = results[0];
        res.status(200).json(studentProfile);
    });
});


router.get('/:rollno/subjects', (req, res) => {
    const rollno = req.params.rollno;

    const query = `
        SELECT 
            s.sid, 
            s.subname, 
            COUNT(a.status) AS total_classes,
            SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_classes,
            (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) / NULLIF(COUNT(a.status), 0) * 100) AS attendance_percentage
        FROM 
            subject s
        LEFT JOIN 
            attendance a ON s.sid = a.sub_id AND a.rollno = ?
        WHERE 
            s.cid = (SELECT cid FROM student WHERE rollno = ?)
        GROUP BY 
            s.sid, s.subname;
    `;

    db.query(query, [rollno, rollno], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }

        // Convert attendance_percentage to string in the results
        const formattedResults = results.map(item => ({
            ...item,
            attendance_percentage: item.attendance_percentage.toString() // Convert to string here
        }));

        console.log("Query Results:", formattedResults); // Log the formatted results
        res.status(200).json(formattedResults);
    });
});

// Get monthly attendance data
router.get('/:rollno/monthly-attendance', (req, res) => {
    const rollno = req.params.rollno;
    const year = parseInt(req.query.year, 10);  // Parsing year
    const month = parseInt(req.query.month, 10); // Parsing month

    // Validate year and month after parsing
    if (!year || isNaN(year) || !month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: "Invalid year or month." });
    }

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = month === 12 ? `${year + 1}-01-01` : `${year}-${(month + 1).toString().padStart(2, '0')}-01`;

    const query = `
        SELECT 
            a.att_date,
            SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
            SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_count
        FROM 
            attendance a 
        JOIN 
            student st ON a.rollno = st.rollno 
        WHERE 
            st.rollno = ? 
            AND a.att_date >= ? 
            AND a.att_date < ?
        GROUP BY 
            a.att_date
        ORDER BY 
            a.att_date;
    `;

    db.query(query, [rollno, startDate, endDate], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(results);
    });
});



// Get calendar attendance for a specific date
router.get('/:rollno/calendar', (req, res) => {
    const rollno = req.params.rollno;
    const date = req.query.date; // Accepting date as a query parameter

    // Validate date
    if (!date) {
        return res.status(400).json({ message: "Invalid date." });
    }

    const query = `
        SELECT  
            a.status, 
            s.subname 
        FROM 
            attendance a 
        JOIN 
            subject s ON a.sub_id = s.sid 
        JOIN 
            student st ON a.rollno = st.rollno 
        WHERE 
            st.rollno = ? 
            AND a.att_date = ?
    `;

    db.query(query, [rollno, date], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json(results); // Returning detailed attendance for the specific date
    });
});


module.exports = router;
