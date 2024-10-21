import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateAttendance.css';

const UpdateAttendance: React.FC = () => {
    const { fid, cid, sid } = useParams<{ fid: string; cid: string; sid: string }>();
    const navigate = useNavigate();
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/faculty/classes/${cid}/students/${sid}/attendance`);
                if (!response.ok) {
                    throw new Error('Failed to fetch attendance data.');
                }
                const data = await response.json();
                setAttendanceData(data.attendanceRecords);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [cid, sid]);

    const handleUpdateAttendance = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/faculty/classes/${cid}/students/${sid}/attendance/update', (req, res) => {
`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ attendanceData }),
            });

            if (!response.ok) {
                throw new Error('Failed to update attendance.');
            }

            const result = await response.json();
            alert(result.message);
            navigate(`/faculty/${fid}/classes/${cid}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="update-attendance-section">
            <h2>Update Attendance</h2>
            <form onSubmit={handleUpdateAttendance}>
                {attendanceData.map((record, index) => (
                    <div key={index} className="attendance-record">
                        <label>
                            Date: {record.date}
                            <select
                                value={record.status}
                                onChange={(e) => {
                                    const updatedRecords = attendanceData.map((r, i) =>
                                        i === index ? { ...r, status: e.target.value } : r
                                    );
                                    setAttendanceData(updatedRecords);
                                }}
                            >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                            </select>
                        </label>
                    </div>
                ))}
                <button type="submit">Update Attendance</button>
            </form>
        </div>
    );
};

export default UpdateAttendance;
