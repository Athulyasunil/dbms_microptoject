USE dbms_microproject;

CREATE TABLE department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE faculty (
    fid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    dept_id INT,
    user_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(department_id),
    FOREIGN KEY (user_id) REFERENCES users(userid)
);

CREATE TABLE class (
    cid INT AUTO_INCREMENT PRIMARY KEY,
    classname VARCHAR(255) NOT NULL,
    faid INT,
    FOREIGN KEY (faid) REFERENCES faculty(fid)
);

CREATE TABLE subject (
    sid INT AUTO_INCREMENT PRIMARY KEY,
    subname VARCHAR(255) NOT NULL,
    cid INT,
    fid INT,
    FOREIGN KEY (cid) REFERENCES class(cid),
    FOREIGN KEY (fid) REFERENCES faculty(fid)
);

CREATE TABLE student (
    rollno INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    dept_id INT,
    cid INT,
    user_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(department_id),
    FOREIGN KEY (cid) REFERENCES class(cid),
    FOREIGN KEY (user_id) REFERENCES users(userid)
);

CREATE TABLE timetable (
    t_id INT AUTO_INCREMENT PRIMARY KEY,
    cid INT,
    sub_id INT,                     -- New foreign key for subject
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    period_no INT NOT NULL,
    FOREIGN KEY (cid) REFERENCES class(cid),
    FOREIGN KEY (sub_id) REFERENCES subject(sid) -- Foreign key referencing subject
);


CREATE TABLE attendance (
    aid INT AUTO_INCREMENT PRIMARY KEY,
    sub_id INT,
    rollno INT,
    t_id INT,
    att_date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    FOREIGN KEY (sub_id) REFERENCES subject(sid),
    FOREIGN KEY (rollno) REFERENCES student(rollno),
    FOREIGN KEY (t_id) REFERENCES timetable(t_id)
);

CREATE TABLE users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student', 'faculty') NOT NULL
);
rollback;