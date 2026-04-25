import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Bileşenler
import Layout from '../components/Layout';
import AdminLayout from '../components/AdminLayout';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';
import CorporateRoute from './CorporateRoute';

// Sayfalar
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import CorporateDashboard from '../pages/CorporateDashboard';
import Profile from '../pages/Profile';
import Marketplace from '../pages/Marketplace';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminLocations from "../pages/admin/AdminLocations";
import AdminPlatforms from "../pages/admin/AdminPlatforms";
import AdminInstitutions from "../pages/admin/AdminInstitutions";
import ForgotPassword from '../pages/ForgotPassword';
import VerifyCode from '../pages/VerifyCode';
import AdminExchange from '../pages/admin/AdminExchange';
import AdminNotifications from '../pages/admin/AdminNotifications';
import AdminSuspiciousActivities from '../pages/admin/AdminSuspiciousActivities';
import AdminGamification from '../pages/admin/AdminGamification';
import AdminEducation from '../pages/admin/AdminEducation';
import AdminMessages from '../pages/admin/AdminMessages';

const MainRoutes = () => {
    return (
        <Routes>
            {/* 1. GUEST SAYFALARI */}
            <Route element={<GuestRoute />}>
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-code" element={<VerifyCode />} />
            </Route>

            {/* 2. HEADER/FOOTER İÇEREN SAYFALAR */}
            <Route element={<Layout />}>
                {/* Herkese Açık */}
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/impact" element={<Navigate to="/" replace />} />

                {/* Bireysel Kullanıcı Sayfaları (Sadece ROLE_USER veya kısıtlanmamış girişler) */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Kurumsal Kullanıcı Sayfaları */}
                <Route element={<CorporateRoute />}>
                    <Route path="/corporate/dashboard" element={<CorporateDashboard />} />
                </Route>
            </Route>

            {/* 3. ADMIN ARAYÜZÜ */}
            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="locations" element={<AdminLocations />} />
                    <Route path="platforms" element={<AdminPlatforms />} />
                    <Route path="institutions" element={<AdminInstitutions />} />
                    <Route path="exchange" element={<AdminExchange />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="fraud" element={<AdminSuspiciousActivities />} />
                    <Route path="gamification" element={<AdminGamification />} />
                    <Route path="education" element={<AdminEducation />} />
                    <Route path="messages" element={<AdminMessages />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default MainRoutes;