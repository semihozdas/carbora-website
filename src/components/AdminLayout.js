import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/user.service';
import { 
    LayoutDashboard, 
    Users, 
    Building2, 
    MapPin, 
    Monitor, 
    Wallet, 
    ShieldAlert, 
    Gamepad2, 
    GraduationCap,
    Bell,
    Search,
    Menu,
    LogOut,
    UserCircle,
    ChevronRight,
    Settings,
    HelpCircle,
    Mail,
    Leaf,
    ShieldCheck
} from 'lucide-react';
import profileScreenDefaultProfilImage from '../assets/images/defaultProfilePhoto.png';
import adminAvatar from '../assets/images/adminAvatar.png';

const AdminLayout = () => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [adminProfileData, setAdminProfileData] = useState({
        name: '',
        surname: '',
        profilePhotoUrl: adminAvatar
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            userService.getUserProfile()
                .then(data => {
                    setAdminProfileData({
                        name: data.name || user?.name || '',
                        surname: data.surname || user?.surname || '',
                        profilePhotoUrl: data.profilePhotoUrl || profileScreenDefaultProfilImage
                    });
                })
                .catch(err => {
                    console.error("Admin profili alınamadı:", err);
                    setAdminProfileData({
                        name: user?.name || '',
                        surname: user?.surname || '',
                        profilePhotoUrl: user?.profilePhotoUrl || profileScreenDefaultProfilImage
                    });
                });
        }
    }, [isAuthenticated, user]);

    const isActive = (path) => location.pathname === path;

    const handleExitAdmin = () => {
        navigate('/');
    };

    const navItems = [
        { path: '/admin', label: 'Genel Bakış', icon: LayoutDashboard },
        { path: '/admin/users', label: 'Kullanıcı Yönetimi', icon: Users },
        { path: '/admin/institutions', label: 'Kurumlar', icon: Building2 },
        { path: '/admin/locations', label: 'Konumlar', icon: MapPin },
        { path: '/admin/platforms', label: 'Platformlar', icon: Monitor },
        { divider: true },
        { path: '/admin/exchange', label: 'Puan & Ödeme', icon: Wallet },
        { path: '/admin/fraud', label: 'Dolandırıcılık Denetimi', icon: ShieldAlert },
        { path: '/admin/gamification', label: 'Oyunlaştırma', icon: Gamepad2 },
        { path: '/admin/education', label: 'Eğitim İçerikleri', icon: GraduationCap },
        { path: '/admin/notifications', label: 'Bildirim Yönetimi', icon: Bell },
        { path: '/admin/messages', label: 'Mesajlar', icon: Mail },
    ];

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden light-layout">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex-shrink-0 flex flex-col z-30 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Branding */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100 flex-shrink-0 overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-100">
                            <Leaf size={18} />
                        </div>
                        <span className={`text-xl font-bold text-slate-900 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                            CARBORA
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                    {navItems.map((item, idx) => {
                        if (item.divider) return <div key={idx} className="h-px bg-slate-100 my-4 mx-3" />;
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                title={!isSidebarOpen ? item.label : ''}
                            >
                                <Icon size={20} className={`shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className={`text-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                    {item.label}
                                </span>
                                {active && isSidebarOpen && <ChevronRight size={14} className="ml-auto opacity-50" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-100 flex-shrink-0">
                    <div className={`bg-slate-50 rounded-2xl p-3 flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white border border-white shadow-sm">
                                <ShieldCheck size={22} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                    {adminProfileData.name} {adminProfileData.surname}
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Yönetici</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleExitAdmin}
                        className={`mt-3 w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold ${!isSidebarOpen && 'justify-center'}`}
                        title="Çıkış Yap"
                    >
                        <LogOut size={18} />
                        {isSidebarOpen && <span className="text-sm">Paneli Kapat</span>}
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-slate-500 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="h-6 w-px bg-slate-200 mx-2"></div>
                        <h2 className="text-slate-900 font-bold hidden md:block">
                            {navItems.find(i => isActive(i.path))?.label || 'Yönetim Paneli'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center bg-slate-100 border border-transparent px-4 h-10 rounded-xl focus-within:bg-white focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-50 transition-all w-80">
                            <Search size={18} className="text-slate-400 mr-2" />
                            <input
                                className="bg-transparent border-none text-slate-900 placeholder-slate-400 text-sm focus:ring-0 w-full"
                                placeholder="Sistemde ara..."
                                type="text"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all" title="Yardım">
                                <HelpCircle size={20} />
                            </button>
                            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all" title="Ayarlar">
                                <Settings size={20} />
                            </button>
                            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all" title="Bildirimler">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
