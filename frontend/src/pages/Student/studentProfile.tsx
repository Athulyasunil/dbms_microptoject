import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Timetable from '../Timetable/Timetable'; // Adjust the path as necessary
import './StudentProfile.css'; // Ensure you have the necessary styles in place

interface StudentProfileProps {
    rollno: string; // Accept rollno as a prop
}

const StudentProfile: React.FC<StudentProfileProps> = ({ rollno }) => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/student/profile/${rollno}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const data = await response.json();
                setStudentData(data);
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
        navigate(`/student/${rollno}/subjects`); // Navigate to the frontend route that shows subject-wise attendance
    };

    const goToCalendar = () => {
        navigate(`/student/${rollno}/calendar`); // Navigate to the calendar attendance
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="student-profile">
            <div className="profile-container">
                <h2>Student Profile</h2>
                <div>Name: {studentData?.name || 'N/A'}</div>
                <div>Email: {studentData?.email || 'N/A'}</div>
                <div>Phone: {studentData?.phone_no || 'N/A'}</div>
            </div>

            <div className="timetable-container">
                {studentData?.className && `(${studentData.className})`}
                <Timetable classId={studentData.cid} />
            </div>

            <div className="attendance-container">
                <button onClick={handleAttendanceClick} className="attendance-button">
                    View Attendance
                </button>
                <button className="calendar-attendance-button" onClick={goToCalendar}>
                    View Calendar Attendance
                </button>
            </div>
        </div>
    );
};

export default StudentProfile;
