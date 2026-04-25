import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../services/user.service';
import { exchangeService } from '../services/exchange.service';
import { 
    TrendingUp, 
    History, 
    Wallet, 
    Package, 
    Smartphone, 
    X,
    Trophy,
    Coffee,
    Film,
    Gamepad2,
    Leaf,
    ChevronRight,
    ArrowUpRight,
    Clock
} from 'lucide-react';

const Dashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        name: '',
        currentPoints: 0,
        lockedPoints: 0,
        carbonReduction: 0,
        globalRank: '-',
        activities: []
    });

    const [sellRequests, setSellRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [sellAmount, setSellAmount] = useState('100');
    const [isSelling, setIsSelling] = useState(false);
    const [sellMessage, setSellMessage] = useState({ type: '', text: '' });

    const rewardOptions = [
        { id: 'cash', type: 'CASH', title: 'Nakit Çekim', icon: Wallet, desc: '100 Puan = 10 TL', cost: null, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'coffee', type: 'ITEM', title: 'Kahve Kuponu', icon: Coffee, desc: 'Starbucks Orta Boy', cost: 400, color: 'text-orange-600', bg: 'bg-orange-50' },
        { id: 'ticket', type: 'ITEM', title: 'Sinema Bileti', icon: Film, desc: 'Tüm Salonlarda Geçerli', cost: 800, color: 'text-purple-600', bg: 'bg-purple-50' },
        { id: 'discount1', type: 'ITEM', title: 'Oyun Kodu', icon: Gamepad2, desc: '%20 İndirim Çeki', cost: 200, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];
    const [selectedReward, setSelectedReward] = useState(rewardOptions[0]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const data = await userService.getDashboardStats();
            const rawActivities = data.activities || [];

            const formattedActivities = rawActivities.map(item => {
                let finalDate = 'Tarih Yok';
                if (item.createdAt) finalDate = new Date(item.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                const rawType = item.wasteType || item.type || 'default';
                return {
                    id: item.id || Math.random(),
                    date: finalDate,
                    type: rawType.toLowerCase(),
                    label: item.wasteType || item.label || 'Belirsiz',
                    status: item.status || 'APPROVED',
                    points: item.points !== undefined ? item.points : 0
                };
            });

            setStats({
                ...data,
                activities: formattedActivities,
                lockedPoints: data.lockedPoints || 0
            });

            const requests = await exchangeService.getMySellRequests();
            setSellRequests(requests || []);

        } catch (error) {
            console.error('Veriler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAmountChange = (e) => {
        let val = e.target.value;
        if (val === '0') { setSellAmount('0'); return; }
        val = val.replace(/^0+/, '');
        if (val === '') val = '0';
        setSellAmount(val);
    };

    const handleSellSubmit = async (e) => {
        e.preventDefault();
        setSellMessage({ type: '', text: '' });
        const numericAmount = Number(sellAmount);
        const finalAmount = selectedReward.type === 'CASH' ? numericAmount : selectedReward.cost;

        if (selectedReward.type === 'CASH' && (finalAmount < 100 || finalAmount % 100 !== 0)) {
            setSellMessage({ type: 'error', text: 'Nakit çekimler 100 ve katları olmalıdır.' });
            return;
        }

        if (finalAmount > stats.currentPoints) {
            setSellMessage({ type: 'error', text: 'Yetersiz bakiye!' });
            return;
        }

        setIsSelling(true);
        try {
            const response = await exchangeService.sellPoints(finalAmount);
            setSellMessage({ type: 'success', text: response.message || 'Talebiniz başarıyla oluşturuldu.' });
            fetchDashboardData();
            setTimeout(() => {
                setIsSellModalOpen(false);
                setSellMessage({ type: '', text: '' });
                setSellAmount('100');
            }, 2000);
        } catch (err) {
            setSellMessage({ type: 'error', text: err.message || 'İşlem başarısız.' });
        } finally {
            setIsSelling(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED': return <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">Onaylandı</span>;
            case 'REJECTED': return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">Reddedildi</span>;
            default: return <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">Beklemede</span>;
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-gray-500 font-medium">Yükleniyor...</span>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#f8fafc] pt-24 pb-20 px-4 md:px-8 light-layout">
            <div className="max-w-7xl mx-auto">
                {/* Hero / Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Hoş geldin, <span className="text-blue-600">{stats.name || 'Kullanıcı'}</span>
                        </h1>
                        <p className="text-gray-500">Çevresel etkinizi buradan takip edebilirsiniz.</p>
                    </div>
                    <button
                        onClick={() => setIsSellModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                    >
                        <Wallet size={20} />
                        Puanları Harca
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="clean-card p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Mevcut Bakiye</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">{stats.currentPoints}</span>
                            <span className="text-sm font-medium text-gray-400">Puan</span>
                        </div>
                    </div>

                    <div className="clean-card p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                <Leaf size={24} />
                            </div>
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">CO2 Tasarrufu</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">{stats.carbonReduction}</span>
                            <span className="text-sm font-medium text-gray-400">KG</span>
                        </div>
                    </div>

                    <div className="clean-card p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                                <Trophy size={24} />
                            </div>
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Global Sıralama</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">#{stats.globalRank}</span>
                            <span className="text-sm font-medium text-gray-400">Sıra</span>
                        </div>
                    </div>

                    <div className="clean-card p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                <Clock size={24} />
                            </div>
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Bekleyen Puan</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">{stats.lockedPoints}</span>
                            <span className="text-sm font-medium text-gray-400">Puan</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <div className="lg:col-span-2 clean-card overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <History size={18} className="text-blue-600" />
                                Son Aktiviteler
                            </h3>
                            <button className="text-sm text-blue-600 font-semibold hover:underline">Tümünü Gör</button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {stats.activities.length > 0 ? stats.activities.map((activity) => (
                                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                            {activity.type === 'electronic' ? <Smartphone size={20} /> : <Package size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{activity.label}</p>
                                            <p className="text-xs text-gray-500">{activity.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">+{activity.points} Puan</p>
                                        <p className="text-[10px] text-gray-400 font-medium">ONAYLANDI</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center text-gray-400">Henüz aktivite bulunmuyor.</div>
                            )}
                        </div>
                    </div>

                    {/* Withdrawal Requests */}
                    <div className="clean-card overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Wallet size={18} className="text-purple-600" />
                                Harcama Talepleri
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {sellRequests.length > 0 ? sellRequests.map((req) => (
                                <div key={req.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {req.moneyAmount ? `${req.moneyAmount} TL Nakit` : 'Ürün/Kupon'}
                                        </p>
                                        <p className="text-[10px] text-gray-400">ID: #{req.id.toString().slice(-4)}</p>
                                    </div>
                                    {getStatusBadge(req.status)}
                                </div>
                            )) : (
                                <div className="p-12 text-center text-gray-400">Henüz talep bulunmuyor.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Redeem Modal */}
            {isSellModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsSellModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Puanlarını Harca</h2>
                            <button onClick={() => setIsSellModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {sellMessage.text && (
                                <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${sellMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                    {sellMessage.text}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {rewardOptions.map((reward) => (
                                    <button
                                        key={reward.id}
                                        onClick={() => { setSelectedReward(reward); setSellMessage({type:'', text:''}); }}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${selectedReward.id === reward.id ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    >
                                        <div className={`p-2 rounded-lg w-fit mb-3 ${reward.bg} ${reward.color}`}>
                                            <reward.icon size={20} />
                                        </div>
                                        <p className="font-bold text-gray-900 text-sm">{reward.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{reward.cost ? `${reward.cost} Puan` : 'Değişken'}</p>
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSellSubmit}>
                                {selectedReward.type === 'CASH' ? (
                                    <div className="space-y-4 mb-6">
                                        <label className="text-sm font-semibold text-gray-700">Çekmek İstediğiniz Puan</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={sellAmount}
                                                onChange={handleAmountChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-2xl font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="0"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-end">
                                                <span className="text-xs font-bold text-gray-400">PUAN</span>
                                                <span className="text-sm font-bold text-blue-600">≈ {(Number(sellAmount) / 10).toFixed(2)} TL</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 italic">* Minimum 100 puan çekilebilir.</p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${selectedReward.bg} ${selectedReward.color}`}>
                                                <selectedReward.icon size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{selectedReward.title}</p>
                                                <p className="text-xs text-gray-500">{selectedReward.desc}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600">{selectedReward.cost} Puan</p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSelling}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
                                >
                                    {isSelling ? 'İşlem Yapılıyor...' : 'Talebi Onayla'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Dashboard;
