import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminModal from './AdminModal';
import { platformService } from '../../services/platform.service';
import { RefreshCcw, Download, MapPin, QrCode, AlertCircle } from 'lucide-react';

const QrCodeModal = ({ isOpen, onClose, platform, onRegenerateSuccess }) => {
    const { t } = useTranslation();
    const [qrBase64, setQrBase64] = useState(null);
    const [loading, setLoading] = useState(false);
    const [regenerating, setRegenerating] = useState(false);

    useEffect(() => {
        if (isOpen && platform) {
            loadQrCode();
        } else {
            setQrBase64(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, platform]);

    const loadQrCode = async () => {
        setLoading(true);
        try {
            const response = await platformService.getPlatformQrBase64(platform.id);
            if (response.success && response.base64) {
                setQrBase64(response.base64);
            }
        } catch (error) {
            console.error("QR kod yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!platform) return;
        platformService.downloadPlatformQr(platform.id).catch(err => {
            console.error("İndirme hatası:", err);
            alert("QR Kod indirilirken bir hata oluştu.");
        });
    };

    const handleRegenerate = async () => {
        if (!platform) return;
        
        // Confirmation dialog
        if (!window.confirm("Bu işlem mevcut QR kodu geçersiz kılacak. Yeni QR kod üretmek istediğinize emin misiniz?")) {
            return;
        }

        setRegenerating(true);
        try {
            const response = await platformService.regeneratePlatformQr(platform.id);
            if (response.success) {
                alert("QR kod başarıyla yenilendi.");
                if (onRegenerateSuccess) {
                    onRegenerateSuccess();
                }
                loadQrCode(); // Reload new QR code
            }
        } catch (error) {
            console.error("QR yenileme hatası:", error);
            alert("QR Kod yenilenirken hata oluştu.");
        } finally {
            setRegenerating(false);
        }
    };

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title={platform ? `QR Kod - ${platform.code}` : "QR Kod"}
            width="max-w-md"
        >
            <div className="flex flex-col items-center justify-center space-y-8 py-4">
                
                {/* QR Code Display Area */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative flex items-center justify-center group transition-all hover:scale-[1.02]" style={{ width: 280, height: 280 }}>
                    <div className="absolute inset-0 border-2 border-dashed border-blue-100 rounded-[2rem] m-2 pointer-events-none"></div>
                    {loading ? (
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCcw size={40} className="animate-spin text-blue-600" />
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Yükleniyor</span>
                        </div>
                    ) : qrBase64 ? (
                        <img src={qrBase64} alt={`QR Code for ${platform?.code}`} className="w-full h-full object-contain relative z-10" />
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <AlertCircle size={32} className="text-slate-300" />
                            <span className="text-slate-400 font-bold text-sm">QR Bulunamadı</span>
                        </div>
                    )}
                </div>

                {/* Platform Info Card */}
                {platform && (
                    <div className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center space-y-1">
                        <div className="flex items-center justify-center gap-2">
                            <QrCode size={16} className="text-blue-600" />
                            <p className="text-slate-900 font-black text-lg tracking-tight">{platform.code}</p>
                        </div>
                        <p className="text-slate-500 text-xs font-semibold flex items-center justify-center gap-1.5">
                            <MapPin size={14} className="text-slate-300" />
                            {platform.location?.name || 'Konum belirtilmedi'}
                        </p>
                    </div>
                )}

                {/* Actions Grid */}
                <div className="w-full grid grid-cols-2 gap-4">
                    <button
                        onClick={handleRegenerate}
                        disabled={loading || regenerating}
                        className="px-4 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                    >
                        <RefreshCcw size={16} className={regenerating ? "animate-spin" : ""} />
                        Yenile
                    </button>
                    
                    <button
                        onClick={handleDownload}
                        disabled={loading || regenerating || !qrBase64}
                        className="px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-100 active:scale-95"
                    >
                        <Download size={16} />
                        İndir
                    </button>
                </div>
            </div>
        </AdminModal>
    );
};

export default QrCodeModal;

