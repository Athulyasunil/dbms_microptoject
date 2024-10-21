import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './Attendance.css';

const Attendance: React.FC = () => {
    const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
    const [searchParams] = useSearchParams();
    const subname = searchParams.get('subname');

    const [students, setStudents] = useState<{ rollno: number; name: string }[]>([]);
    const [attendance, setAttendance] = useState<{ rollno: number; status: 'Present' | 'Absent' }[]>([]);
    const [date, setDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/faculty/students/${classId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch students.');
                }
                const data = await response.json();
                setStudents(data.students);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [classId]);

    const handleAttendanceChange = (rollno: number, status: 'Present' | 'Absent') => {
        setAttendance((prev) => {
            const existingRecord = prev.find((record) => record.rollno === rollno);
            if (existingRecord) {
                return prev.map((record) => (record.rollno === rollno ? { ...record, status } : record));
            }
            return [...prev, { rollno, status }];
        });
    };

    const submitAttendance = async () => {
        if (!date) {
            setError('Please select a date.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            console.log({ date, attendance });
            const response = await fetch(`http://localhost:5000/faculty/${classId}/${subjectId}/attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, attendance }),
            });
            console.log(JSON.stringify({date, attendance}));
            if (!response.ok) {
                throw new Error('Failed to submit attendance.');
            }

            setSuccess('Attendance recorded successfully!');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Mark Attendance for Class {classId} - Subject {subname}</h1>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <label htmlFor="attendance-date">Select Date:</label>
            <input
                id="attendance-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            {loading ? (
                <p className="loading-message">Loading...</p>
            ) : (
                <div className="attendance-container">
                    <div className="attendance-grid">
    <div className="attendance-header">Roll No</div>
    <div className="attendance-header">Student Name</div>
    <div className="attendance-header">Present</div>
    <div className="attendance-header">Absent</div>

    {students.map((student) => (
        <React.Fragment key={student.rollno}>
            <div className="student-row">{student.rollno}</div>
            <div className="student-row">{student.name}</div>
            <div className="student-row">
                <label>
                    <input
                        type="radio"
                        name={`attendance-${student.rollno}`} // Ensure this is unique
                        value="Present"
                        onChange={() => handleAttendanceChange(student.rollno, 'Present')}
                        checked={attendance.find((record) => record.rollno === student.rollno)?.status === 'Present'}
                        className="radio-button-green"
                    />
                </label>
            </div>
            <div className="student-row">
                <label>
                    <input
                        type="radio"
                        name={`attendance-${student.rollno}`} // Ensure this is unique
                        value="Absent"
                        onChange={() => handleAttendanceChange(student.rollno, 'Absent')}
                        checked={attendance.find((record) => record.rollno === student.rollno)?.status === 'Absent'}
                        className="radio-button-red"
                    />
                </label>
            </div>
        </React.Fragment>
    ))}
</div>

                </div>
            )}

            <button onClick={submitAttendance} disabled={loading}>
                Submit Attendance
            </button>
        </div>
    );
};

export default Attendance;
