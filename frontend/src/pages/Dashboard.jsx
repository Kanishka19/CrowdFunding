import React from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
    const { user, login, logout } = useAuth();
    console.log("Current user in Dashboard:", user);
    const navigate = useNavigate(); // Ensures navigation after login

    const handleLogin = () => {
        const mockUser = { name: 'John Doe', email: 'john@example.com' };
        login(mockUser); // Simulate login
    };

    const handleLogout = () => {
        logout(); // Simulate logout
    };

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.fullname}!</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                navigate("/login")
            )}
        </div>
    );
};

export default Dashboard;