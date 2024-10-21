-- Insert departments
INSERT INTO department (name) VALUES ('Computer Science'), ('Mechanical Engineering');

-- Insert faculty members
INSERT INTO faculty (name, email, phone_no, dept_id, user_id) VALUES
('Dr. John Doe', 'johndoe@example.com', '1234567890', 1, 2),  -- Computer Science
('Dr. Jane Smith', 'janesmith@example.com', '0987654321', 1, 3),  -- Computer Science
('Dr. Alan Brown', 'alanbrown@example.com', '1122334455', 2, 4);  -- Mechanical Engineering

-- Insert class
INSERT INTO class (classname, faid) VALUES
('CS-A', 1),  -- Faculty advisor for CS-A is Dr. John Doe
('ME-B', 3);  -- Faculty advisor for ME-B is Dr. Alan Brown

-- Insert subjects
INSERT INTO subject (subname, cid, fid) VALUES
('Data Structures', 1, 1),  -- Data Structures for CS-A taught by Dr. John Doe
('Algorithms', 1, 2),  -- Algorithms for CS-A taught by Dr. Jane Smith
('Thermodynamics', 2, 3);  -- Thermodynamics for ME-B taught by Dr. Alan Brown

-- Insert students
INSERT INTO student (rollno, name, email, phone_no, dept_id, cid, user_id) VALUES
(1001, 'Alice Johnson', 'alice@example.com', '1231231234', 1, 1, 5),  -- CS-A
(1002, 'Bob Williams', 'bob@example.com', '2342342345', 1, 1, 6),  -- CS-A
(1003, 'Charlie Davis', 'charlie@example.com', '3453453456', 1, 1, 7),  -- CS-A
(2001, 'David Evans', 'david@example.com', '4564564567', 2, 2, 8),  -- ME-B
(2002, 'Eva Scott', 'eva@example.com', '5675675678', 2, 2, 9);  -- ME-B

-- Insert timetable
INSERT INTO timetable (cid, sub_id, day_of_week, start_time, end_time, period_no) VALUES
(1, 1, 'Monday', '09:00:00', '10:00:00', 1),  -- Data Structures for CS-A
(1, 2, 'Monday', '10:00:00', '11:00:00', 2),  -- Algorithms for CS-A
(1, 1, 'Wednesday', '09:00:00', '10:00:00', 1),  -- Data Structures for CS-A
(1, 2, 'Wednesday', '10:00:00', '11:00:00', 2),  -- Algorithms for CS-A
(2, 3, 'Tuesday', '09:00:00', '10:00:00', 1),  -- Thermodynamics for ME-B
(2, 3, 'Thursday', '09:00:00', '10:00:00', 1);  -- Thermodynamics for ME-B

-- Insert attendance
INSERT INTO attendance (sub_id, rollno, t_id, att_date, status) VALUES
(1, 1001, 1, '2024-10-01', 'Present'),  -- Alice present for Data Structures
(1, 1002, 1, '2024-10-01', 'Absent'),   -- Bob absent for Data Structures
(1, 1003, 1, '2024-10-01', 'Present'),  -- Charlie present for Data Structures
(2, 1001, 2, '2024-10-01', 'Present'),  -- Alice present for Algorithms
(2, 1002, 2, '2024-10-01', 'Absent'),   -- Bob absent for Algorithms
(2, 1003, 2, '2024-10-01', 'Present'),  -- Charlie present for Algorithms
(3, 2001, 5, '2024-10-01', 'Present'),  -- David present for Thermodynamics
(3, 2002, 5, '2024-10-01', 'Absent');   -- Eva absent for Thermodynamics
INSERT INTO attendance (sub_id, rollno, t_id, att_date, status) VALUES
(1, 1001, 1, '2024-10-02', 'Absent');
