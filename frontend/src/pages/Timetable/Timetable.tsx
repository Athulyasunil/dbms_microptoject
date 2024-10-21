import React, { useEffect, useState } from 'react';
import './Timetable.css'
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
            <h2 className="timetable-heading"> Timetable </h2>
            <div className="timetable-grid">
                <div className="table-header">Day</div>
                <div className="table-header">Period 1</div>
                <div className="table-header">Period 2</div>
                <div className="table-header">Period 3</div>
                <div className="table-header">Period 4</div>
                <div className="table-header">Period 5</div>
                <div className="table-header">Period 6</div>

                {days.map(day => (
                    <>
                        <div className="table-cell">{day}</div>
                        {[...Array(6)].map((_, periodIndex) => {
                            const subject = timetable![day][periodIndex];
                            return (
                                <div className="table-cell" key={periodIndex}>
                                    {subject || ''}
                                </div>
                            );
                        })}
                    </>
                ))}
            </div>
        </div>
    );
};

export default Timetable;
