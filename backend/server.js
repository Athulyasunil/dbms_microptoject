// server/server.js
const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const db = require('./db');
const timetableRoutes = require('./controllers/timetable');
const studentRoutes = require('./controllers/student');
const subjecttRoutes = require('./controllers/subject');
const facultyRoutes = require('./controllers/faculty');
const adminRoutes = require('./controllers/admin');
const loginRoutes = require('./controllers/login');
const usersRoutes = require('./controllers/users');

const app = express()
const port = 5000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/student', timetableRoutes); // Use the timetable routes under /student
app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/timetable', timetableRoutes);
app.use('/admin', adminRoutes);
app.use('/login', loginRoutes);
app.use('/users', usersRoutes);
app.use('/subject', subjecttRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
