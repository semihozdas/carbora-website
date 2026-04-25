import React, { useState, useEffect } from 'react';
import { exchangeService } from '../../services/exchange.service';
import { 
    Clock, 
    Banknote, 
    Droplets, 
    CheckCircle, 
    XCircle, 
    AlertTriangle,
    ArrowLeftRight,
    RefreshCw,
    User,
    Coins,
    ShieldAlert
} from 'lucide-react';

const AdminExchange = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [poolInfo, setPoolInfo] = useState(0);

    // Reddetme Modalı State'i
    const [rejectModal, setRejectModal] = useState({
        isOpen: false,
        requestId: null,
        reason: '',
        returnPoints: true // Varsayılan olarak puanları iade et
    });

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reqData, poolData] = await Promise.all([
                exchangeService.getPendingRequests(),
                exchangeService.getPoolInfo()
            ]);
            setRequests(reqData || []);
            setPoolInfo(poolData?.availableCo2 || 0);
        } catch (error) {
            console.error("Borsa verileri çekilemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- ONAYLAMA İŞLEMİ ---
    const handleApprove = async (id, amount) => {
        if (!window.confirm(`Bu talebi onaylamak ve kullanıcıya ödeme yapmak istediğinize emin misiniz?\n(${amount} TL ödenecek ve puanlar silinip havuza CO2 eklenecek)`)) {
            return;
        }

        setIsProcessing(true);
        try {
            await exchangeService.approveRequest(id);
            fetchData(); // Listeyi yenile
        } catch (error) {
            alert(error.message || "Onaylama işlemi başarısız.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- REDDETME İŞLEMİ ---
    const handleRejectSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await exchangeService.rejectRequest(rejectModal.requestId, rejectModal.reason, rejectModal.returnPoints);
            setRejectModal({ isOpen: false, requestId: null, reason: '', returnPoints: true });
            fetchData(); // Listeyi yenile
        } catch (error) {
            alert(error.message || "Reddetme işlemi başarısız.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Özet İstatistikleri
    const totalPendingMoney = requests.reduce((acc, curr) => acc + curr.moneyAmount, 0);

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Borsa ve Puan Yönetimi</h1>
                    <p className="text-sm text-slate-500 mt-1">Kullanıcıların puanlarını nakde çevirme taleplerini yönetin.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-slate-50 active:scale-95"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    <span>Yenile</span>
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Bekleyen İşlem</p>
                        <h3 className="text-slate-900 text-2xl font-black">{requests.length} <span className="text-sm font-medium text-slate-400">adet</span></h3>
                    </div>
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Clock size={28} />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ödenecek Toplam</p>
                        <h3 className="text-slate-900 text-2xl font-black">{totalPendingMoney.toFixed(2)} <span className="text-sm font-medium text-slate-400">₺</span></h3>
                    </div>
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Banknote size={28} />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">CO2 Havuzu</p>
                        <h3 className="text-emerald-600 text-2xl font-black">{poolInfo.toLocaleString('tr-TR')} <span className="text-sm font-medium text-slate-400">kg</span></h3>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <Droplets size={28} />
                    </div>
                </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <ArrowLeftRight size={20} className="text-blue-600" />
                        Onay Bekleyen Puan Satışları
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-8 py-4">Tarih</th>
                                <th className="px-8 py-4">Kullanıcı Bilgileri</th>
                                <th className="px-8 py-4">Miktar</th>
                                <th className="px-8 py-4">CO2 Karşılığı</th>
                                <th className="px-8 py-4 text-right">Ödenecek Tutar</th>
                                <th className="px-8 py-4 text-center">İşlemler</th>
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
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="6" className="p-12 text-center text-sm font-medium text-slate-400">Onay bekleyen hiçbir talep bulunmuyor.</td></tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5 text-slate-500 text-sm whitespace-nowrap">
                                            {new Date(req.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{req.user?.name} {req.user?.surname}</span>
                                                    <span className="text-xs text-slate-400">{req.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                                                <Coins size={14} className="text-amber-500" />
                                                {req.pointsAmount} Puan
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-emerald-600 font-bold">+{req.co2Equivalent} kg CO2</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="text-lg font-black text-slate-900">{req.moneyAmount} ₺</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(req.id, req.moneyAmount)}
                                                    disabled={isProcessing}
                                                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all font-bold text-xs disabled:opacity-50 shadow-lg shadow-emerald-100"
                                                >
                                                    <CheckCircle size={14} /> Onayla
                                                </button>
                                                <button
                                                    onClick={() => setRejectModal({ isOpen: true, requestId: req.id, reason: '', returnPoints: true })}
                                                    disabled={isProcessing}
                                                    className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl transition-all font-bold text-xs disabled:opacity-50"
                                                >
                                                    <XCircle size={14} /> Reddet
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* REDDETME MODALI */}
            {rejectModal.isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isProcessing && setRejectModal({ ...rejectModal, isOpen: false })}></div>

                    <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                                <AlertTriangle size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Talebi Reddet</h2>
                                <p className="text-sm text-slate-500 mt-1">Lütfen reddetme nedenini ve puan iade politikasını seçin.</p>
                            </div>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reddetme Nedeni</label>
                                <textarea
                                    value={rejectModal.reason}
                                    onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-900 outline-none focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-50 transition-all resize-none h-28 placeholder-slate-400"
                                    placeholder="Örn: Banka IBAN bilginiz eksik, Puanlarınızda tutarsızlık var vb."
                                ></textarea>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <ShieldAlert size={14} />
                                    Puan İade Politikası
                                </h4>

                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="pointsAction"
                                        checked={rejectModal.returnPoints === true}
                                        onChange={() => setRejectModal({ ...rejectModal, returnPoints: true })}
                                        className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Puanları İade Et</span>
                                        <span className="text-[10px] text-slate-500 leading-tight mt-0.5">Eksik bilgi durumlarında seçin. Puanlar kullanıcıya geri döner.</span>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="pointsAction"
                                        checked={rejectModal.returnPoints === false}
                                        onChange={() => setRejectModal({ ...rejectModal, returnPoints: false })}
                                        className="mt-1 w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-red-600 group-hover:text-red-700 transition-colors">Puanları Sil (Ceza)</span>
                                        <span className="text-[10px] text-slate-500 leading-tight mt-0.5">Hile tespitinde seçin. Puanlar sistemden kalıcı olarak silinir.</span>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : 'Talebi Reddet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminExchange;