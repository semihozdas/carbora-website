// src/routes/CorporateRoute.js (veya uygun klasör)
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CorporateRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    // Giriş yapmamışsa login'e at
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    // Giriş yapmış ama rolü CORPORATE DEĞİLSE, onu ana sayfaya veya kendi dashboarduna postala
    if (user?.role !== 'ROLE_CORPORATE') {
        return <Navigate to="/dashboard" replace />;
    }

    // Sorun yoksa sayfayı göster
    return <Outlet />;
};

export default CorporateRoute;