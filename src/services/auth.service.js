import { callApi } from './base.service';

export const authService = {
    login,
    register,
    registerCorporate,
    logout,
    getCurrentUser,
    isAuthenticated,
    requestPasswordReset,
    verifyResetCode,
    resetPassword
};

async function login(email, password) {
    const response = await callApi('auth/login', {
        method: 'POST',
        data: JSON.stringify({ email, password })
    });

    // Backend login response yapısı: { success: true, token: "...", ... }
    if (response.success && response.token) {
        // Token'ı ve user bilgisini sakla
        localStorage.setItem('AuthStorage', JSON.stringify({ user: response }));
    }

    return response;
}

async function register(userData) {
    const response = await callApi('auth/register', {
        method: 'POST',
        data: JSON.stringify(userData)
    });

    return response;
}

// Kurumsal Kayıt Servis İsteği
async function registerCorporate(corporateData) {
    const response = await callApi('auth/register-corporate', {
        method: 'POST',
        data: JSON.stringify(corporateData)
    });

    return response;
}

function logout() {
    localStorage.removeItem('AuthStorage');
    window.location.href = '/';
}

function getCurrentUser() {
    const userData = localStorage.getItem('AuthStorage');
    return userData ? JSON.parse(userData).user : null;
}

function isAuthenticated() {
    const user = getCurrentUser();
    return user && user.token; // Token var mı kontrolü
}

// 1. Aşama: Kod İsteği
async function requestPasswordReset(email) {
    return await callApi('auth/reset-password-request', {
        method: 'POST',
        data: JSON.stringify({ email })
    });
}

// 2. Aşama: Kodu Doğrula (Token al)
async function verifyResetCode(email, code) {
    return await callApi('auth/verify-reset-code', {
        method: 'POST',
        data: JSON.stringify({ email, code })
    });
}

// 3. Aşama: Yeni Şifreyi Kaydet
async function resetPassword(resetToken, newPassword, newPasswordConfirm) {
    return await callApi('auth/reset-password', {
        method: 'POST',
        data: JSON.stringify({ resetToken, newPassword, newPasswordConfirm })
    });
}