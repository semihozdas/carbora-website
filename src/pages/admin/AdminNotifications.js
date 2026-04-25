import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationService from '../../services/notification.service';
import { userService } from '../../services/user.service';
import { 
    Bell, 
    Send, 
    Users, 
    User, 
    Building, 
    CheckCircle2, 
    XCircle, 
    Info,
    Layout,
    ChevronRight,
    Smartphone,
    Layers
} from 'lucide-react';

const AdminNotifications = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [targetType, setTargetType] = useState('ALL'); // ALL, SINGLE, CORPORATE
    const [selectedUserId, setSelectedUserId] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);
    const [sentNotifications, setSentNotifications] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const response = await NotificationService.getAllNotifications(0, 10);
            setSentNotifications(response.content || []);
        } catch (error) {
            console.error('Bildirim geçmişi alınamadı:', error);
        } finally {
            setHistoryLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers(0, 500, '', '', '');
            setUsers(response.content || []);
        } catch (error) {
            console.error('Kullanıcılar alınamadı:', error);
        }
    };

    const groupedNotifications = React.useMemo(() => {
        const groups = [];
        sentNotifications.forEach(n => {
            const date = new Date(n.createdAt).getTime();
            // Aynı başlık, içerik ve yakın zamanlı (5sn) bildirimleri grupla
            const existingGroup = groups.find(g => 
                g.title === n.title && 
                g.body === n.body && 
                Math.abs(new Date(g.createdAt).getTime() - date) < 5000
            );

            if (existingGroup) {
                existingGroup.users.push(n.user);
                existingGroup.count++;
                // Eğer gruptaki herhangi biri okumadıysa beklemede göster
                if (!n.isRead) existingGroup.isRead = false;
            } else {
                groups.push({
                    ...n,
                    users: [n.user],
                    count: 1
                });
            }
        });
        return groups;
    }, [sentNotifications]);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage(null);

        try {
            if (targetType === 'ALL') {
                await NotificationService.sendToAll(title, body, null);
                setStatusMessage({ type: 'success', text: 'Tüm kullanıcılara bildirim başarıyla gönderildi.' });
            } else if (targetType === 'SINGLE') {
                if (!selectedUserId) {
                    setStatusMessage({ type: 'error', text: 'Lütfen bir kullanıcı seçin.' });
                    setLoading(false);
                    return;
                }
                await NotificationService.sendToUser(selectedUserId, title, body, null);
                setStatusMessage({ type: 'success', text: 'Seçili kullanıcıya bildirim başarıyla gönderildi.' });
            } else if (targetType === 'CORPORATE') {
                const corporateUsers = users.filter(u => u.role === 'ROLE_CORPORATE').map(u => u.id);
                if(corporateUsers.length === 0) {
                    setStatusMessage({ type: 'error', text: 'Kurumsal kullanıcı bulunamadı.' });
                    setLoading(false);
                    return;
                }
                await NotificationService.sendBulk(corporateUsers, title, body, null);
                setStatusMessage({ type: 'success', text: 'Kurumsal kullanıcılara bildirim başarıyla gönderildi.' });
            }
            setTitle('');
            setBody('');
            fetchHistory(); // Geçmişi tazele
        } catch (error) {
            console.error('Bildirim gönderme hatası:', error);
            setStatusMessage({ type: 'error', text: 'Bildirim gönderilirken bir hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[2rem] bg-blue-600 shadow-xl shadow-blue-100 flex items-center justify-center text-white">
                    <Bell size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bildirim Yönetimi</h1>
                    <p className="text-slate-500 font-medium">Kullanıcılara push bildirimleri ve sistem duyuruları gönderin.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
                {/* Form Section */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-sm space-y-8">
                        {statusMessage && (
                            <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border animate-in zoom-in duration-300 ${statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                                {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleSend} className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Users size={16} /> Hedef Kitle Belirleme
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        { id: 'ALL', label: 'Tüm Kullanıcılar', icon: Users },
                                        { id: 'SINGLE', label: 'Özel Kullanıcı', icon: User },
                                        { id: 'CORPORATE', label: 'Kurumsal Üyeler', icon: Building }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setTargetType(type.id)}
                                            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${targetType === type.id ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            <type.icon size={24} strokeWidth={targetType === type.id ? 2.5 : 2} />
                                            <span className="text-xs font-black">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {targetType === 'SINGLE' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alıcı Seçimi</label>
                                    <select 
                                        value={selectedUserId} 
                                        onChange={(e) => setSelectedUserId(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all cursor-pointer shadow-inner"
                                    >
                                        <option value="">Bir kullanıcı arayın veya seçin...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Layout size={16} /> Bildirim İçeriği
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Başlık</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={title} 
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm font-bold focus:bg-white focus:border-blue-200 outline-none transition-all shadow-inner placeholder-slate-300"
                                            placeholder="Bildirim başlığını buraya girin..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mesaj Detayı</label>
                                        <textarea 
                                            required
                                            value={body} 
                                            onChange={(e) => setBody(e.target.value)}
                                            rows="5"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:bg-white focus:border-blue-200 outline-none transition-all shadow-inner resize-none placeholder-slate-300"
                                            placeholder="Kullanıcıların göreceği mesaj metni..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-5 font-black text-lg transition-all shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-[0.98] flex justify-center items-center gap-3 group"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Bildirimi Şimdi Gönder
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-8">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Smartphone size={16} /> Önizleme
                    </h3>
                    
                    <div className="relative mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl p-4 overflow-hidden">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
                        
                        {/* Mock Wallpaper */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-20"></div>
                        
                        {/* Notification Mock */}
                        <div className="mt-20 space-y-4">
                            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20 animate-bounce-subtle">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-[10px] text-white font-black">C</div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Carbora • Az önce</span>
                                </div>
                                <h4 className="text-xs font-black text-slate-900 truncate">{title || 'Bildirim Başlığı'}</h4>
                                <p className="text-[10px] text-slate-600 mt-1 line-clamp-3 leading-relaxed">{body || 'Mesaj içeriği burada görünecek...'}</p>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                            <Info size={14} /> Bilgi
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Gönderilen bildirimler kullanıcıların cihazlarına anlık olarak (Push Notification) ve uygulama içi bildirim merkezine iletilir. Bu işlem geri alınamaz.
                        </p>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Send size={20} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Giden Bildirimler</h3>
                    </div>
                    {historyLoading && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Tarih</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Alıcı</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Başlık</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">İçerik</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {groupedNotifications.length > 0 ? (
                                groupedNotifications.map((notif) => (
                                    <tr key={notif.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-600">
                                                {new Date(notif.createdAt).toLocaleDateString('tr-TR')}
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-400 uppercase">
                                                {new Date(notif.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {notif.count > 1 ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                                        <Users size={16} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-blue-600 leading-none">Tüm Kullanıcılar</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">{notif.count} Alıcıya Gönderildi</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                        {notif.user?.name?.charAt(0)}{notif.user?.surname?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 leading-none">{notif.user?.name} {notif.user?.surname}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">{notif.user?.email}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-black text-slate-800">{notif.title}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm text-slate-500 max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:max-w-md transition-all">
                                                {notif.body}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${notif.isRead ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                {notif.isRead ? (
                                                    <><CheckCircle2 size={12} /> Okundu</>
                                                ) : (
                                                    <><Info size={12} /> {notif.count > 1 ? 'İletildi' : 'Beklemede'}</>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-medium">
                                        Henüz gönderilmiş bir bildirim bulunmuyor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;

