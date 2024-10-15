// src/pages/Student/Student.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import StudentProfile from './studentProfile'; // Ensure this matches your file's casing

const Student: React.FC = () => {
    const { rollno } = useParams<{ rollno: string }>(); // Get rollno from the URL

    // Render StudentProfile only when rollno is available
    return (
        <div className="student-page">
            <h1>Student Page</h1>
            {rollno ? <StudentProfile rollno={rollno} /> : <p>Roll number not found.</p>}
        </div>
    );
};

export default Student;
