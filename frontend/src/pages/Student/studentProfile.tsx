// src/pages/Student/StudentProfile.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Timetable from '../Timetable/Timetable'; // Adjust the path as necessary

interface StudentProfileProps {
    rollno: string; // Accept rollno as a prop
}

const StudentProfile: React.FC<StudentProfileProps> = ({ rollno }) => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [attendancePercentage, setAttendancePercentage] = useState<number | null>(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/student/profile/${rollno}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const data = await response.json();
                setStudentData(data);

                const totalClasses = data.totalClasses; 
                const attendedClasses = data.attendedClasses;

                if (totalClasses > 0) {
                    setAttendancePercentage(((attendedClasses / totalClasses) * 100));
                } else {
                    setAttendancePercentage(0); 
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [rollno]);

    const handleAttendanceClick = () => {
        navigate(`/student/${rollno}/attendance`); // Navigate to subject-wise attendance
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="student-profile">
            <h2>Student Profile</h2>
            <div>Name: {studentData?.name || 'N/A'}</div>
            <div>Email: {studentData?.email || 'N/A'}</div>
            <div>Phone: {studentData?.phone_no || 'N/A'}</div>

            <h3>Timetable</h3>
            {studentData.cid && (
                <Timetable classId={studentData.cid} /> 
            )}

            <h3>Total Attendance Percentage: 
                <span onClick={handleAttendanceClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    {attendancePercentage?.toFixed(2)}%
                </span>
            </h3>
        </div>
    );
};

export default StudentProfile;
