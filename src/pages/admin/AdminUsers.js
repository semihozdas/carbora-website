import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../../services/user.service';
import UserDetailModal from '../../components/admin/UserDetailModal';
import DeleteModal from '../../components/admin/DeleteModal';
import ExcelExportBtn from '../../components/common/ExcelExportBtn';
import { 
    Search, 
    Filter, 
    UserPlus, 
    Eye, 
    Edit2, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Users,
    Mail,
    Award,
    MoreHorizontal,
    Download,
    Activity
} from 'lucide-react';

const AdminUsers = () => {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);
    const [modalMode, setModalMode] = useState('view');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers(page, size, searchTerm, roleFilter, statusFilter);
            setUsers(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, size, roleFilter, statusFilter]);

    const handleSearch = () => {
        if (page === 0) fetchUsers();
        else setPage(0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleCreateClick = () => {
        setSelectedUser(null);
        setModalMode('create');
        setIsDetailModalOpen(true);
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setModalMode('view');
        setIsDetailModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalMode('edit');
        setIsDetailModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleSaveUser = async (updatedData) => {
        try {
            if (modalMode === 'create') {
                await userService.adminCreateUser(updatedData);
            } else {
                if (updatedData.status !== selectedUser.status) {
                    await userService.adminChangeStatus(updatedData.id, updatedData.status);
                }
                await userService.adminUpdateUser(updatedData.id, updatedData);
            }
            setIsDetailModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await userService.adminDeleteUser(selectedUser.id);
            setIsDeleteModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const prepareExportData = () => {
        const lang = (i18n.resolvedLanguage || i18n.language || 'tr').split('-')[0];
        const dateLocale = lang === 'tr' ? 'tr-TR' : 'en-US';

        return users.map(user => ({
            ID: user.id,
            'AD SOYAD': `${user.name} ${user.surname}`,
            'E-POSTA': user.email,
            ROL: user.role === 'ROLE_ADMIN' ? 'Yönetici' : 'Kullanıcı',
            PUAN: user.userPoint,
            DURUM: user.status === 'ACTIVE' ? 'Aktif' : 'Pasif',
            'KAYIT TARİHİ': user.createdDate ? new Date(user.createdDate).toLocaleDateString(dateLocale) : '-'
        }));
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Kullanıcı Yönetimi</h1>
                    <p className="text-sm text-slate-500 mt-1">Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin.</p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                >
                    <UserPlus size={18} />
                    <span>Yeni Kullanıcı Ekle</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all placeholder-slate-400"
                            placeholder="İsim, soyisim veya e-posta ile ara..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                            <Filter size={16} className="text-slate-400" />
                            <select
                                value={roleFilter}
                                onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
                                className="bg-transparent border-none text-sm font-semibold text-slate-700 outline-none focus:ring-0 cursor-pointer"
                            >
                                <option value="">Tüm Roller</option>
                                <option value="ROLE_ADMIN">Yönetici</option>
                                <option value="ROLE_USER">Kullanıcı</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                            <Activity size={16} className="text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                                className="bg-transparent border-none text-sm font-semibold text-slate-700 outline-none focus:ring-0 cursor-pointer"
                            >
                                <option value="">Tüm Durumlar</option>
                                <option value="ACTIVE">Aktif</option>
                                <option value="PASSIVE">Pasif</option>
                            </select>
                        </div>

                        <ExcelExportBtn
                            data={prepareExportData()}
                            fileName="kullanici_listesi"
                            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                        >
                            <Download size={16} />
                            <span>Dışa Aktar</span>
                        </ExcelExportBtn>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Kullanıcı Bilgileri</th>
                                <th className="px-6 py-4 hidden lg:table-cell">E-posta</th>
                                <th className="px-6 py-4 hidden xl:table-cell text-center">Puan</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Veriler Yükleniyor...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="7" className="p-12 text-center text-sm font-medium text-slate-400">Aradığınız kriterlere uygun kullanıcı bulunamadı.</td></tr>
                            ) : (
                                users.map((user) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        onView={() => handleView(user)}
                                        onEdit={() => handleEdit(user)}
                                        onDelete={() => handleDeleteClick(user)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Göster:</span>
                            <select
                                value={size}
                                onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
                                className="bg-white border border-slate-200 rounded-lg text-xs font-bold py-1 px-2 text-slate-700 outline-none focus:border-blue-300 transition-all"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                            Toplam <span className="font-bold text-slate-700">{totalElements}</span> kayıttan <span className="font-bold text-slate-700">{totalElements ? (page * size) + 1 : 0} - {Math.min((page + 1) * size, totalElements)}</span> arası gösteriliyor
                        </span>
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

            <UserDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                user={selectedUser}
                mode={modalMode}
                onSave={handleSaveUser}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`${selectedUser?.name || ''} ${selectedUser?.surname || ''} isimli kullanıcıyı sistemden kaldırmak istediğinize emin misiniz?`}
            />
        </div>
    );
};

const UserRow = ({ user, onView, onEdit, onDelete }) => {
    const isRoleAdmin = user.role === 'ROLE_ADMIN';
    const isActive = user.status === 'ACTIVE';
    const fullName = `${user.name || ''} ${user.surname || ''}`.trim();
    const initials = fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

    return (
        <tr className="group hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
                <span className="text-xs font-mono text-slate-400">#{user.id}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden shrink-0">
                        {user.profilePhotoUrl ? (
                            <img src={user.profilePhotoUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span>{initials}</span>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 truncate">{fullName}</span>
                        <span className="text-xs text-slate-400 lg:hidden truncate">{user.email}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 hidden lg:table-cell">
                <span className="text-sm text-slate-600">{user.email}</span>
            </td>
            <td className="px-6 py-4 text-center hidden xl:table-cell">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold">
                    <Award size={14} />
                    {user.userPoint || 0}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isRoleAdmin ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                    {isRoleAdmin ? 'Yönetici' : 'Kullanıcı'}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className={`flex items-center gap-1.5 text-xs font-bold ${isActive ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {isActive ? 'Aktif' : 'Pasif'}
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    <button onClick={onView} title="Görüntüle" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Eye size={18} />
                    </button>
                    <button onClick={onEdit} title="Düzenle" className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                        <Edit2 size={18} />
                    </button>
                    <button onClick={onDelete} title="Sil" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AdminUsers;
