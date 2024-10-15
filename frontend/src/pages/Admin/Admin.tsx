import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

// Define types for user details, user, class, and department
interface UserDetails {
  email: string;
  phone_no: string;
  department_id: number;
  rollno: number;
  cid: number;
  name: string;
  fid?: number;
}

interface User {
  userid: number;
  username: string;
  role: string;
}

interface Class {
  cid: number;
  classname: string;
}

interface Department {
  department_id: number;
  name: string;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showAddUserForm, setShowAddUserForm] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('student');
  const [details, setDetails] = useState<UserDetails>({
    email: '',
    phone_no: '',
    department_id: 0,
    rollno: 0,
    cid: 0,
    name: '',
    fid: undefined,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    fetchUsers();
    fetchClassesAndDepartments();
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/viewUsers');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchClassesAndDepartments = async () => {
    try {
      const classRes = await axios.get('http://localhost:5000/get/class');
      const deptRes = await axios.get('http://localhost:5000/get/dept');
      setClasses(classRes.data);
      setDepartments(deptRes.data);
    } catch (error) {
      console.error('Error fetching classes/departments', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const body = { username, password, role, details };
      await axios.post('http://localhost:5000/admin/add', body);
      fetchUsers();
      alert('User added successfully');
      setShowAddUserForm(false); // Hide the form after adding
    } catch (error) {
      console.error('Error adding user', error);
      alert('Failed to add user');
    }
  };

  const handleDeleteUser = async (userid: number) => {
    try {
      await axios.delete(`http://localhost:5000/admin/deleteUser/${userid}`);
      fetchUsers();
      alert(`User with ID ${userid} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user', error);
      alert('Failed to delete user');
    }
  };

  const handleDeleteClass = async (cid: number) => {
    try {
      await axios.delete(`http://localhost:5000/admin/deleteClass/${cid}`);
      alert(`Class with ID ${cid} deleted successfully`);
      fetchClassesAndDepartments();
    } catch (error) {
      console.error('Error deleting class', error);
      alert('Failed to delete class');
    }
  };

  const handleDeleteDepartment = async (department_id: number) => {
    try {
      await axios.delete(`http://localhost:5000/admin/deleteDepartment/${department_id}`);
      alert(`Department with ID ${department_id} deleted successfully`);
      fetchClassesAndDepartments();
    } catch (error) {
      console.error('Error deleting department', error);
      alert('Failed to delete department');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Display Users */}
      <h2>Users List</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userid}>
              <td>{user.userid}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.userid)}>Delete User</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display Classes */}
      <h2>Classes List</h2>
      <table>
        <thead>
          <tr>
            <th>Class ID</th>
            <th>Class Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.cid}>
              <td>{cls.cid}</td>
              <td>{cls.classname}</td>
              <td>
                <button onClick={() => handleDeleteClass(cls.cid)}>Delete Class</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display Departments */}
      <h2>Departments List</h2>
      <table>
        <thead>
          <tr>
            <th>Department ID</th>
            <th>Department Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.department_id}>
              <td>{dept.department_id}</td>
              <td>{dept.name}</td>
              <td>
                <button onClick={() => handleDeleteDepartment(dept.department_id)}>Delete Department</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Button */}
      {!showAddUserForm && (
        <button onClick={() => setShowAddUserForm(true)}>Add User</button>
      )}

      {/* Conditionally show the form for adding users */}
      {showAddUserForm && (
        <div>
          <h2>Add New User</h2>
          <form onSubmit={handleAddUser}>
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <label>
              Role:
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            {/* Conditionally show additional fields if the role is not "admin" */}
            {role !== 'admin' && (
              <>
                <label>
                  Email:
                  <input type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
                </label>
                <label>
                  Phone Number:
                  <input type="text" value={details.phone_no} onChange={(e) => setDetails({ ...details, phone_no: e.target.value })} />
                </label>
                <label>
                  Department:
                  <select value={details.department_id} onChange={(e) => setDetails({ ...details, department_id: Number(e.target.value) })}>
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.department_id} value={dept.department_id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </label>

                {role === 'student' && (
                  <>
                    <label>
                      Roll No:
                      <input type="number" value={details.rollno} onChange={(e) => setDetails({ ...details, rollno: Number(e.target.value) })} />
                    </label>
                    <label>
                      Class:
                      <select value={details.cid} onChange={(e) => setDetails({ ...details, cid: Number(e.target.value) })}>
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.cid} value={cls.cid}>
                            {cls.classname}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Name:
                      <input type="text" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
                    </label>
                  </>
                )}

                {role === 'faculty' && (
                  <label>
                    Faculty ID:
                    <input type="number" value={details.fid || ''} onChange={(e) => setDetails({ ...details, fid: e.target.value ? Number(e.target.value) : undefined })} />
                  </label>
                )}
              </>
            )}

            <button type="submit">Add User</button>
          </form>
          <button onClick={() => setShowAddUserForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Admin;
