import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const userData = await authService.login(email, password);
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        const newUser = await authService.register(userData);
        // Not: Genelde kayıt sonrası backend token dönmezse (sadece mesaj dönerse)
        // setUser(newUser) yapmak yerine sadece response dönülür.
        // Ancak mevcut yapınızı bozmamak adına aynen bıraktım.
        setUser(newUser);
        return newUser;
    };

    // --- Kurumsal Kayıt Fonksiyonu ---
    const registerCorporate = async (corporateData) => {
        const response = await authService.registerCorporate(corporateData);
        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        registerCorporate,
        logout,
        isAuthenticated: authService.isAuthenticated()
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};