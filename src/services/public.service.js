import { callApi } from './base.service';

export const publicService = {
    getPublicStats
};

// GET /public/stats (Base URL: runConfig.apiUrl -> .../circulyapp)
async function getPublicStats() {
    return await callApi('public/stats', { method: 'GET' });
}

