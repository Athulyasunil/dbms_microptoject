const db = require('../db');
const express = require("express");
const router = express.Router();

// Get all classes
router.get('/', (req, res) => {
    const query = "SELECT * FROM users"; // Assuming class table has columns you want to display

    db.query(query, (err, classes) => {
        if (err) return res.status(500).json(err);
        
        return res.status(200).json(classes);
    });
});

module.exports = router;