// controllers/subject.js
const db = require('../db');
const express = require("express");
const router = express.Router();

// Get all subjects
router.get('/', (req, res) => {
    db.query('SELECT * FROM student', (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

module.exports = router;
