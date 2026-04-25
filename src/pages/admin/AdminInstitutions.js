import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { institutionService } from '../../services/institution.service';
import InstitutionModal from '../../components/admin/InstitutionModal';
import DeleteModal from '../../components/admin/DeleteModal';
import ExcelExportBtn from '../../components/common/ExcelExportBtn';
import InstitutionViewModal from '../../components/admin/InstitutionViewModal';
import { 
    Search, 
    Filter, 
    Plus, 
    Eye, 
    Edit2, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    Building2,
    MapPin,
    Activity,
    Download,
    School,
    Gavel,
    Briefcase,
    HeartHandshake
} from 'lucide-react';

const AdminInstitutions = () => {
    const { t } = useTranslation();
    // --- STATE ---
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtre & Sayfalama
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // --- MODAL STATE ---
    const [selectedInst, setSelectedInst] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const [isInstModalOpen, setIsInstModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Verileri Çekme
    const fetchInstitutions = async () => {
        setLoading(true);
        try {
            const response = await institutionService.getAllInstitutions(page, size, searchTerm, typeFilter, statusFilter);
            setInstitutions(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error("Kurumlar yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, typeFilter, statusFilter]);

    // Handler'lar
    const handleSearch = () => { if (page === 0) fetchInstitutions(); else setPage(0); };
    const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

    const handleCreateClick = () => {
        setSelectedInst(null);
        setModalMode('create');
        setIsInstModalOpen(true);
    };

    const handleViewClick = (inst) => {
        setSelectedInst(inst);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (inst) => {
        setSelectedInst(inst);
        setModalMode('edit');
        setIsInstModalOpen(true);
    };

    const handleDeleteClick = (inst) => {
        setSelectedInst(inst);
        setIsDeleteModalOpen(true);
    };

    const handleSaveInstitution = async (data) => {
        try {
            if (modalMode === 'create') {
                await institutionService.createInstitution(data);
            } else {
                await institutionService.updateInstitution(selectedInst.id, data);
            }
            setIsInstModalOpen(false);
            fetchInstitutions();
        } catch (error) {
            console.error("Kaydetme hatası:", error);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await institutionService.deleteInstitution(selectedInst.id);
            setIsDeleteModalOpen(false);
            fetchInstitutions();
        } catch (error) {
            console.error("Silme hatası:", error);
        }
    };

    // Excel Verisi
    const prepareExportData = () => {
        return institutions.map(inst => ({
            ID: inst.id,
            Kurum: inst.name,
            Konum: inst.locationText,
            Tür: inst.type,
            Durum: inst.active ? 'Aktif' : 'Pasif'
        }));
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Kurum Yönetimi</h1>
                    <p className="text-sm text-slate-500 mt-1">Sisteme bağlı kurumları ve platformları yönetin.</p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Yeni Kurum Ekle</span>
                </button>
            </div>

            {/* FILTER BAR */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all placeholder-slate-400"
                            placeholder="Kurum adı veya konum ile ara..."
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
                                value={typeFilter}
                                onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
                                className="bg-transparent border-none text-sm font-semibold text-slate-700 outline-none focus:ring-0 cursor-pointer"
                            >
                                <option value="">Tüm Türler</option>
                                <option value="uni">Üniversite</option>
                                <option value="mun">Belediye</option>
                                <option value="corp">Şirket</option>
                                <option value="ngo">STK</option>
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
                                <option value="active">Aktif</option>
                                <option value="passive">Pasif</option>
                            </select>
                        </div>

                        <ExcelExportBtn
                            data={prepareExportData()}
                            fileName="kurum_listesi"
                            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                        >
                            <Download size={16} />
                            <span>Dışa Aktar</span>
                        </ExcelExportBtn>
                    </div>
                </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Kurum Bilgileri</th>
                                <th className="px-6 py-4">Tür</th>
                                <th className="px-6 py-4">Konum</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Veriler Yükleniyor...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : institutions.length === 0 ? (
                                <tr><td colSpan="6" className="p-12 text-center text-sm font-medium text-slate-400">Aradığınız kriterlere uygun kurum bulunamadı.</td></tr>
                            ) : (
                                institutions.map((inst) => (
                                    <InstitutionRow
                                        key={inst.id}
                                        inst={inst}
                                        onView={() => handleViewClick(inst)}
                                        onEdit={() => handleEditClick(inst)}
                                        onDelete={() => handleDeleteClick(inst)}
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

            {/* MODALS */}
            <InstitutionModal
                isOpen={isInstModalOpen}
                onClose={() => setIsInstModalOpen(false)}
                institution={selectedInst}
                mode={modalMode}
                onSave={handleSaveInstitution}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`${selectedInst?.name || ''} isimli kurumu devre dışı bırakmak istediğinize emin misiniz?`}
            />

            <InstitutionViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                institutionId={selectedInst?.id}
            />
        </div>
    );
};

const InstitutionRow = ({ inst, onView, onEdit, onDelete }) => {
    const isActive = inst.active;
    
    // Tip bazlı ikon ve renk
    const getIconData = (type) => {
        const icons = {
            uni: { icon: School, color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Üniversite' },
            mun: { icon: Gavel, color: 'bg-purple-50 text-purple-600 border-purple-100', label: 'Belediye' },
            corp: { icon: Briefcase, color: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Şirket' },
            ngo: { icon: HeartHandshake, color: 'bg-green-50 text-green-600 border-green-100', label: 'STK' },
            other: { icon: Building2, color: 'bg-slate-50 text-slate-600 border-slate-100', label: 'Diğer' }
        };
        return icons[type] || icons['other'];
    };

    const { icon: Icon, color, label } = getIconData(inst.type);

    return (
        <tr className="group hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
                <span className="text-xs font-mono text-slate-400">#{inst.id}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${color}`}>
                        <Icon size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 truncate">{inst.name}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {label}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <MapPin size={14} className="text-slate-400" />
                    {inst.locationText}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className={`flex items-center gap-1.5 text-xs font-bold ${isActive ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
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

export default AdminInstitutions;