import { callApi, apiUrl } from './base.service';

export const platformService = {
    getAllPlatforms,
    createPlatform,
    updatePlatform,
    deletePlatform,
    getPlatformQrBase64,
    downloadPlatformQr,
    regeneratePlatformQr
};

async function getAllPlatforms(page = 0, size = 10, search = '', locationId = '', status = '') {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (search) params.append('search', search);
    if (locationId) params.append('locationId', locationId);
    if (status) params.append('status', status);

    return await callApi(`recycling-platforms/admin/list?${params.toString()}`, {
        method: 'GET'
    });
}

async function createPlatform(data) {
    return await callApi('recycling-platforms/create', {
        method: 'POST',
        data: JSON.stringify(data)
    });
}

async function updatePlatform(id, data) {
    return await callApi(`recycling-platforms/update/${id}`, {
        method: 'PUT',
        data: JSON.stringify(data)
    });
}

async function deletePlatform(id) {
    return await callApi(`recycling-platforms/delete/${id}`, {
        method: 'DELETE'
    });
}

async function getPlatformQrBase64(id) {
    return await callApi(`recycling-platforms/admin/get/${id}/qr-code/base64`, {
        method: 'GET'
    });
}

function downloadPlatformQr(id) {
    const url = apiUrl;
    
    // AuthStorage'dan token'ı al (base.service ile aynı mantık)
    let token = '';
    const storageData = localStorage.getItem('AuthStorage');
    if (storageData) {
        try {
            const userData = JSON.parse(storageData);
            token = userData?.user?.token || '';
        } catch(e) {
            console.error("Token error:", e);
        }
    }
    
    return fetch(`${url}/recycling-platforms/admin/get/${id}/qr-code`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('QR kod indirilemedi.');
        return response.blob();
    })
    .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `carbora-platform-${id}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
    });
}

async function regeneratePlatformQr(id) {
    return await callApi(`recycling-platforms/admin/regenerate-qr/${id}`, {
        method: 'POST'
    });
}