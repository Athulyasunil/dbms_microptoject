const db = require('../db');
const express = require("express");
const router = express.Router();

// Get subjects and attendance
router.get('/:rollno/subjects', (req, res) => {
    const rollno = req.params.rollno;

    const query = `
        SELECT 
            s.sid, 
            s.subname, 
            COUNT(a.status) AS total_classes,
            SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_classes,
            (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) / COUNT(a.status) * 100) AS attendance_percentage
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
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.status(200).json(results);
    });
});

//calendar

router.get('/:rollno/calendar', (req, res) => {
    const rollno = req.params.rollno;
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    // Validate year and month
    if (!year || isNaN(year) || !month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: "Invalid year or month." });
    }

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = month === 12 ? `${year + 1}-01-01` : `${year}-${(month + 1).toString().padStart(2, '0')}-01`;

    const query = `
        SELECT 
            a.att_date, 
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
            AND a.att_date >= ? 
            AND a.att_date < ?
    `;

    db.query(query, [rollno, startDate, endDate], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.status(200).json(results);
    });
});

module.exports = router;
