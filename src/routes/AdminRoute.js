import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-background-dark flex items-center justify-center text-primary">{t('admin.common.loading')}</div>;
    }

    // Giriş yapmış mı VE rolü Admin mi?
    if (isAuthenticated && user?.role === 'ROLE_ADMIN') {
        return <Outlet />;
    }

    // Değilse Dashboard'a geri gönder (yetkisiz giriş denemesi)
    return <Navigate to="/" replace />;
};

export default AdminRoute;