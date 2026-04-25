import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();
    
    // Authenticated pages that should use the clean light UI
    const isLightMode = location.pathname.startsWith('/dashboard') || 
                       location.pathname.startsWith('/profile') ||
                       location.pathname.startsWith('/settings');

    const layoutClass = isLightMode ? 'light-layout' : 'hud-layout';

    return (
        <div className={`flex flex-col min-h-screen ${layoutClass}`}>
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;