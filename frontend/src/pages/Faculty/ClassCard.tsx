import React from 'react';
import { setClassData } from './shareddata'; // Import shared data functions

interface ClassCardProps {
    classData: {
        cid: number;
        classname: string;
        subname: string;
        subjectID: number;  // Ensure subjectID is part of class data
    };
    fid: number;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, fid }) => {
    console.log("Received Class Data:", classData); 
    const handleMarkAttendance = (event: React.MouseEvent) => {
        event.preventDefault(); // Prevent the default behavior of the link

        // Set the shared class data
        setClassData({
            subname: classData.subname,
            cid: classData.cid,
            subjectID: classData.subjectID,  // Correctly pass the subjectID here
        });

        // Navigate after setting data
        window.location.href = `/faculty/${fid}/classes/${classData.cid}/attendance/${classData.subjectID}`};

    return (
        <div className="class-card">
            <h3>Class: {classData.classname}</h3>
            <h3>Subject: {classData.subname}</h3>

            {/* Link to mark attendance */}
            <button onClick={handleMarkAttendance}>
                Mark Attendance
            </button>
        </div>
    );
};

export default ClassCard;
