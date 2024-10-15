import React from 'react';
import { Link } from 'react-router-dom';
import { setClassData } from './shareddata';

interface ClassCardProps {
    classData: {
        cid: number;
        classname: string;
        subname: string;
        subjectID: number;  // Make sure subjectID is used here
    };
    fid: number;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, fid }) => {
    const handleMarkAttendance = () => {
        // Set the shared class data correctly
        setClassData({
            subname: classData.subname,
            cid: classData.cid,
            subjectID: classData.subjectID,  // Correctly pass the subjectID here
        });
    };

    return (
        <div className="class-card">
            <h3>{classData.classname}</h3>
            <h3>{classData.subname}</h3>
            <Link
                to={`/faculty/${fid}/classes/${classData.cid}/attendance`}
                onClick={handleMarkAttendance}
            >
                <button>Mark Attendance</button>
            </Link>
        </div>
    );
};

export default ClassCard;
