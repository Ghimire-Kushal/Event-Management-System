import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://127.0.0.1:8000/api/events/admin-stats/', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setStats(res.data))
        .catch(err => console.log("Not an admin or error"));
    }, []);

    if (!stats) return null;

    return (
        <div className="event-card" style={{ backgroundColor: '#f0f4f8', marginBottom: '30px' }}>
            <h2 style={{ color: '#003366' }}>System Report (Admin Only)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div className="stat-box"><b>Total Events:</b> {stats.total_events}</div>
                <div className="stat-box"><b>Internal Users:</b> {stats.internal_participants}</div>
                <div className="stat-box"><b>External Users:</b> {stats.external_participants}</div>
                <div className="stat-box"><b>Points Given:</b> {stats.total_points_distributed}</div>
            </div>
        </div>
    );
};

export default AdminStats;