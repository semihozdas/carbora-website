import { callApi } from './base.service';

export const corporateService = {
    getDashboardStats
};

async function getDashboardStats() {
    return await callApi('corporate/dashboard/stats', { method: 'GET' });
}