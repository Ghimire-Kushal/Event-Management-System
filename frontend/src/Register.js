import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [step, setStep] = useState(1); // 1: Register, 2: OTP
    const [otp, setOtp] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Updated to capture the response
            const response = await axios.post('http://127.0.0.1:8000/api/users/register/', formData);
            
            // This will now show the message from Django which includes the OTP
            alert(response.data.message); 
            setStep(2);
        } catch (err) { 
            // FIXED: This will now tell you EXACTLY why it failed (e.g., username taken)
            const errorDetail = err.response ? JSON.stringify(err.response.data) : "Server not reachable";
            alert("Registration failed: " + errorDetail);
            console.error(err.response?.data);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/users/verify-otp/', { 
                email: formData.email, 
                otp: otp 
            });
            alert("Verified! You can now browse events.");
            // Instead of reload, just go back to step 1 or clear the form
            setStep(1);
            setFormData({ username: '', email: '', password: '' });
        } catch (err) { 
            alert("Invalid OTP code. Please check again."); 
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto' }}>
            {step === 1 ? (
                <form onSubmit={handleRegister} className="event-card">
                    <h2 style={{ textAlign: 'center' }}>Create Account</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="btn" 
                            style={{ backgroundColor: 'white', color: 'black', border: '1px solid #ccc', textAlign: 'left' }} 
                            required
                            onChange={e => setFormData({ ...formData, username: e.target.value })} 
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            type="email" 
                            placeholder="Email (use @apollo.edu for internal)" 
                            className="btn" 
                            style={{ backgroundColor: 'white', color: 'black', border: '1px solid #ccc', textAlign: 'left' }} 
                            required
                            onChange={e => setFormData({ ...formData, email: e.target.value })} 
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="btn" 
                            style={{ backgroundColor: 'white', color: 'black', border: '1px solid #ccc', textAlign: 'left' }} 
                            required
                            onChange={e => setFormData({ ...formData, password: e.target.value })} 
                        />
                    </div>
                    <button type="submit" className="btn">Register & Get OTP</button>
                </form>
            ) : (
                <form onSubmit={handleVerify} className="event-card">
                    <h2 style={{ textAlign: 'center' }}>Verify OTP</h2>
                    <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                        Check your alert box for the code sent to <b>{formData.email}</b>
                    </p>
                    <input 
                        type="text" 
                        placeholder="Enter 6-digit OTP" 
                        className="btn" 
                        style={{ backgroundColor: 'white', color: 'black', border: '1px solid #ccc', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '5px' }} 
                        maxLength="6"
                        required
                        onChange={e => setOtp(e.target.value)} 
                    />
                    <button type="submit" className="btn" style={{ marginTop: '15px' }}>Verify Account</button>
                    <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#003366', cursor: 'pointer', display: 'block', margin: '10px auto' }}>
                        Back to Register
                    </button>
                </form>
            )}
        </div>
    );
};

export default Register;