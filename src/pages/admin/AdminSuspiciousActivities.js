import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fraudService } from '../../services/fraud.service';
import { 
    ShieldAlert, 
    ShieldCheck, 
    Activity, 
    BarChart3, 
    PieChart, 
    Filter, 
    Info, 
    Gavel, 
    X, 
    AlertTriangle,
    Search,
    ChevronRight,
    Clock,
    User,
    Ban,
    AlertCircle,
    Calendar,
    RefreshCcw,
    CheckCircle2
} from 'lucide-react';

const AdminSuspiciousActivities = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        reviewed: false,
        riskLevel: '',
        category: '',
        page: 0,
        size: 20
    });
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchStats();
        fetchActivities();
    }, [filters]);

    const fetchStats = async () => {
        try {
            const data = await fraudService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Stats yüklenemedi:', error);
        }
    };

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const data = await fraudService.getActivities(filters.page, filters.size, filters);
            setActivities(data.content || []);
        } catch (error) {
            console.error('Aktiviteler yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (activityId, action, note = '') => {
        try {
            await fraudService.reviewActivity(activityId, action, note);
            fetchActivities();
            fetchStats();
            setShowModal(false);
        } catch (error) {
            console.error('İnceleme hatası:', error);
            alert('İnceleme işlemi başarısız oldu.');
        }
    };

    const getRiskBadgeStyle = (level) => {
        const styles = {
            CRITICAL: 'bg-red-50 text-red-600 border-red-100',
            HIGH: 'bg-orange-50 text-orange-600 border-orange-100',
            MEDIUM: 'bg-amber-50 text-amber-600 border-amber-100',
            LOW: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        };
        return styles[level] || 'bg-slate-50 text-slate-500 border-slate-100';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            PHOTO: '📸',
            LOCATION: '📍',
            ACCOUNT: '👥',
            BEHAVIOR: '⚡',
            TECHNICAL: '🔧'
        };
        return icons[category] || '❓';
    };

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-900 shadow-xl shadow-slate-100 flex items-center justify-center text-white">
                        <ShieldAlert size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Güvenlik ve Denetim</h1>
                        <p className="text-slate-500 font-medium">Şüpheli aktiviteleri ve hile girişimlerini izleyin.</p>
                    </div>
                </div>
                
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                    <button 
                        onClick={() => setFilters({...filters, reviewed: false})}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!filters.reviewed ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Bekleyenler
                    </button>
                    <button 
                        onClick={() => setFilters({...filters, reviewed: true})}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filters.reviewed ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        İncelenenler
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Bekleyen İnceleme" 
                        value={stats.pendingReviewCount} 
                        color="amber"
                        icon={Clock}
                        trend="İncelenmesi gerekenler"
                    />
                    <StatCard 
                        title="Kritik Riskler" 
                        value={stats.criticalCount} 
                        color="red"
                        icon={AlertCircle}
                        trend="Acil müdahale gerekli"
                    />
                    <StatCard 
                        title="Bugünkü Aktivite" 
                        value={stats.todayCount} 
                        color="blue"
                        icon={Calendar}
                        trend="Son 24 saat içindeki tespitler"
                    />
                    <StatCard 
                        title="Engellenen Üyeler" 
                        value={stats.bannedUsersCount} 
                        color="slate"
                        icon={Ban}
                        trend="Toplam yasaklı hesap sayısı"
                    />
                </div>
            )}

            {/* Distribution Charts */}
            {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-slate-900 font-bold flex items-center gap-2">
                                <Activity size={20} className="text-blue-600" />
                                Hile Kategorileri (Son 7 Gün)
                            </h3>
                            <PieChart size={20} className="text-slate-300" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(stats.categoryStats || {}).map(([cat, count]) => (
                                <div key={cat} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{getCategoryIcon(cat)}</span>
                                        <span className="text-lg font-black text-slate-900">{count}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-slate-900 font-bold flex items-center gap-2">
                                <ShieldAlert size={20} className="text-red-600" />
                                Risk Seviyeleri
                            </h3>
                            <BarChart3 size={20} className="text-slate-300" />
                        </div>
                        <div className="space-y-4">
                            {Object.entries(stats.riskLevelStats || {}).map(([level, count]) => (
                                <div key={level} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${getRiskBadgeStyle(level)}`}>
                                        {level}
                                    </span>
                                    <span className="font-black text-slate-900">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters & Table */}
            <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-500">Filtrele:</span>
                    </div>
                    
                    <select
                        className="bg-white border border-slate-100 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 outline-none focus:border-blue-200 transition-all cursor-pointer shadow-sm"
                        value={filters.riskLevel}
                        onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                    >
                        <option value="">Tüm Risk Seviyeleri</option>
                        <option value="CRITICAL">🚨 Kritik</option>
                        <option value="HIGH">🟠 Yüksek</option>
                        <option value="MEDIUM">🟡 Orta</option>
                        <option value="LOW">🟢 Düşük</option>
                    </select>

                    <select
                        className="bg-white border border-slate-100 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 outline-none focus:border-blue-200 transition-all cursor-pointer shadow-sm"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="">Tüm Kategoriler</option>
                        <option value="PHOTO">📸 Fotoğraf</option>
                        <option value="LOCATION">📍 Konum</option>
                        <option value="ACCOUNT">👥 Hesap</option>
                        <option value="BEHAVIOR">⚡ Davranış</option>
                        <option value="TECHNICAL">🔧 Teknik</option>
                    </select>

                    <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-400 font-bold italic">
                        <Info size={12} />
                        Son 30 günlük veriler incelenmektedir.
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-8 py-5">Kullanıcı Bilgisi</th>
                                    <th className="px-8 py-5">Hile Kategorisi</th>
                                    <th className="px-8 py-5">Risk Seviyesi</th>
                                    <th className="px-8 py-5">Açıklama</th>
                                    <th className="px-8 py-5">Tarih</th>
                                    <th className="px-8 py-5 text-right">Aksiyon</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-20">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <RefreshCcw size={32} className="text-blue-600 animate-spin" />
                                                <span className="text-sm font-bold text-slate-400 tracking-tight">Veriler Yükleniyor...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : activities.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-20">
                                            <div className="flex flex-col items-center justify-center text-center space-y-2">
                                                <ShieldCheck size={48} className="text-slate-200" />
                                                <p className="text-slate-400 font-bold">Şu an için şüpheli bir aktivite bulunmuyor.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((activity) => (
                                        <tr key={activity.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <User size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 tracking-tight">{activity.userName}</span>
                                                        <span className="text-xs text-slate-400 font-medium">{activity.userEmail}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{getCategoryIcon(activity.fraudCategory)}</span>
                                                    <span className="text-xs font-bold text-slate-700">{activity.fraudTypeDescription}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${getRiskBadgeStyle(activity.riskLevel)}`}>
                                                    {activity.riskLevelDisplay}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="max-w-[200px] truncate text-xs text-slate-500 font-medium" title={activity.description}>
                                                    {activity.description}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-slate-400 font-bold">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={12} />
                                                    {new Date(activity.createdAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => { setSelectedActivity(activity); setShowModal(true); }}
                                                    className="bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-600 px-5 py-2 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 flex items-center gap-2 ml-auto"
                                                >
                                                    İncele
                                                    <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showModal && selectedActivity && (
                <ReviewModal
                    activity={selectedActivity}
                    onClose={() => setShowModal(false)}
                    onReview={handleReview}
                />
            )}
        </div>
    );
};

// Stat Card
const StatCard = ({ title, value, color, icon: Icon, trend }) => {
    const colors = {
        amber: 'text-amber-600 bg-amber-50 border-amber-100 shadow-amber-100/50',
        red: 'text-red-600 bg-red-50 border-red-100 shadow-red-100/50',
        blue: 'text-blue-600 bg-blue-50 border-blue-100 shadow-blue-100/50',
        slate: 'text-slate-600 bg-slate-50 border-slate-100 shadow-slate-100/50'
    };

    return (
        <div className={`bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm transition-all hover:shadow-md group`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]}`}>
                    <Icon size={24} />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
            </div>
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
                <p className="text-[10px] text-slate-400 font-medium italic">{trend}</p>
            </div>
        </div>
    );
};

// Review Modal
const ReviewModal = ({ activity, onClose, onReview }) => {
    const [action, setAction] = useState('DISMISSED');
    const [note, setNote] = useState('');

    const actions = [
        { value: 'DISMISSED', label: 'Yanlış Alarm - Kapat', icon: ShieldCheck, color: 'emerald' },
        { value: 'WARNED', label: 'Kullanıcıyı Uyar', icon: AlertTriangle, color: 'amber' },
        { value: 'POINTS_REVOKED', label: 'Puanları Geri Al', icon: Activity, color: 'orange' },
        { value: 'WASTE_DELETED', label: 'Atık Kaydını Sil', icon: ShieldAlert, color: 'red' },
        { value: 'SUSPENDED_7D', label: '7 Gün Askıya Al', icon: Ban, color: 'rose' },
        { value: 'BANNED', label: 'Kalıcı Yasak', icon: Ban, color: 'slate' }
    ];

    const getRiskBadgeStyle = (level) => {
        const styles = {
            CRITICAL: 'bg-red-50 text-red-600 border-red-100',
            HIGH: 'bg-orange-50 text-orange-600 border-orange-100',
            MEDIUM: 'bg-amber-50 text-amber-600 border-amber-100',
            LOW: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        };
        return styles[level] || 'bg-slate-50 text-slate-500 border-slate-100';
    };

    const getActionColor = (val) => {
        const item = actions.find(a => a.value === val);
        return item?.color || 'blue';
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-[40px] shadow-2xl max-w-2xl w-full animate-in zoom-in-95 duration-300 overflow-hidden">
                <div className="p-8 md:p-10 space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Gavel size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Vaka İncelemesi</h2>
                                <p className="text-xs text-slate-400 font-bold">Denetim ID: #{activity.id.toString().slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Kullanıcı Bilgisi</span>
                            <div className="font-bold text-slate-900">{activity.userName}</div>
                            <div className="text-xs text-slate-500">{activity.userEmail}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tespit Edilen İhlal</span>
                            <div className="font-bold text-slate-900">{activity.fraudTypeDescription}</div>
                            <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase tracking-widest mt-1 ${getRiskBadgeStyle(activity.riskLevel)}`}>
                                {activity.riskLevelDisplay}
                            </span>
                        </div>
                        <div className="col-span-2 pt-4 border-t border-slate-200/50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Sistem Açıklaması</span>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{activity.description}"</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <Gavel size={18} className="text-blue-600" />
                            İdari Karar
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {actions.map((a) => (
                                <button
                                    key={a.value}
                                    onClick={() => setAction(a.value)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                                        action === a.value 
                                        ? `border-${a.color}-600 bg-${a.color}-50 text-${a.color}-600 shadow-sm` 
                                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                    }`}
                                >
                                    <a.icon size={20} />
                                    <span className="text-[10px] font-black leading-tight uppercase tracking-tighter">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Denetim Notları (İsteğe Bağlı)</label>
                        <textarea
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-200 outline-none transition-all resize-none h-24"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Alınan karar ile ilgili teknik veya idari detayları buraya ekleyin..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-slate-50 text-slate-500 px-8 py-5 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all"
                        >
                            İptal
                        </button>
                        <button
                            onClick={() => onReview(activity.id, action, note)}
                            className="flex-1 bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            <CheckCircle2 size={18} />
                            Kararı Uygula
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSuspiciousActivities;

