import React, { useState, useEffect, useCallback } from 'react';
import { gamificationService } from '../../services/gamification.service';
import { apiUrl } from '../../services/base.service';
import { 
    BookOpen, 
    Plus, 
    Edit2, 
    Trash2, 
    Eye, 
    EyeOff, 
    RefreshCcw, 
    X,
    Play,
    FileText,
    Award,
    AlertCircle,
    Layout
} from 'lucide-react';

// Inline education API
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

const educationApi = {
  list: () => _call('/educations/admin/list'),
  save: (ed) =>
    ed.id
      ? _call(`/educations/admin/${ed.id}`, { method: 'PUT', body: JSON.stringify(ed) })
      : _call('/educations/admin', { method: 'POST', body: JSON.stringify(ed) }),
  delete: (id) => _call(`/educations/admin/${id}`, { method: 'DELETE' }),
  toggleStatus: (id, status) =>
    _call(`/educations/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

const EMPTY = {
  title: '',
  type: 'VIDEO',
  contentUrl: '',
  photoUrl: '',
  rewardPoints: 20,
  status: 'ACTIVE',
};

export default function AdminEducation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await educationApi.list();
      setItems(res?.data ?? []);
    } catch (e) {
      setError(e?.message || 'Eğitimler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(EMPTY); setShowModal(true); };
  const openEdit = (ed) => { setForm({ ...ed }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title?.trim() || !form.contentUrl?.trim()) {
      return;
    }
    setSaving(true);
    try {
      await educationApi.save(form);
      setShowModal(false);
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await educationApi.delete(id);
      setDeleteId(null);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (ed) => {
    const next = ed.status === 'ACTIVE' ? 'PASSIVE' : 'ACTIVE';
    try {
      await educationApi.toggleStatus(ed.id, next);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eğitim Yönetimi</h1>
          <p className="text-sm text-slate-500 mt-1">Sistemdeki eğitim içeriklerini ve dökümanları yönetin.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
        >
          <Plus size={18} />
          <span>Yeni Eğitim Ekle</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-medium flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layout size={20} className="text-blue-600" />
                Eğitim İçerikleri Listesi
            </h2>
            <button onClick={load} className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
                <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
        </div>

        {loading ? (
            <div className="p-20 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Yükleniyor...</p>
                </div>
            </div>
        ) : items.length === 0 ? (
            <div className="p-20 text-center">
                <div className="flex flex-col items-center gap-4 text-slate-300">
                    <BookOpen size={64} strokeWidth={1} />
                    <p className="text-slate-500 font-medium">Henüz eğitim içeriği bulunmuyor.</p>
                </div>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-8 py-4">İçerik Bilgisi</th>
                            <th className="px-8 py-4">Tür</th>
                            <th className="px-8 py-4">Puan Ödülü</th>
                            <th className="px-8 py-4">Durum</th>
                            <th className="px-8 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((ed) => (
                            <tr key={ed.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm flex-shrink-0">
                                            {ed.photoUrl ? (
                                                <img src={ed.photoUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <BookOpen size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-slate-900 truncate">{ed.title}</span>
                                            <span className="text-xs text-slate-400 truncate max-w-[200px]">{ed.contentUrl}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        {ed.type === 'VIDEO' ? (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                                                <Play size={12} fill="currentColor" /> VIDEO
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                                                <FileText size={12} /> PDF
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100">
                                        <Award size={14} />
                                        +{ed.rewardPoints} Puan
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${ed.status === 'ACTIVE' ? 'text-green-600' : 'text-slate-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${ed.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                        {ed.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                                    </div>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button 
                                            onClick={() => handleToggle(ed)}
                                            title={ed.status === 'ACTIVE' ? 'Durdur' : 'Yayınla'}
                                            className={`p-2 rounded-lg transition-all ${ed.status === 'ACTIVE' ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                                        >
                                            {ed.status === 'ACTIVE' ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        <button 
                                            onClick={() => openEdit(ed)}
                                            title="Düzenle"
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setDeleteId(ed.id)}
                                            title="Sil"
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {form.id ? 'Eğitimi Düzenle' : 'Yeni Eğitim İçeriği'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-all p-2 rounded-xl hover:bg-slate-50">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">İçerik Başlığı</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Eğitim başlığını girin"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">İçerik Türü</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all cursor-pointer"
                  >
                    <option value="VIDEO">🎬 Video İçeriği</option>
                    <option value="PDF">📄 PDF Dökümanı</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ödül Puanı</label>
                  <input
                    type="number"
                    value={form.rewardPoints}
                    onChange={(e) => setForm(f => ({ ...f, rewardPoints: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">İçerik Kaynağı (URL)</label>
                <input
                  value={form.contentUrl}
                  onChange={(e) => setForm(f => ({ ...f, contentUrl: e.target.value }))}
                  placeholder="https://youtube.com/... veya PDF linki"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kapak Görseli URL</label>
                <input
                  value={form.photoUrl || ''}
                  onChange={(e) => setForm(f => ({ ...f, photoUrl: e.target.value }))}
                  placeholder="https://... (opsiyonel)"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Yayın Durumu</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all cursor-pointer"
                >
                  <option value="ACTIVE">Aktif (Kullanıcılar görebilir)</option>
                  <option value="PASSIVE">Pasif (Gizli tutulur)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 px-8 py-6 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all text-sm disabled:opacity-60 shadow-lg shadow-blue-100"
              >
                {saving ? <RefreshCcw size={18} className="animate-spin mx-auto" /> : 'İçeriği Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
          <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-5">
                <Trash2 size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Eğitimi Sil</h3>
            <p className="text-slate-500 text-sm mt-2">Bu eğitim içeriği kalıcı olarak silinecek. Bu işlemi onaylıyor musunuz?</p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all text-sm shadow-lg shadow-red-100"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

