import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { locationService } from '../../services/location.service';
import { platformService } from '../../services/platform.service';
import LocationModal from '../../components/admin/LocationModal';
import DeleteModal from '../../components/admin/DeleteModal';
import ExcelExportBtn from '../../components/common/ExcelExportBtn';
import { 
    Search, 
    Filter, 
    MapPin, 
    Plus, 
    Edit2, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    School,
    TreePine,
    Train,
    Square,
    ShoppingBag,
    Activity,
    Download,
    LayoutList,
    Map as MapIcon
} from 'lucide-react';
import LeafletMapComponent from '../../components/common/LeafletMapComponent';

const AdminLocations = () => {
    const { t } = useTranslation();
    // --- STATE ---
    const [locations, setLocations] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtre & Sayfalama
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // active, passive

    // --- MODAL STATE ---
    const [selectedLoc, setSelectedLoc] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const [isLocModalOpen, setIsLocModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('map'); // 'map' is now default

    // Verileri Çekme
    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await locationService.getAllLocations(page, size, searchTerm, typeFilter, statusFilter);
            setLocations(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error("Konumlar yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllPlatforms = async () => {
        try {
            const res = await platformService.getAllPlatforms(0, 1000, '', '', 'active');
            setPlatforms(res.content);
        } catch (error) {
            console.error("Platformlar yüklenemedi:", error);
        }
    };

    useEffect(() => {
        fetchLocations();
        fetchAllPlatforms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, typeFilter, statusFilter]);

    // Handler'lar
    const handleSearch = () => { if (page === 0) fetchLocations(); else setPage(0); };
    const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

    const handleCreateClick = () => {
        setSelectedLoc(null);
        setModalMode('create');
        setIsLocModalOpen(true);
    };

    const handleEditClick = (loc) => {
        setSelectedLoc(loc);
        setModalMode('edit');
        setIsLocModalOpen(true);
    };

    const handleDeleteClick = (loc) => {
        setSelectedLoc(loc);
        setIsDeleteModalOpen(true);
    };

    const handleSaveLocation = async (data) => {
        try {
            if (modalMode === 'create') {
                await locationService.createLocation(data);
            } else {
                await locationService.updateLocation(selectedLoc.id, data);
            }
            setIsLocModalOpen(false);
            fetchLocations();
        } catch (error) {
            console.error("Kaydetme hatası:", error);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await locationService.deleteLocation(selectedLoc.id);
            setIsDeleteModalOpen(false);
            fetchLocations();
        } catch (error) {
            console.error("Silme hatası:", error);
        }
    };

    // Excel Verisi Hazırlama
    const prepareExportData = () => {
        return locations.map(loc => ({
            ID: loc.id,
            Konum: loc.name,
            Kurum: loc.institutionName || '-',
            Tür: loc.type,
            Adres: loc.addressText,
            Enlem: loc.lat,
            Boylam: loc.lng,
            Durum: loc.active ? 'Aktif' : 'Pasif'
        }));
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Konum Yönetimi</h1>
                    <p className="text-sm text-slate-500 mt-1">Geri dönüşüm noktalarını ve istasyonları yönetin.</p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Yeni Konum Ekle</span>
                </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit shadow-sm">
                <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        viewMode === 'list' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <LayoutList size={16} />
                    <span>Liste Görünümü</span>
                </button>
                <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        viewMode === 'map' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <MapIcon size={16} />
                    <span>Harita Görünümü</span>
                </button>
            </div>

            {/* FILTER BAR */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all placeholder-slate-400"
                            placeholder="Konum adı veya adres ile ara..."
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
                                <option value="university">Üniversite</option>
                                <option value="park">Park</option>
                                <option value="metro">Metro</option>
                                <option value="square">Meydan</option>
                                <option value="mall">AVM</option>
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
                            fileName="konum_listesi"
                            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                        >
                            <Download size={16} />
                            <span>Dışa Aktar</span>
                        </ExcelExportBtn>
                    </div>
                </div>
            </div>

            {/* CONTENT (Table or Map) */}
            {viewMode === 'list' ? (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Konum Bilgileri</th>
                                    <th className="px-6 py-4">Kurum</th>
                                    <th className="px-6 py-4">Tür</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">Adres</th>
                                    <th className="px-6 py-4 text-center hidden xl:table-cell">Koordinatlar</th>
                                    <th className="px-6 py-4">Durum</th>
                                    <th className="px-6 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Veriler Yükleniyor...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : locations.length === 0 ? (
                                    <tr><td colSpan="8" className="p-12 text-center text-sm font-medium text-slate-400">Aradığınız kriterlere uygun konum bulunamadı.</td></tr>
                                ) : (
                                    locations.map((loc) => (
                                        <LocationRow
                                            key={loc.id}
                                            loc={loc}
                                            onEdit={() => handleEditClick(loc)}
                                            onDelete={() => handleDeleteClick(loc)}
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
            ) : (
                <LeafletMapComponent 
                    locations={locations} 
                    platforms={platforms}
                />
            )}

            {/* MODALS */}
            <LocationModal
                isOpen={isLocModalOpen}
                onClose={() => setIsLocModalOpen(false)}
                location={selectedLoc}
                mode={modalMode}
                onSave={handleSaveLocation}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`${selectedLoc?.name || ''} isimli konumu devre dışı bırakmak istediğinize emin misiniz?`}
            />
        </div>
    );
};

const LocationRow = ({ loc, onEdit, onDelete }) => {
    // Aktiflik kontrolü
    const isActive = loc.active;
    
    // Tip bazlı ikon
    const getIconData = (type) => {
        const icons = {
            university: { icon: School, color: 'bg-blue-50 text-blue-600', label: 'Üniversite' },
            park: { icon: TreePine, color: 'bg-green-50 text-green-600', label: 'Park' },
            metro: { icon: Train, color: 'bg-indigo-50 text-indigo-600', label: 'Metro' },
            square: { icon: Square, color: 'bg-amber-50 text-amber-600', label: 'Meydan' },
            mall: { icon: ShoppingBag, color: 'bg-rose-50 text-rose-600', label: 'AVM' },
            other: { icon: MapPin, color: 'bg-slate-50 text-slate-600', label: 'Diğer' }
        };
        return icons[type] || icons['other'];
    };

    const { icon: Icon, color, label } = getIconData(loc.type);

    return (
        <tr className="group hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4">
                <span className="text-xs font-mono text-slate-400">#{loc.id}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-transparent transition-all ${color}`}>
                        <Icon size={18} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 truncate">{loc.name}</span>
                        <span className="text-[10px] text-slate-400 lg:hidden truncate w-32">{loc.addressText}</span>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <span className="text-sm font-medium text-slate-700">
                    {loc.institutionName || '-'}
                </span>
            </td>

            <td className="px-6 py-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {label}
                </span>
            </td>
            <td className="px-6 py-4 text-slate-500 text-xs hidden lg:table-cell max-w-xs truncate" title={loc.addressText}>
                {loc.addressText}
            </td>
            <td className="px-6 py-4 text-center font-mono text-slate-400 text-[10px] hidden xl:table-cell">
                <div className="flex flex-col">
                    <span>{loc.lat?.toFixed(4)}</span>
                    <span className="text-blue-400">{loc.lng?.toFixed(4)}</span>
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

export default AdminLocations;