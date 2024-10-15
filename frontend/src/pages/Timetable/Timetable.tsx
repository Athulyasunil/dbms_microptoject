import React, { useEffect, useState } from 'react';

interface TimetableProps {
    classId: string; // Accept classId as a prop
}

const Timetable: React.FC<TimetableProps> = ({ classId }) => {
    const [timetable, setTimetable] = useState<{ [key: string]: string[] } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await fetch(`http://localhost:5000/timetable/${classId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch timetable');
                }
                const data = await response.json();
                setTimetable(data);
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

        fetchTimetable();
    }, [classId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const days = timetable ? Object.keys(timetable) : [];

    return (
        <div className="timetable">
            <h2>Timetable for Class {classId}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Period 1</th>
                        <th>Period 2</th>
                        <th>Period 3</th>
                        <th>Period 4</th>
                        <th>Period 5</th>
                        <th>Period 6</th>
                        <th>Period 7</th>
                        <th>Period 8</th>
                    </tr>
                </thead>
                <tbody>
                    {days.map(day => (
                        <tr key={day}>
                            <td>{day}</td>
                            {[...Array(8)].map((_, periodIndex) => {
                                const subject = timetable![day][periodIndex];
                                return (
                                    <td key={periodIndex}>{subject || ''}</td> // Render blank if subject is null
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Timetable;
