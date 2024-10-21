import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FacultyProfile.css'

// Faculty profile page
const FacultyProfile: React.FC = () => {
    const { fid } = useParams<{ fid: string }>();  // Get faculty ID from the URL
    const [classes, setClasses] = useState<any[]>([]);  // State to hold the classes
    const [error, setError] = useState<string | null>(null);  // State to handle errors
    const navigate = useNavigate();  // To navigate between routes
    const [facultyData, setFacultyData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFacultyData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/faculty/profile/${fid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch faculty data');
                }
                const data = await response.json();
                setFacultyData(data);
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
        fetchFacultyData();
    }, [fid]);

    // Fetch faculty classes on component mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch(`http://localhost:5000/faculty/class/${fid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch classes.');
                }
                const data = await response.json();
                console.log(data); // Log the response for debugging
                setClasses(data.classes);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred.');
                }
            }
        };
        
        fetchClasses();
    }, [fid]); // Add fid as a dependency so classes are refetched if fid changes

    // Handle click for navigating to attendance marking
    const handleMarkAttendance = (classData: any) => {
        navigate(`/faculty/${fid}/classes/${classData.cid}/attendance/${classData.sid}?subname=${classData.subname}`);
    };

    // Handle click for updating attendance
    const handleUpdateAttendance = (classData: any) => {
        navigate(`/faculty/${fid}/classes/${classData.cid}/update-attendance/${classData.sid}?subname=${classData.subname}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className='faculty-section'>
            {error && <p>{error}</p>}
            {!error && (
                <div>
                    <div className="faculty-profile">
                        <h2>Faculty Profile</h2>
                        <div>Name: {facultyData?.name || 'N/A'}</div>
                        <div>Email: {facultyData?.email || 'N/A'}</div>
                        <div>Phone: {facultyData?.phone_no || 'N/A'}</div>
                    </div>
                    <h2>Your Classes</h2>
                    {classes.length > 0 ? (
                        classes.map(classData => (
                            <div key={classData.cid} className="class-card">
                                <h3>Class: {classData.classname}</h3>
                                <h4>Subject: {classData.subname}</h4>
                                <button onClick={() => handleMarkAttendance(classData)}>
                                    Mark Attendance
                                </button>
                                <button onClick={() => handleUpdateAttendance(classData)}>
                                    Update Attendance
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No classes found for this faculty member.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacultyProfile;
