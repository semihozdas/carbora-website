import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const AdminModal = ({ isOpen, onClose, title, children, width = "max-w-2xl" }) => {
    // ESC tuşu ile kapatma
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            {/* Modal Content */}
            <div className={`relative w-full ${width} bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200`}>

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-all p-2 rounded-xl hover:bg-slate-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminModal;