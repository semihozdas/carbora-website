import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GuestRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();

    // Context'ten kullanıcı bilgisi gelene kadar bekleme ekranı
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    // Kullanıcı GİRİŞ YAPMIŞSA (isAuthenticated === true), rolüne göre ilgili Dashboard'a yönlendir
    if (isAuthenticated) {
        if (user?.role === 'ROLE_CORPORATE') {
            return <Navigate to="/corporate/dashboard" replace />;
        } else if (user?.role === 'ROLE_ADMIN') {
            return <Navigate to="/admin" replace />;
        } else {
            return <Navigate to="/dashboard" replace />; // Bireysel Kullanıcı (ROLE_USER)
        }
    }

    // Kullanıcı MİSAFİRSE, sayfayı (Auth vb.) göster
    return <Outlet />;
};

export default GuestRoute;