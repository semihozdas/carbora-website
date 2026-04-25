import { callApi } from './base.service';

export const institutionService = {
    getAllInstitutions,
    getAllActiveInstitutions, // Dropdownlar için
    createInstitution,
    updateInstitution,
    deleteInstitution,
    getInstitutionHierarchy
};

// Admin: Filtreli ve Sayfalı Liste
async function getAllInstitutions(page = 0, size = 10, search = '', type = '', status = '') {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    if (status) params.append('status', status);

    return await callApi(`institutions/admin/list?${params.toString()}`, {
        method: 'GET'
    });
}

// Genel: Sadece Aktif Kurumlar (Dropdown için)
async function getAllActiveInstitutions() {
    return await callApi('institutions/active', {
        method: 'GET'
    });
}

// Yeni Kurum Ekle
async function createInstitution(data) {
    return await callApi('institutions/create', {
        method: 'POST',
        data: JSON.stringify(data)
    });
}

// Kurum Güncelle
async function updateInstitution(id, data) {
    return await callApi(`institutions/update/${id}`, {
        method: 'PUT',
        data: JSON.stringify(data)
    });
}

// Kurum Sil (Soft Delete)
async function deleteInstitution(id) {
    return await callApi(`institutions/delete/${id}`, {
        method: 'DELETE'
    });
}

// Kurum Hiyerarşisini Getir (Lokasyonlar ve Platformlar)
async function getInstitutionHierarchy(id) {
    return await callApi(`institutions/admin/${id}/hierarchy`, {
        method: 'GET'
    });
}