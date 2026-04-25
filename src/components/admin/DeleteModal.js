import React from 'react';
import { useTranslation } from 'react-i18next';
import AdminModal from './AdminModal';
import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const { t } = useTranslation();
    const modalTitle = title || t('admin.modals.delete.title');

    return (
        <AdminModal isOpen={isOpen} onClose={onClose} title={modalTitle} width="max-w-md">
            <div className="flex flex-col items-center text-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-2">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>

                <div className="space-y-2">
                    <h4 className="text-slate-900 text-xl font-bold">{t('admin.modals.delete.areYouSure')}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                        {message || t('admin.modals.delete.defaultMessage')}
                    </p>
                </div>

                <div className="flex gap-3 w-full mt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-100 transition-all active:scale-95"
                    >
                        {t('admin.modals.delete.confirm')}
                    </button>
                </div>
            </div>
        </AdminModal>
    );
};

export default DeleteModal;