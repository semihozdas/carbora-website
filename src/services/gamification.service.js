import { apiUrl } from './base.service';

// base.service callApi'si auth/* path'lerinde token eklemiyor;
// gamification admin endpoint'leri her zaman auth gerektirdiğinden kendi helper'ını kullanır.
async function _call(endpoint, options = {}) {
  const storageData = localStorage.getItem('AuthStorage');
  const token = storageData ? JSON.parse(storageData)?.user?.token : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${apiUrl}${endpoint}`, { ...options, headers });

  if (response.status === 204) return null;

  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

  if (!response.ok) throw data;
  return { data };
}

export const gamificationService = {
  // ── Quests ──────────────────────────────────────────────────────────────────
  getQuests: () => _call('/auth/gamification/admin/quests'),
  saveQuest: (quest) =>
    quest.id
      ? _call(`/auth/gamification/admin/quests/${quest.id}`, { method: 'PUT', body: JSON.stringify(quest) })
      : _call('/auth/gamification/admin/quests', { method: 'POST', body: JSON.stringify(quest) }),
  deleteQuest: (id) => _call(`/auth/gamification/admin/quests/${id}`, { method: 'DELETE' }),

  // ── Badges ──────────────────────────────────────────────────────────────────
  getBadges: () => _call('/auth/gamification/admin/badges'),
  saveBadge: (badge) =>
    badge.id
      ? _call(`/auth/gamification/admin/badges/${badge.id}`, { method: 'PUT', body: JSON.stringify(badge) })
      : _call('/auth/gamification/admin/badges', { method: 'POST', body: JSON.stringify(badge) }),
  deleteBadge: (id) => _call(`/auth/gamification/admin/badges/${id}`, { method: 'DELETE' }),

  // ── Rewards ─────────────────────────────────────────────────────────────────
  getRewards: () => _call('/auth/gamification/admin/rewards'),
  saveReward: (reward) =>
    reward.id
      ? _call(`/auth/gamification/admin/rewards/${reward.id}`, { method: 'PUT', body: JSON.stringify(reward) })
      : _call('/auth/gamification/admin/rewards', { method: 'POST', body: JSON.stringify(reward) }),
  deleteReward: (id) => _call(`/auth/gamification/admin/rewards/${id}`, { method: 'DELETE' }),

  // ── User Gamification ────────────────────────────────────────────────────────
  getUserProfile: (userId) => _call(`/auth/gamification/admin/users/${userId}/profile`),
  adjustPoints: (userId, delta, reason) =>
    _call(`/auth/gamification/admin/users/${userId}/points`, {
      method: 'PUT',
      body: JSON.stringify({ delta, reason }),
    }),
};
