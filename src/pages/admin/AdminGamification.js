import React, { useState, useEffect } from 'react';
import { gamificationService } from '../../services/gamification.service';
import { 
    Target, 
    Award, 
    Gift, 
    Search, 
    Plus, 
    Trash2, 
    Edit2, 
    ShieldCheck, 
    Flame, 
    Zap, 
    TreePine,
    RefreshCcw,
    User,
    CheckCircle2,
    XCircle,
    ChevronRight,
    TrendingUp,
    Droplets,
    Layout
} from 'lucide-react';

const TABS = [
    { label: 'Görevler', icon: Target },
    { label: 'Rozetler', icon: Award },
    { label: 'Ödül Marketi', icon: Gift },
    { label: 'Kullanıcı Takibi', icon: Search }
];

const API = {
  quests: {
    list: () => gamificationService.getQuests(),
    save: (d) => gamificationService.saveQuest(d),
    del: (id) => gamificationService.deleteQuest(id),
  },
  badges: {
    list: () => gamificationService.getBadges(),
    save: (d) => gamificationService.saveBadge(d),
    del: (id) => gamificationService.deleteBadge(id),
  },
  rewards: {
    list: () => gamificationService.getRewards(),
    save: (d) => gamificationService.saveReward(d),
    del: (id) => gamificationService.deleteReward(id),
  },
  userProfile: (id) => gamificationService.getUserProfile(id),
  adjustPoints: (id, delta, reason) => gamificationService.adjustPoints(id, delta, reason),
};

// ── Quest Tab ──────────────────────────────────────────────────────────────
const QUEST_DEFAULTS = { title: '', description: '', questType: 'DAILY', wasteType: 'ANY', targetUnit: 'COUNT', targetAmount: 3, rewardPoints: 30, iconKey: 'recycling', active: true };

