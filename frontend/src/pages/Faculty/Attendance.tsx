// src/components/Attendance.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClassData } from './shareddata'; // Import the shared file

const Attendance: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const { subname, subjectID } = getClassData(); // Get the shared class data

    const [students, setStudents] = useState<{ rollno: number; name: string }[]>([]);
    const [attendance, setAttendance] = useState<{ rollno: number; status: 'Present' | 'Absent' }[]>([]);
    const [date, setDate] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    useEffect(() => {
        const fetchClassData = async () => {
            setLoading(true);
            try {
                const studentResponse = await fetch(`http://localhost:5000/faculty/students/${classId}`);
                if (!studentResponse.ok) {
                    throw new Error('Failed to fetch students');
                }
                const studentData = await studentResponse.json();
                setStudents(studentData.students);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchClassData();
    }, [classId]);

    const handleAttendanceChange = (rollno: number, status: 'Present' | 'Absent') => {
        setAttendance(prev => {
            const existingRecord = prev.find(record => record.rollno === rollno);
            if (existingRecord) {
                return prev.map(record => record.rollno === rollno ? { ...record, status } : record);
            }
            return [...prev, { rollno, status }];
        });
    };
    
    const submitAttendance = async () => {
        if (!subjectID) {
            setError('No subject found for this class.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(`http://localhost:5000/faculty/${classId}/${subjectID}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, attendance }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit attendance');
            }

            setSuccess('Attendance submitted successfully!');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            {/* Display the subject name in the heading */}
            <h1>Mark Attendance for Class {classId} - Subject {subname}</h1>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <label>Select Date:</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            {loading && <div>Loading...</div>}
            {!loading && (
                <div className="attendance-container">
                    {students.map(student => (
                        <div key={student.rollno} className="student-row">
                            <span className="student-name">{student.name}</span>
                            <input
                                type="radio"
                                id={`present-${student.rollno}`}
                                name={`attendance-${student.rollno}`}
                                value="Present"
                                onChange={() => handleAttendanceChange(student.rollno, 'Present')}
                                checked={attendance.find(record => record.rollno === student.rollno)?.status === 'Present'}
                            />
                            <label htmlFor={`present-${student.rollno}`} className="present attendance-label">Present</label>
                            <input
                                type="radio"
                                id={`absent-${student.rollno}`}
                                name={`attendance-${student.rollno}`}
                                value="Absent"
                                onChange={() => handleAttendanceChange(student.rollno, 'Absent')}
                                checked={attendance.find(record => record.rollno === student.rollno)?.status === 'Absent'}
                            />
                            <label htmlFor={`absent-${student.rollno}`} className="absent attendance-label">Absent</label>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={submitAttendance} disabled={loading}>Submit Attendance</button>
        </div>
    );
};

export default Attendance;
