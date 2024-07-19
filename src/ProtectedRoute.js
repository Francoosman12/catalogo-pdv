// src/ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    return (
        <Route
            {...rest}
            element={isAuthenticated ? element : <Navigate to="/" />}
        />
    );
};

export default ProtectedRoute;
