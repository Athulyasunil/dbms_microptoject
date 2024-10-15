import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './pages/Hero/hero';
import Login from './pages/Login/Login';
import Student from './pages/Student/Student';
import ClassList from './pages/Faculty/ClassList'; // Assuming ClassList is a component for showing classes
import Attendance from './pages/Faculty/Attendance'; // New component to mark attendance
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<Student />} />
        <Route path="/faculty/:fid/classes" element={<ClassList />} /> {/* Dynamic route for classes taught by faculty */}
        //<Route path="/faculty/:fid/classes/:classId/attendance" element={<Attendance />} /> {/* Dynamic route for attendance */}
        <Route path="/faculty/:fid/classes/:classId/subjects/:subjectId/attendance" element={<Attendance/>} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
