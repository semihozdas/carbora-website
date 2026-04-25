import { callApi } from './base.service';

const NotificationService = {
  // FCM Token kaydet
  registerDevice: (fcmToken, platform = 'ANDROID') => {
    return callApi('notifications/device', {
      method: 'POST',
      data: JSON.stringify({ token: fcmToken, platform })
    });
  },

  // Token sil (logout)
  unregisterDevice: (fcmToken) => {
    return callApi('notifications/device', {
      method: 'DELETE',
      data: JSON.stringify({ token: fcmToken })
    });
  },

  // Bildirimlerimi getir
  getMyNotifications: (page = 0, size = 20) => {
    return callApi(`notifications/my?page=${page}&size=${size}`, {
      method: 'GET'
    });
  },

  // Okunmamış sayısı
  getUnreadCount: () => {
    return callApi('notifications/unread-count', {
      method: 'GET'
    });
  },

  // Okundu işaretle
  markAsRead: (id) => {
    return callApi(`notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  // Tümünü okundu işaretle
  markAllAsRead: () => {
    return callApi('notifications/mark-all-read', {
      method: 'PUT'
    });
  },

  // --- ADMIN ENDPOINTS ---

  // Tek kullanıcıya gönder
  sendToUser: (userId, title, body, data) => {
    return callApi(`admin/notifications/send/${userId}`, {
      method: 'POST',
      data: JSON.stringify({ title, body, data })
    });
  },

  // Tüm kullanıcılara gönder
  sendToAll: (title, body, data) => {
    return callApi('admin/notifications/send-all', {
      method: 'POST',
      data: JSON.stringify({ title, body, data })
    });
  },

  // Toplu kullanıcılara gönder
  sendBulk: (userIds, title, body, data) => {
    return callApi('admin/notifications/send-bulk', {
      method: 'POST',
      data: JSON.stringify({ userIds, title, body, data })
    });
  },

  // Tüm bildirim geçmişini getir (Admin)
  getAllNotifications: (page = 0, size = 10) => {
    return callApi(`admin/notifications?page=${page}&size=${size}`, {
      method: 'GET'
    });
  }
};

export default NotificationService;
