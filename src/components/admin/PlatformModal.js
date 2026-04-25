import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminModal from './AdminModal';
import { locationService } from '../../services/location.service';
import { Monitor, Save, X, QrCode, MapPin } from 'lucide-react';

const PlatformModal = ({ isOpen, onClose, platform, mode, onSave }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        code: '',
        qrPayload: '',
        locationId: '',
        active: true
    });

    // Select kutusu için konum listesi
    const [locations, setLocations] = useState([]);

    // Modal açıldığında Konumları Yükle
    useEffect(() => {
        if (isOpen) {
            fetchActiveLocations();
        }
    }, [isOpen]);

    const fetchActiveLocations = async () => {
        try {
            // locationService zaten base.service'i kullanır, bu da domaini dinamik yapar.
            // Sadece 'active' olan konumları istiyoruz
            const result = await locationService.getAllLocations(0, 100, '', '', 'active');
            setLocations(result.content);
        } catch (error) {
            console.error("Konumlar yüklenemedi", error);
        }
    };

    useEffect(() => {
        if (mode === 'edit' && platform) {
            setFormData({
                code: platform.code || '',
                qrPayload: platform.qrPayload || '',
                // Backend'den gelen nesne yapısına göre id'yi alıyoruz
                locationId: platform.location?.id || '',
                active: platform.active
            });
        } else if (mode === 'create') {
            setFormData({
                code: '',
                qrPayload: '',
                locationId: '', // Yeni kayıtta boş başlar
                active: true
            });
        }
    }, [platform, mode, isOpen]);

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

    const title = mode === 'create' ? t('admin.platformModal.title.create') : t('admin.platformModal.title.edit');

    return (
        <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Konum Seçimi */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                        <MapPin size={14} />
                        {t('admin.platformModal.fields.location')}
                    </label>
                    <select
                        name="locationId"
                        value={formData.locationId}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none transition-all cursor-pointer shadow-sm"
                    >
                        <option value="">{t('admin.platformModal.placeholders.selectLocation')}</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Platform Kodu */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                            {t('admin.platformModal.fields.code')}
                        </label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder={t('admin.platformModal.placeholders.code')}
                        />
                    </div>
                    {/* QR Payload */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                            <QrCode size={14} />
                            {t('admin.platformModal.fields.qr')}
                        </label>
                        <input
                            type="text"
                            name="qrPayload"
                            value={formData.qrPayload}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder={t('admin.platformModal.placeholders.qr')}
                        />
                    </div>
                </div>

                {/* Durum */}
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                        {t('admin.platformModal.fields.status')}
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

export default PlatformModal;