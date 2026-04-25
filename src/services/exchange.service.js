import { callApi } from './base.service';

export const exchangeService = {

    // --- USER METODLARI ---
    sellPoints: async (pointsToSell) => {
        return await callApi('exchange/user/sell-points', {
            method: 'POST',
            data: JSON.stringify({ pointsToSell })
        });
    },
    getMySellRequests: async () => {
        return await callApi('exchange/user/my-sell-requests', { method: 'GET' });
    },

    // --- CORPORATE METODLARI ---
    buyCarbon: async (co2AmountToBuy) => {
        return await callApi('exchange/corporate/buy-carbon', {
            method: 'POST',
            data: JSON.stringify({ co2AmountToBuy })
        });
    },
    getMyPurchases: async () => {
        return await callApi('exchange/corporate/my-purchases', { method: 'GET' });
    },

    // --- ADMIN METODLARI ---
    getPendingRequests: async () => {
        return await callApi('exchange/admin/pending-requests', { method: 'GET' });
    },
    approveRequest: async (id) => {
        return await callApi(`exchange/admin/approve-request/${id}`, { method: 'POST' });
    },
    rejectRequest: async (id, reason, returnPointsToUser) => {
        return await callApi(`exchange/admin/reject-request/${id}`, {
            method: 'POST',
            data: JSON.stringify({ reason, returnPointsToUser })
        });
    },

    // --- PUBLIC ---
    getPoolInfo: async () => {
        return await callApi('exchange/pool-info', { method: 'GET' });
    },

};