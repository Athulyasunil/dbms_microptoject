import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!username || !password) {
            setError('Both username and password are required.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setError(null);
                console.log('Logged in user:', data.user);

                // Route to student or faculty based on the user role
                if (data.user.role === 'student') {
                    // Navigate to the student page using rollno
                    navigate(`/student/${data.user.rollno}`);
                } else if (data.user.role === 'faculty') {
                    // Navigate to the faculty page using fid
                    navigate(`/faculty/${data.user.fid}/classes`);
                }
                else if (data.user.role === 'admin') {
                    // Navigate to the admin page
                    navigate(`/admin`);
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('An error occurred while trying to login.');
        }
    };

    return (
        <section className='login-page'>
            <div className="login-container">
                <h1>Login</h1>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group-login">
                        <input
                            type="text"
                            id="username"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='button-border'>
                        <button className='login-btn' type="submit">Login</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;
