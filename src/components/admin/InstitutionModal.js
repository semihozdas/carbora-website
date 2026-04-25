import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminModal from './AdminModal';
import { Building2, Save, X } from 'lucide-react';

const InstitutionModal = ({ isOpen, onClose, institution, mode, onSave }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        locationText: '',
        type: 'uni', // Varsayılan tip
        active: true
    });

    useEffect(() => {
        if (mode === 'edit' && institution) {
            setFormData({
                name: institution.name || '',
                locationText: institution.locationText || '',
                type: institution.type || 'uni',
                active: institution.active
            });
        } else if (mode === 'create') {
            setFormData({
                name: '',
                locationText: '',
                type: 'uni',
                active: true
            });
        }
    }, [institution, mode, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            active: String(formData.active) === 'true'
        });
    };

    const title = mode === 'create' ? t('admin.institutionModal.title.create') : t('admin.institutionModal.title.edit');

    return (
        <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Kurum Adı */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                        {t('admin.institutionModal.fields.name')}
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300"
                        placeholder={t('admin.institutionModal.placeholders.name')}
                    />
                </div>

                {/* Konum Metni (Şehir/Adres) */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                        {t('admin.institutionModal.fields.location')}
                    </label>
                    <input
                        type="text"
                        name="locationText"
                        value={formData.locationText}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300"
                        placeholder={t('admin.institutionModal.placeholders.location')}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Kurum Tipi */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                            {t('admin.institutionModal.fields.type')}
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer"
                        >
                            <option value="uni">{t('admin.institutionTypes.uni')}</option>
                            <option value="mun">{t('admin.institutionTypes.mun')}</option>
                            <option value="corp">{t('admin.institutionTypes.corp')}</option>
                            <option value="ngo">{t('admin.institutionTypes.ngo')}</option>
                            <option value="other">{t('admin.institutionTypes.other')}</option>
                        </select>
                    </div>

                    {/* Durum */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                            {t('admin.institutionModal.fields.status')}
                        </label>
                        <select
                            name="active"
                            value={formData.active.toString()}
                            onChange={handleChange}
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer ${formData.active ? 'border-slate-200 text-emerald-600' : 'border-rose-100 text-rose-600'}`}
                        >
                            <option value="true">{t('admin.status.active')}</option>
                            <option value="false">{t('admin.status.passive')}</option>
                        </select>
                    </div>
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

export default InstitutionModal;