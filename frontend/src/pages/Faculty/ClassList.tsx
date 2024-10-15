// src/components/ClassList.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClassCard from './ClassCard';

interface ClassData {
    cid: number;
    classname: string;
    subname: string;
    subjectID: number;
}

const ClassList: React.FC = () => {
    const { fid } = useParams<{ fid: string | undefined }>(); // Ensure fid can be undefined
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    useEffect(() => {
        const fetchClasses = async () => {
            if (!fid) {
                setError("Faculty ID is required.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/faculty/class/${fid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch classes');
                }
                const data = await response.json();
                setClasses(data.classes);
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

        fetchClasses();
    }, [fid]);

    return (
        <div className="class-list">
            {loading && <div className="loading">Loading classes...</div>}
            {error && <div className="error">{error}</div>}
            {classes.length > 0 ? (
                classes.map((classItem) => (
                    <ClassCard key={classItem.cid} classData={classItem} fid={fid ? parseInt(fid) : 0} />
                ))
            ) : (
                !loading && <div>No classes found for this faculty member.</div>
            )}
        </div>
    );
};

export default ClassList;
