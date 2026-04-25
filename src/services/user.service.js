import { callApi, apiUrl } from './base.service';

export const userService = {
    getUserProfile,
    uploadProfilePhoto,
    updateMyName,
    updatePassword,
    changePassword,
    deleteMyAccount,
    getDashboardStats,
    getLastWastes,
    getAllUsers,
    adminUpdateUser,
    adminChangeStatus,
    adminDeleteUser,
    adminCreateUser,
    getAdminDashboardStats,
    checkSystemStatus,
    getLastUsers
};

// Profil bilgilerini getir
async function getUserProfile() {
    return await callApi('users/me', { method: 'GET' });
}

// Son atıkları getir (Backend'deki WasteController)
async function getLastWastes(limit = 5) {
    return await callApi(`waste/last-wastes?limit=${limit}`, { method: 'GET' });
}

async function updateMyName(name, surname) {
    return await callApi('users/me/name', {
        method: 'PATCH',
        data: JSON.stringify({ name, surname })
    });
}

async function changePassword(passwordData) {
    return await callApi('users/me/password', {
        method: 'PUT',
        data: JSON.stringify(passwordData)
    });
}

async function updatePassword(passwordData) {
    const mapped = {
        oldPassword: passwordData?.currentPassword,
        newPassword: passwordData?.newPassword,
        newPasswordConfirm: passwordData?.newPasswordConfirm
    };
    return await changePassword(mapped);
}

async function uploadProfilePhoto(file) {
    // 1. FormData oluştur
    const formData = new FormData();
    formData.append('file', file);

    // 2. Token'ı Doğru Anahtarla (AuthStorage) Al
    let token = '';
    const storageData = localStorage.getItem('AuthStorage');

    if (storageData) {
        try {
            const userData = JSON.parse(storageData);
            // Senin base.service yapına göre token bu dizinde duruyor
            token = userData?.user?.token || '';
        } catch(e) {
            console.error("Token okunurken hata oluştu:", e);
        }
    }

    // Token yoksa baştan hata ver (Boş yere backend'i yorma)
    if (!token) {
        throw new Error('Oturum süresi dolmuş veya token bulunamadı. Lütfen tekrar giriş yapın.');
    }

    const url = `${apiUrl}/users/me/profile-photo`;

    // 4. fetch ile gönder
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
            // Content-Type yazmıyoruz, browser hallediyor.
        },
        credentials: 'include', // Cookie desteği
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Fotoğraf yüklenemedi. Yetki reddedildi.');
    }

    return await response.json();
}

// Kullanıcı hesabını silme (Backend: DELETE /users/me -> 204 No Content)
async function deleteMyAccount() {
    return await callApi('users/me', { method: 'DELETE' });
}

/**
 * DASHBOARD VERİ BİRLEŞTİRİCİ
 */
async function getDashboardStats() {
    try {
        // 3 İsteği Paralel Atıyoruz: Profil, Sıralama, Son Atıklar
        const [profileResponse, leaderboardResponse, wastesResponse] = await Promise.all([
            callApi('users/me', { method: 'GET' }),
            callApi('users/leaderboard?limit=1', { method: 'GET' }),
            callApi('waste/last-wastes?limit=5', { method: 'GET' })
        ]);

        // Karbon Hesaplama (Şimdilik puan üzerinden simülasyon)
        const calculatedCarbon = (profileResponse.userPoint / 100).toFixed(2);

        // Backend'den gelen atık listesini Dashboard formatına çevirme
        const formattedActivities = wastesResponse.map(waste => ({
            id: waste.id,
            date: formatDate(waste.createdAt),
            type: mapWasteTypeToIcon(waste.wasteType),
            label: mapWasteTypeToLabel(waste.wasteType),
            // Backend status dönüyorsa onu al, yoksa 'Onaylandı' yaz
            status: waste.status || 'Onaylandı',
            points: waste.points !== undefined ? waste.points : 0
        }));

        return {
            name: profileResponse.name,
            currentPoints: profileResponse.userPoint,
            carbonReduction: calculatedCarbon,
            globalRank: leaderboardResponse.meRank,
            activities: formattedActivities
        };

    } catch (error) {
        console.error("Dashboard verileri alınamadı", error);
        throw error;
    }
}