function QuestsTab() {
  const [quests, setQuests] = useState([]);
  const [form, setForm] = useState(QUEST_DEFAULTS);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const load = () => API.quests.list()
    .then(r => setQuests(r.data))
    .catch(err => setMsg({ text: `Yüklenemedi: ${err?.message || 'Hata oluştu'}`, type: 'error' }));

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try { 
        await API.quests.save(form); 
        setForm(QUEST_DEFAULTS); 
        setEditing(false); 
        setMsg({ text: 'Görev başarıyla kaydedildi.', type: 'success' }); 
        load(); 
    } catch (err) { 
        setMsg({ text: `Hata: ${err?.message || 'Kaydedilemedi'}`, type: 'error' }); 
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {msg.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
          {msg.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
            <form onSubmit={submit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 sticky top-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Plus size={20} />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">{editing ? 'Görevi Düzenle' : 'Yeni Görev'}</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Görev Başlığı</label>
                        <input className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-4 py-3 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="Örn: 5 Plastik Şişe Geri Dönüştür" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tür</label>
                            <select className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-4 py-3 text-sm outline-none cursor-pointer" value={form.questType} onChange={e => setForm(p => ({ ...p, questType: e.target.value }))}>
                                <option value="DAILY">Günlük</option>
                                <option value="WEEKLY">Haftalık</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atık Türü</label>
                            <select className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-4 py-3 text-sm outline-none cursor-pointer" value={form.wasteType} onChange={e => setForm(p => ({ ...p, wasteType: e.target.value }))}>
                                {['ANY','PLASTIC','GLASS','PAPER','METAL','BATTERY'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hedef Birim</label>
                            <select className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-4 py-3 text-sm outline-none cursor-pointer" value={form.targetUnit} onChange={e => setForm(p => ({ ...p, targetUnit: e.target.value }))}>
                                <option value="COUNT">Adet</option>
                                <option value="GRAM">Gram</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Miktar</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-4 py-3 text-sm outline-none" value={form.targetAmount} onChange={e => setForm(p => ({ ...p, targetAmount: +e.target.value }))} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ödül Puanı</label>
                        <div className="relative">
                            <Zap size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                            <input type="number" className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none" value={form.rewardPoints} onChange={e => setForm(p => ({ ...p, rewardPoints: +e.target.value }))} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">Kaydet</button>
                    {editing && <button type="button" className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-2xl text-sm font-bold hover:bg-slate-50" onClick={() => { setForm(QUEST_DEFAULTS); setEditing(false); }}>İptal</button>}
                </div>
            </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-slate-900 font-bold flex items-center gap-2">
                        <Target size={20} className="text-blue-600" />
                        Aktif Görevler
                    </h3>
                    <button onClick={load} className="text-slate-400 hover:text-blue-600 p-2 rounded-xl transition-all">
                        <RefreshCcw size={18} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-8 py-4">Görev</th>
                                <th className="px-8 py-4">Tür/Hedef</th>
                                <th className="px-8 py-4 text-center">Ödül</th>
                                <th className="px-8 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {quests.map(q => (
                                <tr key={q.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{q.title}</span>
                                            <span className="text-xs text-slate-400">{q.wasteType} atığı için geçerli</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${q.questType === 'DAILY' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>{q.questType}</span>
                                            <span className="text-xs text-slate-600 font-medium">{q.targetAmount} {q.targetUnit === 'GRAM' ? 'g' : 'adet'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-center gap-1 text-amber-600 font-black">
                                            <Zap size={14} fill="currentColor" />
                                            {q.rewardPoints}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setForm(q); setEditing(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                                            <button onClick={() => { if(window.confirm('Bu görevi silmek istediğinize emin misiniz?')) API.quests.del(q.id).then(load); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// ── Badge Tab ──────────────────────────────────────────────────────────────
const BADGE_DEFAULTS = { title: '', description: '', iconKey: 'shield', color: '#F59E0B', rarity: 'COMMON', triggerType: 'FIRST_SUBMISSION', triggerValue: 1, active: true };

function BadgesTab() {
  const [badges, setBadges] = useState([]);
  const [form, setForm] = useState(BADGE_DEFAULTS);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const RARITY_COLORS = { COMMON: '#94a3b8', RARE: '#3b82f6', EPIC: '#a855f7', LEGENDARY: '#f59e0b' };

  const load = () => API.badges.list()
    .then(r => setBadges(r.data))
    .catch(err => setMsg({ text: 'Hata oluştu', type: 'error' }));

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try { 
        await API.badges.save(form); 
        setForm(BADGE_DEFAULTS); 
        setEditing(false); 
        setMsg({ text: 'Rozet başarıyla kaydedildi.', type: 'success' }); 
        load(); 
    } catch (err) { 
        setMsg({ text: 'Kaydedilemedi.', type: 'error' }); 
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <form onSubmit={submit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <Award size={20} />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">{editing ? 'Rozeti Düzenle' : 'Yeni Rozet'}</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rozet Adı</label>
                        <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Açıklama</label>
                        <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none resize-none h-20" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nadilik</label>
                            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none" value={form.rarity} onChange={e => setForm(p => ({ ...p, rarity: e.target.value }))}>
                                {['COMMON','RARE','EPIC','LEGENDARY'].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Renk</label>
                            <input type="color" className="w-full h-11 bg-slate-50 border border-slate-100 rounded-2xl p-1.5 outline-none cursor-pointer" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tetikleyici Koşul</label>
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none" value={form.triggerType} onChange={e => setForm(p => ({ ...p, triggerType: e.target.value }))}>
                            {['FIRST_SUBMISSION','STREAK_DAYS','TOTAL_WEIGHT_GRAM','WASTE_TYPE_COUNT','CO2_SAVED_KG'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hedef Değer</label>
                        <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none" value={form.triggerValue} onChange={e => setForm(p => ({ ...p, triggerValue: +e.target.value }))} />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-amber-600 text-white font-bold py-3 rounded-2xl text-sm hover:bg-amber-700 transition-all shadow-lg shadow-amber-100">Kaydet</button>
                    {editing && <button type="button" className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-2xl text-sm font-bold" onClick={() => { setForm(BADGE_DEFAULTS); setEditing(false); }}>İptal</button>}
                </div>
            </form>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
            {badges.map(b => (
                <div key={b.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-4 group relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button onClick={() => { setForm(b); setEditing(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-100 shadow-sm transition-all"><Edit2 size={14} /></button>
                        <button onClick={() => { if(window.confirm('Silinsin mi?')) API.badges.del(b.id).then(load); }} className="p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-100 shadow-sm transition-all"><Trash2 size={14} /></button>
                    </div>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${RARITY_COLORS[b.rarity] ?? '#94a3b8'}15` }}>
                        <Award size={32} style={{ color: RARITY_COLORS[b.rarity] ?? '#94a3b8' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-slate-900 font-bold truncate">{b.title}</span>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{b.rarity}</span>
                        </div>
                        <p className="text-slate-500 text-xs line-clamp-1">{b.description || 'Açıklama girilmedi.'}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{b.triggerType}: {b.triggerValue}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Reward Tab ─────────────────────────────────────────────────────────────
const REWARD_DEFAULTS = { title: '', description: '', iconKey: '🎁', category: 'DISCOUNT', pointCost: 100, stock: -1, active: true, sortOrder: 0 };

function RewardsTab() {
  const [rewards, setRewards] = useState([]);
  const [form, setForm] = useState(REWARD_DEFAULTS);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const load = () => API.rewards.list()
    .then(r => setRewards(r.data))
    .catch(err => setMsg({ text: 'Yüklenemedi', type: 'error' }));

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try { 
        await API.rewards.save(form); 
        setForm(REWARD_DEFAULTS); 
        setMsg({ text: 'Ödül başarıyla eklendi.', type: 'success' }); 
        load(); 
    } catch (err) { 
        setMsg({ text: 'Hata oluştu.', type: 'error' }); 
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <form onSubmit={submit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Gift size={20} />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">Yeni Ödül Ekle</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ödül Başlığı</label>
                        <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">İkon (Emoji)</label>
                            <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm text-center outline-none" value={form.iconKey} onChange={e => setForm(p => ({ ...p, iconKey: e.target.value }))} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maliyet (Puan)</label>
                            <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none font-black text-amber-600" value={form.pointCost} onChange={e => setForm(p => ({ ...p, pointCost: +e.target.value }))} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stok (-1 Sınırsız)</label>
                        <input type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: +e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Açıklama</label>
                        <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none h-20 resize-none" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                </div>

                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-2xl text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">Ödülü Yayınla</button>
            </form>
        </div>

        <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden h-fit">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-8 py-4">Ürün</th>
                            <th className="px-8 py-4 text-center">Fiyat</th>
                            <th className="px-8 py-4 text-center">Stok</th>
                            <th className="px-8 py-4 text-center">Durum</th>
                            <th className="px-8 py-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rewards.map(r => (
                            <tr key={r.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5 flex items-center gap-3">
                                    <span className="text-2xl w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">{r.iconKey}</span>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">{r.title}</span>
                                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{r.description || 'Detay yok'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <div className="flex items-center justify-center gap-1 text-amber-600 font-black">
                                        <Zap size={14} fill="currentColor" />
                                        {r.pointCost}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center text-xs font-bold text-slate-500">
                                    {r.stock === -1 ? <span className="text-lg">∞</span> : r.stock}
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${r.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                                        {r.active ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button onClick={() => { if(window.confirm('Silsin mi?')) API.rewards.del(r.id).then(load); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}

// ── User Tracking Tab ────────────────────────────────────────────────────────
function UserTrackingTab() {
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');

  const search = async () => {
    if (!userId) return;
    setLoading(true);
    try { const r = await API.userProfile(userId); setProfile(r.data); setMsg(''); }
    catch { setMsg('Kullanıcı bulunamadı'); }
    finally { setLoading(false); }
  };

  const adjustPoints = async () => {
    try { await API.adjustPoints(userId, delta, reason); setMsg('Puan güncellendi'); await search(); }
    catch { setMsg('Hata oluştu'); }
  };

  const TREE_EMOJI = { SEED: '🌱', SPROUT: '🌿', SAPLING: '🌳', TREE: '🌲', FOREST: '🌲🌳🌲' };
  const TREE_LABEL = { SEED: 'Tohum', SPROUT: 'Filiz', SAPLING: 'Fidan', TREE: 'Ağaç', FOREST: 'Orman' };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Search size={32} />
        </div>
        <div className="flex-1 space-y-1 text-center md:text-left">
            <h3 className="text-slate-900 font-bold text-lg">Kullanıcı Profilini İncele</h3>
            <p className="text-slate-500 text-sm">Puanları, rozetleri ve gelişim istatistiklerini görüntüleyin.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <input type="number" placeholder="Kullanıcı ID girin..." className="flex-1 md:w-64 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-blue-200 transition-all" value={userId} onChange={e => setUserId(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
          <button onClick={search} disabled={loading} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-2xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100 flex items-center gap-2">
            {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Search size={18} />}
            <span>Ara</span>
          </button>
        </div>
      </div>

      {profile ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 border-4 border-white shadow-sm">
                        <User size={48} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-black text-slate-900 mb-1">{profile.name} {profile.surname || ''}</h2>
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">ID: #{profile.userId || userId}</span>
                            <span className="text-sm font-medium text-slate-400">Son görülme: {new Date().toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    {[
                        { label: 'Güncel Puan', value: profile.points, color: 'amber', icon: Zap },
                        { label: 'CO₂ Tasarrufu', value: `${parseFloat(profile.co2SavedKg || 0).toFixed(1)} kg`, color: 'emerald', icon: Droplets },
                        { label: 'Güncel Seri', value: profile.streak?.current ?? 0, color: 'orange', icon: Flame },
                        { label: 'Zirve Seri', value: profile.streak?.best ?? 0, color: 'purple', icon: TrendingUp },
                    ].map(s => (
                        <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-sm hover:border-slate-200">
                            <div className={`w-8 h-8 rounded-lg bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center mb-3`}>
                                <s.icon size={16} />
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{s.label}</p>
                            <p className={`text-xl font-black text-${s.color}-600`}>{s.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
                        <TreePine size={18} className="text-emerald-500" />
                        Sanal Gelişim
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="text-6xl p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
                            {TREE_EMOJI[profile.treeStage] ?? '🌱'}
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Mevcut Evre</p>
                            <p className="text-2xl font-black text-slate-900">{TREE_LABEL[profile.treeStage] ?? 'Tohum'}</p>
                            <div className="w-48 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '65%' }}></div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">Sıradaki evreye 12.5 kg CO₂ kaldı</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
                        <Award size={18} className="text-amber-500" />
                        Kazanılan Rozetler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.earnedBadges?.length > 0 ? (
                            profile.earnedBadges.map(b => (
                                <div key={b.id} className="group relative">
                                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 transition-all hover:bg-white hover:border-amber-200 hover:text-amber-600 cursor-default">
                                        <Award size={14} className="text-amber-500" />
                                        {b.title}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm italic">Henüz rozet kazanılmamış.</p>
                        )}
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-amber-100 rounded-3xl p-8 shadow-sm space-y-6 sticky top-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-2">
                    <Zap size={24} fill="currentColor" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-slate-900 font-bold text-lg">Manuel Puan Yönetimi</h3>
                    <p className="text-slate-500 text-sm">Kullanıcı puanını doğrudan güncelleyin.</p>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Miktar Değişimi</label>
                        <div className="relative">
                            <input type="number" className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl pl-4 pr-12 py-4 font-black text-xl outline-none focus:bg-white focus:border-amber-200 transition-all" value={delta} onChange={e => setDelta(+e.target.value)} />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">PTS</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">İşlem Nedeni</label>
                        <input className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-amber-200 transition-all" placeholder="Örn: Etkinlik katılımı ödülü" value={reason} onChange={e => setReason(e.target.value)} />
                    </div>
                </div>

                <button onClick={adjustPoints} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-amber-100 active:scale-95">
                    Puanı Şimdi Güncelle
                </button>
                {msg && <p className="text-center text-xs font-bold text-emerald-600 animate-in fade-in zoom-in">{msg}</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                <Layout size={40} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Profil Verisi Hazır Değil</h4>
            <p className="text-slate-500 max-w-sm">Bir kullanıcı profili incelemek için yukarıdaki arama kutusuna geçerli bir Kullanıcı ID girin.</p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
const AdminGamification = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[2rem] bg-blue-600 shadow-xl shadow-blue-100 flex items-center justify-center text-white">
                <Target size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Oyunlaştırma Paneli</h1>
                <p className="text-slate-500 font-medium">Sistemi daha eğlenceli ve rekabetçi hale getirin.</p>
            </div>
        </div>
        
        {/* Modern Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 self-start sm:self-center">
            {TABS.map((tab, i) => (
                <button 
                    key={tab.label} 
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === i ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <tab.icon size={14} />
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 0 && <QuestsTab />}
        {activeTab === 1 && <BadgesTab />}
        {activeTab === 2 && <RewardsTab />}
        {activeTab === 3 && <UserTrackingTab />}
      </div>
    </div>
  );
};

export default AdminGamification;

