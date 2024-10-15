// src/shareddata.ts

interface ClassData {
    subname: string;
    cid: number | null;
    subjectID: number | null;  // Add subjectID to the shared data structure
}

let classData: ClassData = {
    subname: '',
    cid: null,
    subjectID: null,
};

export const setClassData = (data: Partial<ClassData>): void => {
    classData = { ...classData, ...data };
};

export const getClassData = (): ClassData => classData;
