import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../../services/user.service';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Recycle,
    Monitor,
    ArrowRight,
    Edit2,
    UploadCloud,
    BarChart3,
    Activity,
    Database,
    Download,
    Cpu,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Leaf,
    TrendingUp,
    ShoppingBag,
    Clock
} from 'lucide-react';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalActiveUsers: 0,
        totalRecycledWeight: 0,
        totalActivePlatforms: 0,
        totalCo2Saved: 0,
        availableCo2InPool: 0,
        totalSoldCo2: 0,
        pendingSellRequests: 0
    });

    const [recentUsers, setRecentUsers] = useState([]);
    const [systemStatus, setSystemStatus] = useState('Checking...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const statsData = await userService.getAdminDashboardStats();
                setStats(statsData);

                const usersData = await userService.getLastUsers();
                setRecentUsers(usersData);

                const isSystemUp = await userService.checkSystemStatus();
                setSystemStatus(isSystemUp ? 'active' : 'passive');
            } catch (error) {
                console.error("Dashboard data fetch failed:", error);
                setSystemStatus('passive');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatWeight = (grams) => {
        if (!grams) return "0";
        return (grams / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
    };

    const formatCo2 = (kg) => {
        if (!kg) return "0";
        return Number(kg).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sistem Özeti</h1>
                    <p className="text-sm text-slate-500 mt-1">Platform genel durumunu buradan takip edebilirsiniz.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-xl text-sm font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Sistem Aktif
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    title="Aktif Kullanıcılar"
                    value={loading ? "..." : stats.totalActiveUsers}
                    change="+12%"
                    isUp={true}
                    color="blue"
                />
                <StatCard
                    icon={Leaf}
                    title="Toplam CO₂ Tasarrufu"
                    value={loading ? "..." : `${formatCo2(stats.totalCo2Saved)} kg`}
                    change=""
                    color="green"
                />
                <StatCard
                    icon={Database}
                    title="Bağlı Platformlar"
                    value={loading ? "..." : stats.totalActivePlatforms}
                    change="0%"
                    isUp={true}
                    color="purple"
                />
                <StatCard
                    icon={Cpu}
                    title="Sunucu Durumu"
                    value={loading ? "..." : (systemStatus === 'active' ? 'Kararlı' : 'Hata')}
                    isStatus
                    status={systemStatus}
                />
            </div>

            {/* Karbon Hareketleri */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Leaf size={20} className="text-green-600" />
                            Karbon Hareketleri
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">ISO 14064 / GHG Protocol — Gerçek zamanlı veriler</p>
                    </div>
                    {stats.pendingSellRequests > 0 && (
                        <button
                            onClick={() => navigate('/admin/exchange')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
                        >
                            <Clock size={13} />
                            {stats.pendingSellRequests} Bekleyen Talep
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        icon={Database}
                        title="Havuzdaki Karbon"
                        value={loading ? "..." : `${formatCo2(stats.availableCo2InPool)} kg`}
                        change=""
                        color="blue"
                    />
                    <StatCard
                        icon={ShoppingBag}
                        title="Kurumsal Satışlar"
                        value={loading ? "..." : `${formatCo2(stats.totalSoldCo2)} kg`}
                        change=""
                        color="purple"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Bekleyen Talepler"
                        value={loading ? "..." : stats.pendingSellRequests}
                        change=""
                        color={stats.pendingSellRequests > 0 ? "red" : "green"}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Users Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">Son Kayıt Olan Kullanıcılar</h3>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                            Tümünü Gör <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Kullanıcı</th>
                                        <th className="px-6 py-4">Yetki</th>
                                        <th className="px-6 py-4">Durum</th>
                                        <th className="px-6 py-4 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="4" className="p-8 text-center text-slate-400">Veriler yükleniyor...</td></tr>
                                    ) : recentUsers.length === 0 ? (
                                        <tr><td colSpan="4" className="p-8 text-center text-slate-400">Kullanıcı bulunamadı.</td></tr>
                                    ) : (
                                        recentUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-bold text-sm">
                                                            {user.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{user.name} {user.surname}</p>
                                                            <p className="text-xs text-slate-400">ID: #{user.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {user.role === 'ROLE_ADMIN' ? 'Yönetici' : 'Kullanıcı'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        {user.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                        <Edit2 size={16} />
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

                {/* Hızlı İşlemler & Durum */}
                <div className="space-y-6">
                    <h3 className="font-bold text-slate-900">Hızlı İşlemler</h3>
                    
                    <div className="space-y-4">
                        <QuickActionCard
                            icon={UploadCloud}
                            title="İçerik Yükle"
                            desc="Yeni eğitim materyalleri ve duyurular yayınlayın."
                            color="blue"
                        />
                        
                        <QuickActionCard
                            icon={BarChart3}
                            title="Rapor Oluştur"
                            desc="Çevresel etki ve puan verilerini dışa aktarın."
                            color="green"
                        />
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Activity size={18} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-900">Sistem Kaynakları</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Anlık</span>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-slate-500">İşlemci</span>
                                    <span className="text-slate-900">12%</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '12%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-slate-500">Bellek</span>
                                    <span className="text-slate-900">42%</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value, change, isUp, color, isStatus, status }) => {
    const isError = isStatus && status === 'passive';
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        purple: 'text-purple-600 bg-purple-50',
        red: 'text-red-600 bg-red-50'
    };

    return (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${isError ? colorClasses.red : colorClasses[color || 'blue']}`}>
                    <Icon size={24} />
                </div>
                {change && (
                    <div className={`flex items-center gap-0.5 text-xs font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {change}
                    </div>
                )}
                {isStatus && (
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {status === 'active' ? 'Stabil' : 'Hata'}
                    </span>
                )}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
    );
};

const QuickActionCard = ({ icon: Icon, title, desc, color }) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white',
        green: 'text-green-600 bg-green-50 hover:bg-green-600 hover:text-white'
    };

    return (
        <button className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-200 transition-all text-left group">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${colorClasses[color]}`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
        </button>
    );
};

const ChevronRight = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default AdminDashboard;