// --- Yardımcı Fonksiyonlar ---

// Backend Enum Tiplerini Frontend Icon isimlerine çevirir
function mapWasteTypeToIcon(backendType) {
    const type = backendType ? backendType.toUpperCase() : '';

    if (type.includes('PLASTIC')) return 'plastic';
    if (type.includes('PAPER') || type.includes('CARDBOARD')) return 'cardboard';
    if (type.includes('GLASS')) return 'glass';
    if (type.includes('ELECTRONIC') || type.includes('BATTERY')) return 'electronic';
    if (type.includes('METAL')) return 'metal';

    return 'default'; // Varsayılan ikon
}

// Backend Tiplerini Ekranda görünecek isme çevirir
function mapWasteTypeToLabel(backendType) {
    const type = backendType ? backendType.toUpperCase() : '';

    const labels = {
        'PLASTIC': 'Plastik Atık',
        'PAPER': 'Kağıt/Karton',
        'CARDBOARD': 'Karton',
        'GLASS': 'Cam Şişe',
        'ELECTRONIC': 'E-Atık',
        'BATTERY': 'Pil',
        'METAL': 'Metal',
        'OIL': 'Bitkisel Yağ'
    };
    return labels[type] || 'Geri Dönüşüm';
}

// Tarih Formatlayıcı (Örn: "Bugün, 14:30" veya "06.02.2026")
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();

    const isToday = date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (isToday) {
        return `Bugün, ${hours}:${minutes}`;
    } else {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }
}

async function getAllUsers(page = 0, size = 10, search = '', role = '', status = '') {
    // Query parametrelerini oluştur
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (status) params.append('status', status);

    return await callApi(`users/admin/all?${params.toString()}`, {
        method: 'GET'
    });
}

// ADMIN: Kullanıcı Güncelleme (İsim, Soyisim, Rol vb.)
// NOT: Backend'de henüz "/users/{id}" PUT endpointi yok.
// Şimdilik sadece yapıyı kuruyoruz. Backend hazır olunca burası çalışacak.
async function adminUpdateUser(userId, userData) {
    return await callApi(`users/${userId}`, { // Backend'de bu endpoint açılmalı
        method: 'PUT',
        data: JSON.stringify(userData)
    });
}

// ADMIN: Kullanıcı Durum Değiştirme (Aktif/Pasif)
async function adminChangeStatus(userId, status) {
    // Backend'deki endpointlere göre yönlendirme
    const endpoint = status === 'ACTIVE'
        ? `users/${userId}/activate`
        : `users/${userId}/deactivate`;

    return await callApi(endpoint, {
        method: 'PATCH'
    });
}

// ADMIN: Kullanıcı Silme (Aslında Pasife Alma)
async function adminDeleteUser(userId) {
    // "Sil" butonu tıklandığında backend'deki deactivate servisini çağırır
    return await adminChangeStatus(userId, 'PASSIVE');
}

// ADMIN: Yeni Kullanıcı Oluştur
async function adminCreateUser(userData) {
    return await callApi('users/admin/create', {
        method: 'POST',
        data: JSON.stringify(userData)
    });
}

// ADMIN: Dashboard İstatistiklerini Getir
async function getAdminDashboardStats() {
    return await callApi('users/admin/stats', {
        method: 'GET'
    });
}

// SİSTEM DURUMU KONTROLÜ
async function checkSystemStatus() {
    try {
        // Base service kullanmadan direkt fetch de atabiliriz,
        // ama base service timeout yönetimi vb. için iyidir.
        await callApi('system/health', { method: 'GET' });
        return true; // Hata vermezse sistem ayaktadır
    } catch (error) {
        return false; // Hata verirse sistem kapalıdır veya erişilemiyordur
    }
}

// Son Eklenen 5 Kullanıcıyı Getir
async function getLastUsers() {
    // Sayfa 0, Boyut 5, ID'ye göre tersten sıralı (Backend zaten default böyle dönüyordu)
    const response = await callApi('users/admin/all?page=0&size=5', {
        method: 'GET'
    });
    return response.content; // Sadece listeyi dön
}