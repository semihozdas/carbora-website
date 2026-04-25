import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminModal from './AdminModal';
import { User, Save, X, Mail, Shield, Activity, Award, Lock } from 'lucide-react';

const UserDetailModal = ({ isOpen, onClose, user, mode, onSave }) => {
    const { t } = useTranslation();
    // Form state
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        surname: '',
        email: '',
        password: '', // Create modunda lazım
        userPoint: 0, // Puan alanı eklendi
        role: 'ROLE_USER',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (mode === 'edit' || mode === 'view') {
            // Düzenleme/Görüntüleme modu: Mevcut veriyi doldur
            if (user) {
                setFormData({
                    id: user.id,
                    name: user.name || '',
                    surname: user.surname || '',
                    email: user.email || '',
                    password: '', // Edit modunda şifre gösterilmez/değiştirilmez (genelde ayrı işlem olur)
                    userPoint: user.userPoint || 0,
                    role: user.role || 'ROLE_USER',
                    status: user.status || 'ACTIVE'
                });
            }
        } else if (mode === 'create') {
            // Yeni Ekleme modu: Formu temizle
            setFormData({
                id: '',
                name: '',
                surname: '',
                email: '',
                password: '',
                userPoint: 0,
                role: 'ROLE_USER',
                status: 'ACTIVE'
            });
        }
    }, [user, mode, isOpen]);

    const isView = mode === 'view';
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    // Modal Başlığı
    let titleText = t('admin.userModal.title.view');
    if (isEdit) titleText = t('admin.userModal.title.edit');
    if (isCreate) titleText = t('admin.userModal.title.create');

    const title = (
        <div className="flex items-center gap-3">
            <span>{titleText}</span>
            {isEdit && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{t('admin.userModal.badges.editing')}</span>
                </div>
            )}
            {isCreate && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{t('admin.userModal.badges.new')}</span>
                </div>
            )}
        </div>
    );

    return (
        <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Profil Özeti */}
                {!isCreate && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-100">
                            {formData.name?.charAt(0)}{formData.surname?.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-slate-900 font-bold text-lg leading-tight">{formData.name} {formData.surname}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{t('admin.userModal.idLabel')}</span>
                                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg tracking-widest">#{formData.id}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* İsim */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                            <User size={14} />
                            {t('admin.userModal.fields.name')}
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            readOnly={isView} 
                            required
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-semibold transition-all outline-none shadow-sm ${!isView ? 'border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600' : 'border-transparent bg-slate-100 text-slate-500 cursor-not-allowed'}`} 
                        />
                    </div>

                    {/* Soyisim */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                            <User size={14} />
                            {t('admin.userModal.fields.surname')}
                        </label>
                        <input 
                            type="text" 
                            name="surname" 
                            value={formData.surname} 
                            onChange={handleChange} 
                            readOnly={isView} 
                            required
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-semibold transition-all outline-none shadow-sm ${!isView ? 'border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600' : 'border-transparent bg-slate-100 text-slate-500 cursor-not-allowed'}`} 
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                            <Mail size={14} />
                            {t('admin.userModal.fields.email')}
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            readOnly={!isCreate} 
                            required
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-semibold transition-all outline-none shadow-sm ${isCreate ? 'border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600' : 'border-transparent bg-slate-100 text-slate-500 cursor-not-allowed'}`} 
                        />
                    </div>

                    {/* Şifre (Sadece Create modunda) */}
                    {isCreate && (
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                                <Lock size={14} />
                                {t('admin.userModal.fields.password')}
                            </label>
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required={isCreate}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm" 
                            />
                        </div>
                    )}

                    {/* Rol */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                            <Shield size={14} />
                            {t('admin.userModal.fields.role')}
                        </label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange} 
                            disabled={isView}
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold transition-all outline-none cursor-pointer shadow-sm ${!isView ? 'border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600' : 'border-transparent bg-slate-100 text-slate-500 cursor-not-allowed appearance-none'}`}
                        >
                            <option value="ROLE_USER">{t('admin.roles.user')}</option>
                            <option value="ROLE_ADMIN">{t('admin.roles.admin')}</option>
                        </select>
                    </div>

                    {/* Durum */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                            <Activity size={14} />
                            {t('admin.userModal.fields.status')}
                        </label>
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            disabled={isView}
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold transition-all outline-none cursor-pointer shadow-sm ${!isView ? (formData.status === 'ACTIVE' ? 'border-slate-200 text-emerald-600 focus:border-blue-600' : 'border-rose-100 text-rose-600 focus:border-blue-600') : 'border-transparent bg-slate-100 text-slate-500 cursor-not-allowed appearance-none'}`}
                        >
                            <option value="ACTIVE">{t('admin.status.active')}</option>
                            <option value="PASSIVE">{t('admin.status.passive')}</option>
                        </select>
                    </div>

                    {/* Puan */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                            <Award size={14} />
                            {t('admin.userModal.fields.points')}
                        </label>
                        <input 
                            type="number" 
                            name="userPoint" 
                            value={formData.userPoint} 
                            onChange={handleChange} 
                            readOnly={isView}
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold transition-all outline-none shadow-sm ${!isView ? 'border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600' : 'border-transparent bg-slate-100 text-slate-500 cursor-not-allowed'}`} 
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2"
                    >
                        <X size={16} />
                        {t('admin.common.close')}
                    </button>
                    {!isView && (
                        <button 
                            type="submit"
                            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Save size={16} />
                            {isCreate ? t('admin.userModal.actions.create') : t('admin.userModal.actions.save')}
                        </button>
                    )}
                </div>
            </form>
        </AdminModal>
    );
};

export default UserDetailModal;