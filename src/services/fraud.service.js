import { callApi } from './base.service';

export const fraudService = {
    getStats: () => callApi('admin/fraud/stats'),
    getActivities: (page, size, filters) => {
        const params = new URLSearchParams({ page, size });
        if (filters.reviewed !== undefined && filters.reviewed !== null) params.append('reviewed', filters.reviewed);
        if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
        if (filters.category) params.append('category', filters.category);
        return callApi(`admin/fraud/activities?${params.toString()}`);
    },
    getActivityDetail: (id) => callApi(`admin/fraud/activities/${id}`),
    reviewActivity: (id, action, note) => callApi(`admin/fraud/activities/${id}/review`, {
        method: 'POST',
        data: JSON.stringify({ action, note })
    }),
    bulkReviewActivities: (activityIds, action, note) => callApi('admin/fraud/activities/bulk-review', {
        method: 'POST',
        data: JSON.stringify({ activityIds, action, note })
    }),
    getHighRiskUsers: (minRiskScore, limit) => callApi(`admin/fraud/users/high-risk?minRiskScore=${minRiskScore}&limit=${limit}`),
    getUserRiskProfile: (userId) => callApi(`admin/fraud/users/${userId}/risk-profile`),
    takeUserAction: (userId, action, reason) => callApi(`admin/fraud/users/${userId}/action`, {
        method: 'POST',
        data: JSON.stringify({ action, reason })
    })
};
