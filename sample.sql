INSERT INTO department (department_id, name) VALUES 
(1, 'Computer Science'),
(2, 'Electronics'),
(3, 'Mechanical Engineering');

INSERT INTO users (userid, username, password, role) VALUES 
(1, 'admin', 'adminpassword', 'admin'),
(2, 'student1', 'student1password', 'student'),
(3, 'faculty1', 'faculty1password', 'faculty');

INSERT INTO student (rollno, name, email, phoneno, dept_id, cid) VALUES 
(101, 'Alice Johnson', 'alice@example.com', '1234567890', 1, 1),
(102, 'Bob Smith', 'bob@example.com', '0987654321', 1, 1),
(103, 'Charlie Brown', 'charlie@example.com', '1122334455', 2, 2);

INSERT INTO faculty (fid, name, email, phoneno, dept_id) VALUES 
(1, 'Dr. Smith', 'smith@example.com', '2233445566', 1),
(2, 'Prof. Johnson', 'johnson@example.com', '9988776655', 2);

INSERT INTO class (cid, classname, faid) VALUES 
(1, 'CS101', 1),  -- Faculty ID 1 teaches CS101
(2, 'EC101', 2);  -- Faculty ID 2 teaches EC101


INSERT INTO subject (sid, subname, cid, fid) VALUES 
(1, 'Introduction to Programming', 1, 1),
(2, 'Data Structures', 1, 1),
(3, 'Circuit Theory', 2, 2);


INSERT INTO timetable (cid, sub_id, day_of_week, start_time, end_time, period_no) VALUES 
(1, 1, 'Monday', '09:00:00', '10:00:00', 1),  -- Class A - Mathematics
(1, 2, 'Monday', '10:00:00', '11:00:00', 2), -- Class A - Physics
(1, 3, 'Tuesday', '09:00:00', '10:00:00', 1), -- Class A - Chemistry
(1, 1, 'Wednesday', '11:00:00', '12:00:00', 3), -- Class A - Mathematics
(2, 2, 'Monday', '09:00:00', '10:00:00', 1),  -- Class B - Physics
(2, 3, 'Monday', '10:00:00', '11:00:00', 2), -- Class B - Chemistry
(2, 1, 'Wednesday', '09:00:00', '10:00:00', 1); -- Class B - Mathematics


INSERT INTO attendance (sub_id, rollno, t_id, att_date, status) VALUES
(1, 101, 1, '2024-10-01', 'Present'),
(1, 101, 2, '2024-10-02', 'Absent'),
(1, 102, 1, '2024-10-01', 'Present'),
(1, 102, 2, '2024-10-02', 'Present'),
(2, 101, 3, '2024-10-01', 'Present'),
(2, 101, 4, '2024-10-02', 'Absent'),
(2, 102, 3, '2024-10-01', 'Absent'),
(2, 102, 4, '2024-10-02', 'Present'),
(1, 103, 1, '2024-10-01', 'Present'),
(1, 103, 2, '2024-10-02', 'Present'),
(2, 103, 3, '2024-10-01', 'Absent'),
(2, 103, 4, '2024-10-02', 'Present');
select * from attendance;

