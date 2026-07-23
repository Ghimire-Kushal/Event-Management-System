import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/users/login/', credentials);
            // Save the token so the user stays logged in
            localStorage.setItem('token', res.data.access);
            alert("Login Successful!");
            onLoginSuccess();
        } catch (err) {
            alert("Login failed. Check your credentials.");
        }
    };

    return (
        <form onSubmit={handleLogin} className="event-card" style={{ maxWidth: '400px', margin: '20px auto' }}>
            <h2 style={{ textAlign: 'center' }}>Login</h2>
            <input type="text" placeholder="Username" className="btn" style={{ backgroundColor: 'white', color: 'black', border: '1px solid #ccc' }}
                onChange={e => setCredentials({ ...credentials, username: e.target.value })} />
            <input type="password" placeholder="Password" className="btn" style={{ backgroundColor: 'white', color: 'black', border: '1px solid #ccc' }}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
            <button type="submit" className="btn">Login</button>
        </form>
    );
};

export default Login;