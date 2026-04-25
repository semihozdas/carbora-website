import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminModal from './AdminModal';
import { institutionService } from '../../services/institution.service';
import { MapPin, Save, X, Navigation, Building2 } from 'lucide-react';

const LocationModal = ({ isOpen, onClose, location, mode, onSave }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        addressText: '',
        lat: '',
        lng: '',
        institutionId: '', // YENİ: Kurum ID
        parentId: null,
        active: true
    });

    const [institutions, setInstitutions] = useState([]); // Kurum listesi

    // Modal açıldığında Aktif Kurumları Getir
    useEffect(() => {
        if (isOpen) {
            fetchInstitutions();
        }
    }, [isOpen]);

    const fetchInstitutions = async () => {
        try {
            // Sadece aktif kurumları getirir
            const data = await institutionService.getAllActiveInstitutions();
            setInstitutions(data);
        } catch (error) {
            console.error("Kurumlar yüklenemedi", error);
        }
    };

    useEffect(() => {
        if (mode === 'edit' && location) {
            setFormData({
                name: location.name || '',
                type: location.type || '',
                addressText: location.addressText || '',
                lat: location.lat || '',
                lng: location.lng || '',
                // Backend LocationResponse içinde 'institutionId' dönüyor
                institutionId: location.institutionId || '',
                active: location.active
            });
        } else if (mode === 'create') {
            setFormData({
                name: '',
                type: 'university',
                addressText: '',
                lat: '',
                lng: '',
                institutionId: '', // Yeni kayıtta boş
                active: true
            });
        }
    }, [location, mode, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            lat: formData.lat ? parseFloat(formData.lat) : null,
            lng: formData.lng ? parseFloat(formData.lng) : null,
            institutionId: formData.institutionId ? Number(formData.institutionId) : null, // ID'yi number yapıyoruz
            active: String(formData.active) === 'true'
        });
    };

    const title = mode === 'create' ? t('admin.locationModal.title.create') : t('admin.locationModal.title.edit');

    return (
        <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* --- KURUM SEÇİMİ --- */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                        <Building2 size={14} />
                        {t('admin.locationModal.fields.institution')}
                    </label>
                    <select
                        name="institutionId"
                        value={formData.institutionId}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer shadow-sm"
                    >
                        <option value="">{t('admin.locationModal.placeholders.selectInstitution')}</option>
                        {institutions.map(inst => (
                            <option key={inst.id} value={inst.id}>
                                {inst.name} ({inst.type})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                            {t('admin.locationModal.fields.type')}
                        </label>
                        <select 
                            name="type" 
                            value={formData.type} 
                            onChange={handleChange} 
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer shadow-sm"
                        >
                            <option value="university">{t('admin.locationTypes.university')}</option>
                            <option value="park">{t('admin.locationTypes.park')}</option>
                            <option value="metro">{t('admin.locationModal.typeOptions.metroStop')}</option>
                            <option value="square">{t('admin.locationTypes.square')}</option>
                            <option value="mall">{t('admin.locationTypes.mall')}</option>
                            <option value="other">{t('admin.locationTypes.other')}</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                            {t('admin.locationModal.fields.name')}
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder={t('admin.locationModal.placeholders.name')} 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                        <MapPin size={14} />
                        {t('admin.locationModal.fields.address')}
                    </label>
                    <textarea 
                        name="addressText" 
                        value={formData.addressText} 
                        onChange={handleChange} 
                        rows="3"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:bg-white focus:border-blue-600 outline-none transition-all resize-none placeholder:text-slate-300 shadow-sm"
                        placeholder={t('admin.locationModal.placeholders.address')} 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                            <Navigation size={14} className="rotate-45" />
                            {t('admin.locationModal.fields.lat')}
                        </label>
                        <input 
                            type="number" 
                            step="any" 
                            name="lat" 
                            value={formData.lat} 
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder={t('admin.locationModal.placeholders.lat')} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                            <Navigation size={14} className="rotate-45" />
                            {t('admin.locationModal.fields.lng')}
                        </label>
                        <input 
                            type="number" 
                            step="any" 
                            name="lng" 
                            value={formData.lng} 
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder={t('admin.locationModal.placeholders.lng')} 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                        {t('admin.locationModal.fields.status')}
                    </label>
                    <select 
                        name="active" 
                        value={formData.active.toString()} 
                        onChange={handleChange}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer shadow-sm ${formData.active ? 'border-slate-200 text-emerald-600' : 'border-rose-100 text-rose-600'}`}
                    >
                        <option value="true">{t('admin.status.active')}</option>
                        <option value="false">{t('admin.status.passive')}</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2"
                    >
                        <X size={16} />
                        {t('common.cancel')}
                    </button>
                    <button 
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Save size={16} />
                        {mode === 'create' ? t('admin.commonActions.create') : t('admin.commonActions.save')}
                    </button>
                </div>
            </form>
        </AdminModal>
    );
};

export default LocationModal;