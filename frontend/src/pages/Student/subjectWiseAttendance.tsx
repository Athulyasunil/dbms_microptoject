import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './subjectWiseAttendance.css';

const SubjectWiseAttendance: React.FC = () => {
    const { rollno } = useParams<{ rollno: string }>();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubjectWiseAttendance = async () => {
            try {
                const response = await fetch(`http://localhost:5000/student/${rollno}/subjects`);
                if (!response.ok) {
                    throw new Error('Failed to fetch subject-wise attendance');
                }
                const data = await response.json();

                // Convert attendance_percentage from string to number
                const formattedData = data.map((item: any) => ({
                    ...item,
                    attendance_percentage: parseFloat(item.attendance_percentage) || 0,
                }));

                setSubjects(formattedData);
                console.log("API Response:", formattedData);
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

        fetchSubjectWiseAttendance();
    }, [rollno]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="attendance-container">
            <h2>Subject-wise Attendance</h2>
            {subjects.length > 0 ? (
                <div className="subjects-list">
                    {subjects.map(subject => (
                        <div key={subject.sid} className="subject-card">
                            <div className="subject-info">
                                <h3 className="subject-name">{subject.subname}</h3>
                                <p className="attendance-details">
                                    {subject.present_classes}/{subject.total_classes}
                                </p>
                                <p className="attendance-percentage">
                                    {subject.attendance_percentage.toFixed(2)}%
                                </p>
                            </div>
                            <div className="attendance-bar">
                                <div
                                    className="attendance-fill"
                                    style={{
                                        width: '100%', // Fill the bar completely
                                        background: `linear-gradient(to right, rgba(0, 128, 0, 1) ${subject.attendance_percentage}%, rgba(255, 0, 0, 1) ${subject.attendance_percentage}%)`,
                                        transition: 'background 0.5s ease', // Smooth transition
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No attendance data available for this student.</p>
            )}
        </div>
    );
};

export default SubjectWiseAttendance;
