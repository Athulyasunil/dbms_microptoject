// controllers/subject.js
const db = require('../db');
const express = require("express");
const router = express.Router();

// Get all classid
router.get('/class', (req, res) => {
    db.query('SELECT * FROM class', (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

// Get all department_id
router.get('/dept', (req, res) => {
    db.query('SELECT * FROM department', (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

// Get all subjects
router.get('/subject', (req, res) => {
    db.query('SELECT * FROM subject', (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

module.exports = router;
