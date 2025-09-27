import React from 'react';
import { useAuth } from '../context/AuthContext'; 
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />; // Redirect to login if not authenticated
    }

    return children; // Render the protected component
};

export default ProtectedRoute;