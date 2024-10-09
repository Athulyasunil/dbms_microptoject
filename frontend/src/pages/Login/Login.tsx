import './Login.css'
import React, { useState } from 'react';

const Login: React.FC = () => {
    // State to store username, password, and errors
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Clear previous errors

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
                // Login success
                setSuccess(data.message);
                setError(null);
                console.log('Logged in user:', data.user); // You can redirect or do other actions after a successful login
            } else {
                // Login failed
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
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </section>
    );
};

export default Login;
