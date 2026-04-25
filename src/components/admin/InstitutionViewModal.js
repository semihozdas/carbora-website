import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { institutionService } from '../../services/institution.service';
import { Building2, MapPin, QrCode, X, Activity, Tag, ChevronDown, Share2, Map, Recycle, AlertCircle } from 'lucide-react';

const InstitutionViewModal = ({ isOpen, onClose, institutionId }) => {
    const { t } = useTranslation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hangi lokasyonların akordeonunun açık olduğunu tutar
    const [expandedLocations, setExpandedLocations] = useState({});

    useEffect(() => {
        const fetchHierarchy = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await institutionService.getInstitutionHierarchy(institutionId);
                setData(response);

                // İlk lokasyonu varsayılan olarak açık yap
                if (response.locations && response.locations.length > 0) {
                    setExpandedLocations({ [response.locations[0].id]: true });
                }
            } catch (err) {
                console.error("Hiyerarşi çekilirken hata:", err);
                setError(t('admin.common.genericError', 'Veriler yüklenirken bir hata oluştu.'));
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && institutionId) {
            fetchHierarchy();
        } else {
            setData(null);
            setExpandedLocations({});
        }
    }, [isOpen, institutionId, t]);

    const toggleLocation = (locId) => {
        setExpandedLocations(prev => ({
            ...prev,
            [locId]: !prev[locId]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>

            <div className="relative bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* MODAL HEADER */}
                <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                {t('admin.institutions.viewTitle', 'Kurum Detayları')}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">{t('admin.institutions.viewSubtitle', 'Sisteme kayıtlı kurum, lokasyon ve platform ağacı.')}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95 shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* MODAL BODY */}
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                            <span className="text-slate-400 font-black text-xs uppercase tracking-widest">{t('admin.common.loading', 'Yükleniyor...')}</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-rose-500 bg-rose-50 rounded-3xl border border-rose-100 p-8 flex flex-col items-center gap-3">
                            <AlertCircle size={40} className="text-rose-500" />
                            <p className="font-bold">{error}</p>
                        </div>
                    ) : data ? (
                        <div className="space-y-8">

                            {/* Kurum Bilgisi Kartı */}
                            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-blue-500/10"></div>
                                <div className="space-y-4 relative z-10">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{data.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${data.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {data.active ? t('admin.status.active', 'Aktif') : t('admin.status.passive', 'Pasif')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-slate-500 text-xs font-bold shadow-sm">
                                            <MapPin size={14} className="text-blue-500" />
                                            <span>{data.locationText || t('admin.institutions.noLocation', 'Konum belirtilmemiş')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-slate-500 text-xs font-bold shadow-sm">
                                            <Tag size={14} className="text-blue-500" />
                                            <span className="uppercase">{t(`admin.institutionTypes.${data.type}`, { defaultValue: data.type })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative z-10 w-full md:w-auto">
                                    <div className="flex-1 md:flex-none bg-white border border-slate-100 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[120px] shadow-sm">
                                        <span className="text-3xl font-black text-slate-900 tracking-tighter">{data.locations?.length || 0}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('admin.nav.locations', 'Lokasyon')}</span>
                                    </div>
                                    <div className="flex-1 md:flex-none bg-white border border-slate-100 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[120px] shadow-sm">
                                        <span className="text-3xl font-black text-blue-600 tracking-tighter">
                                            {data.locations?.reduce((total, loc) => total + (loc.platforms?.length || 0), 0) || 0}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('admin.nav.platforms', 'Platform')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lokasyonlar Listesi */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                        <Share2 size={24} className="text-blue-600" />
                                        {t('admin.institutions.connectedLocations', 'Bağlı Lokasyonlar')}
                                    </h4>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                        {data.locations?.length || 0} Toplam
                                    </span>
                                </div>

                                {data.locations && data.locations.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.locations.map(loc => (
                                            <div key={loc.id} className="group bg-white border border-slate-200 rounded-3xl overflow-hidden transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5">
                                                {/* Lokasyon Header */}
                                                <button
                                                    onClick={() => toggleLocation(loc.id)}
                                                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors text-left"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedLocations[loc.id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100'}`}>
                                                            <MapPin size={24} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-3">
                                                                <h5 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                                                    {loc.name}
                                                                </h5>
                                                                {!loc.active && <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg border border-rose-100 uppercase tracking-widest">{t('admin.status.passive', 'Pasif')}</span>}
                                                            </div>
                                                            <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5">
                                                                <Map size={14} className="text-slate-300" />
                                                                {loc.addressText || t('admin.institutions.noAddress', 'Adres yok')} <span className="text-slate-200">•</span> {loc.type}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="hidden sm:flex flex-col items-end">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('admin.nav.platforms', 'Platform')}</span>
                                                            <span className="text-sm font-black text-slate-900">{loc.platforms?.length || 0} Adet</span>
                                                        </div>
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 transition-all duration-300 ${expandedLocations[loc.id] ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}>
                                                            <ChevronDown size={20} />
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* Platformlar (Accordion Body) */}
                                                {expandedLocations[loc.id] && (
                                                    <div className="border-t border-slate-100 bg-slate-50/50 p-6 animate-in slide-in-from-top-4 duration-300">
                                                        {loc.platforms && loc.platforms.length > 0 ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {loc.platforms.map(plat => (
                                                                    <div key={plat.id} className="group/plat flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors ${plat.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                                                <Recycle size={20} />
                                                                            </div>
                                                                            <div className="space-y-0.5">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-base font-black text-slate-900 tracking-tighter font-mono">{plat.code}</span>
                                                                                    {plat.active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
                                                                                </div>
                                                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-100 w-fit">
                                                                                    <QrCode size={10} className="text-slate-400" />
                                                                                    <span className="text-[10px] text-slate-500 font-black font-mono tracking-tight">{plat.qrPayload}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right space-y-0.5">
                                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">{t('admin.platforms.table.totalWeight', 'Toplanan')}</span>
                                                                            <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl inline-block border border-slate-100">
                                                                                {plat.totalWeightGram.toLocaleString()}g
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-12 text-slate-400 bg-white border border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center gap-2">
                                                                <Share2 size={32} className="text-slate-200" />
                                                                <p className="font-bold text-sm tracking-tight">{t('admin.institutions.noPlatformFound', 'Bu lokasyona bağlı platform bulunmuyor.')}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-[2rem] bg-slate-50 flex flex-col items-center gap-3">
                                        <Share2 size={40} className="text-slate-200" />
                                        <p className="font-bold tracking-tight">{t('admin.institutions.noLocationFound', 'Bu kuruma bağlı hiçbir lokasyon bulunmuyor.')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default InstitutionViewModal;