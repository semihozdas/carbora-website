import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Context'ten kullanıcı bilgisi gelene kadar bekleme ekranı (Opsiyonel ama önerilir)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    // Kullanıcı giriş yapmışsa sayfayı göster (Outlet), yapmamışsa Login'e at
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;


// Üstteki Private Route ' u tasarım aşamasındayken kapattım. daha sonra o kullanılacak.

/*
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    // const { isAuthenticated, loading } = useAuth(); // <--- Bu satırı yoruma al

    // GEÇİCİ OLARAK HERKESE İZİN VER
    const isAuthenticated = true;
    const loading = false;

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;

 */