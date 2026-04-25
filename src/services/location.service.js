import { callApi } from './base.service';

export const locationService = {
    getAllLocations,
    createLocation,
    updateLocation,
    deleteLocation
};

// Lokasyonları Listele (Filtreli)
async function getAllLocations(page = 0, size = 10, search = '', type = '', status = '') {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    if (status) params.append('status', status);

    return await callApi(`locations/admin/list?${params.toString()}`, {
        method: 'GET'
    });
}

// Yeni Lokasyon Ekle
async function createLocation(data) {
    return await callApi('locations/create', {
        method: 'POST',
        data: JSON.stringify(data)
    });
}

// Lokasyon Güncelle
async function updateLocation(id, data) {
    return await callApi(`locations/update/${id}`, {
        method: 'PUT',
        data: JSON.stringify(data)
    });
}

// Lokasyon Sil (Soft Delete)
async function deleteLocation(id) {
    return await callApi(`locations/delete/${id}`, {
        method: 'DELETE'
    });
}