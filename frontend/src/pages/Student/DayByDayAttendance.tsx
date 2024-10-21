import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DayByDayAttendance.css';

interface AttendanceRecord {
    att_date: string;   // Format: YYYY-MM-DD
    status: string;
    subname: string;
    present_count?: number; // Optional property
    absent_count?: number;  // Optional property
}

const DayByDayAttendance: React.FC = () => {
    const { rollno } = useParams<{ rollno: string }>();
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [detailedAttendance, setDetailedAttendance] = useState<AttendanceRecord[]>([]);

    // Fetch monthly attendance data on component mount
    useEffect(() => {
        const fetchMonthlyAttendance = async () => {
            setLoading(true);
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Month is 0-indexed

            try {
                const response = await fetch(`http://localhost:5000/student/${rollno}/monthly-attendance?year=${year}&month=${month}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch monthly attendance data');
                }
                const data: AttendanceRecord[] = await response.json();
                console.log("Fetched attendance data:", data);  // Log fetched data here
                setAttendanceData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyAttendance();
    }, [rollno]);

    const onDateClick = async (date: Date) => {
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        const dateStr = localDate.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        setDetailedAttendance([]);  // Reset detailedAttendance when a new date is selected

        // Fetch detailed attendance for the selected date
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/student/${rollno}/calendar?date=${dateStr}`);
            if (!response.ok) {
                throw new Error('Failed to fetch attendance for the selected date');
            }
            const data: AttendanceRecord[] = await response.json();
            setDetailedAttendance(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Function to render dots on the calendar tile
    const getTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            //const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            //const dateStr = localDate.toISOString().split('T')[0];  // Convert to 'YYYY-MM-DD' format
            const dateStr = new Date(date).toISOString().split('T')[0];
            const record = attendanceData.find((record) => {
                // Strip the time part of `att_date` if it exists
                const formattedAttDate = record.att_date.split('T')[0];
                return formattedAttDate === dateStr;
            });
    
            if (!record) return null;
    
            const presentCount = record?.present_count ?? 0;
            const absentCount = record?.absent_count ?? 0;
    
            return (
                <div className="dots">
                    {presentCount > 0 && <span className="dot present"></span>}
                    {absentCount > 0 && <span className="dot absent"></span>}
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="calendar-attendance-grid">
            <h2>Attendance Calendar for Roll No: {rollno}</h2>

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div>
                    <Calendar
                            onClickDay={onDateClick}
                            tileContent={getTileContent}
                            value={new Date()}  // Set default view to the current date
                            className="react-calendar"
                            defaultView="month"  // Set initial view to "month"
                            maxDetail="month"    // Prevent switching to "year" or "decade"
                            minDetail="month"    // Ensure it doesn't go lower than month view
                    />
                    {selectedDate && detailedAttendance.length > 0 && (
                        <div className="attendance-details">
                            <h3>Attendance for {selectedDate}</h3>
                            <ul>
                                {detailedAttendance.map((record, index) => (
                                    <li key={index}>
                                        {record.subname}: {record.status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DayByDayAttendance;
