import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { contactService } from '../../services/contact.service';
import DeleteModal from '../../components/admin/DeleteModal';
import AdminModal from '../../components/admin/AdminModal';
import { 
    Mail, 
    Trash2, 
    Eye, 
    ChevronLeft, 
    ChevronRight,
    Search,
    Calendar,
    User,
    CheckCircle,
    Clock
} from 'lucide-react';

const AdminMessages = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await contactService.getMessages(page, size);
            setMessages(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error("Fetch messages failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [page, size]);

    const handleView = async (id) => {
        try {
            const message = await contactService.getMessageDetail(id);
            setSelectedMessage(message);
            setIsDetailModalOpen(true);
            // Re-fetch to update isRead status in the list
            fetchMessages();
        } catch (error) {
            console.error("Fetch message detail failed:", error);
        }
    };

    const handleDeleteClick = (message) => {
        setSelectedMessage(message);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await contactService.deleteMessage(selectedMessage.id);
            setIsDeleteModalOpen(false);
            fetchMessages();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mesaj Yönetimi</h1>
                    <p className="text-sm text-slate-500 mt-1">İletişim formundan gelen mesajları görüntüleyin ve yönetin.</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4">Gönderen</th>
                                <th className="px-6 py-4">Konu</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Mesajlar Yükleniyor...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : messages.length === 0 ? (
                                <tr><td colSpan="5" className="p-12 text-center text-sm font-medium text-slate-400">Henüz mesaj bulunmuyor.</td></tr>
                            ) : (
                                messages.map((msg) => (
                                    <tr key={msg.id} className={`group hover:bg-slate-50/50 transition-colors ${!msg.read ? 'bg-blue-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            {msg.read ? (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                    <CheckCircle size={14} />
                                                    Okundu
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                                                    <Clock size={14} className="animate-pulse" />
                                                    Yeni
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`text-sm ${!msg.read ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                                    {msg.name} {msg.surname}
                                                </span>
                                                <span className="text-xs text-slate-400">{msg.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm truncate max-w-xs block ${!msg.read ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                                                {msg.subject}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-500">{formatDate(msg.createdAt)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleView(msg.id)} title="Görüntüle" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteClick(msg)} title="Sil" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-medium text-slate-400">
                        Toplam <span className="font-bold text-slate-700">{totalElements}</span> mesaj
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => setPage(p => Math.max(0, p - 1))} 
                            disabled={page === 0} 
                            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="px-4 text-xs font-bold text-slate-700">
                            Sayfa {page + 1} / {totalPages || 1}
                        </div>
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                            disabled={page + 1 >= totalPages} 
                            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Message Detail Modal */}
            <AdminModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Mesaj Detayı"
            >
                {selectedMessage && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gönderen</label>
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <User size={14} className="text-slate-400" />
                                    {selectedMessage.name} {selectedMessage.surname}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tarih</label>
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Calendar size={14} className="text-slate-400" />
                                    {formatDate(selectedMessage.createdAt)}
                                </div>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-posta</label>
                                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                                    <Mail size={14} className="text-blue-400" />
                                    <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Konu</label>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-800">
                                {selectedMessage.subject}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mesaj</label>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                )}
            </AdminModal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message="Bu mesajı kalıcı olarak silmek istediğinize emin misiniz?"
            />
        </div>
    );
};

export default AdminMessages;
