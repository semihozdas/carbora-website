import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { corporateService } from '../services/corporate.service';
import '../styles/Dashboard.css';

const CorporateDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate(); // Marketplace yönlendirmesi için

    const [stats, setStats] = useState({
        companyName: 'Yükleniyor...',
        totalOffsetCarbon: 0,
        globalRank: '-',
        certificates: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCorporateStats();
    }, []);

    const fetchCorporateStats = async () => {
        try {
            const data = await corporateService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Corporate Stats yüklenirken hata:', error);
            // Hata durumunda geçici bir isim atayabiliriz
            setStats(prev => ({ ...prev, companyName: 'Sistem Hatası' }));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // AĞAÇ HESABI (Ortalama bir yetişkin ağaç yılda ~21.77 kg CO2 emer)
    // Şirketin toplam ofsetini 21.77'ye bölüp aşağı yuvarlıyoruz (tam ağaç sayısı)
    const TREE_CO2_CAPACITY = 21.77;
    const equivalentTrees = Math.floor((stats.totalOffsetCarbon || 0) / TREE_CO2_CAPACITY);

    return (
        <main className="dashboard-container">
            <div className="dashboard-content">
                {/* Header Kısımı */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">
                            {t('corporate.dashboard.welcome', 'Hoş Geldiniz,')} <span className="text-primary">{stats.companyName}</span>
                        </h1>
                        <p className="dashboard-subtitle">
                            {t('corporate.dashboard.subtitle', 'Kurumsal karbon ayak izi yönetim ve ofsetleme paneliniz.')}
                        </p>
                    </div>
                    <div className="dashboard-actions">
                        <button
                            className="btn-use-points"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => navigate('/marketplace')} // Yönlendirme Eklendi
                        >
                            <span className="material-symbols-outlined text-lg">shopping_cart</span>
                            {t('corporate.dashboard.buyCredit', 'Karbon Kredisi Satın Al')}
                        </button>
                    </div>
                </div>

                {/* Stats Grid Kısımı */}
                <div className="stats-grid">

                    {/* Ana Ofsetleme Kartı (Dairesel Bar KALDILIRDI, Sadece Sayı Var) */}
                    <div className="points-card" style={{ border: '1px solid rgba(0, 230, 80, 0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div className="points-bg-blur points-bg-blur-top"></div>
                        <div className="points-bg-blur points-bg-blur-bottom"></div>

                        <div style={{ textAlign: 'center', zIndex: 10 }}>
                            <h3 style={{ fontSize: '1rem', color: '#9abca6', marginBottom: '0.5rem', fontWeight: '600' }}>
                                Bugüne Kadar Ofsetlenen Toplam Karbon
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
                                {/* Virgüllü sayıyı düzgün göstermek için */}
                                <span style={{ fontSize: '4.5rem', fontWeight: '900', color: '#00e650', lineHeight: '1' }}>
                                    {(stats.totalOffsetCarbon || 0).toLocaleString('tr-TR')}
                                </span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>kg CO₂</span>
                            </div>
                        </div>
                    </div>

                    <div className="side-cards">
                        {/* Ağaç Eşdeğeri Kartı */}
                        <div className="stat-card carbon-card">
                            <div className="stat-card-header">
                                <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                                    <span className="material-symbols-outlined">nature</span>
                                </div>
                                <span className="stat-badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Çevresel Etki</span>
                            </div>
                            <div className="stat-card-body">
                                <p className="stat-label">Kurtarılan Ağaç Eşdeğeri</p>
                                <div className="stat-value-row">
                                    <h3 className="stat-value text-emerald-400">{equivalentTrees.toLocaleString('tr-TR')}</h3>
                                    <span className="stat-unit">Adet</span>
                                </div>
                            </div>
                        </div>

                        {/* Kurumsal Sıralama Kartı */}
                        <div className="stat-card rank-card">
                            <div className="stat-card-header">
                                <div className="stat-icon yellow">
                                    <span className="material-symbols-outlined">corporate_fare</span>
                                </div>
                                <span className="stat-badge">Kurumsal Liderlik</span>
                            </div>
                            <div className="stat-card-body">
                                <p className="stat-label">Sektörel Sıralama</p>
                                <div className="stat-value-row">
                                    <h3 className="stat-value">#{stats.globalRank}</h3>
                                    <span className="rank-badge">
                                        <span className="material-symbols-outlined">verified</span>
                                        Onaylı Kurum
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sertifikalar / Satın Alım Geçmişi Tablosu */}
                <div className="activities-section mt-8">
                    <div className="activities-header">
                        <h3 className="activities-title flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">workspace_premium</span>
                            Karbon Ofsetleme Sertifikaları
                        </h3>
                    </div>

                    <div className="activities-table-wrapper">
                        <table className="activities-table">
                            <thead>
                            <tr>
                                <th>Sertifika No</th>
                                <th>Düzenlenme Tarihi</th>
                                <th>Ofsetlenen Miktar (kg CO₂)</th>
                                <th className="text-right">Sertifika</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stats.certificates && stats.certificates.length > 0 ? (
                                stats.certificates.map((cert) => (
                                    <tr key={cert.id}>
                                        <td>
                                            <span className="text-white font-mono bg-card-dark px-2 py-1 rounded border border-border-dark text-sm">{cert.id}</span>
                                        </td>
                                        <td className="date-cell">{cert.date}</td>
                                        <td>
                                            <span className="text-primary font-bold">+{cert.amount} kg</span>
                                        </td>
                                        <td className="text-right">
                                            <a href={cert.pdfUrl} className="inline-flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-colors" title="PDF İndir">
                                                <span className="material-symbols-outlined text-[20px]">download</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: '#9abca6'}}>
                                        Henüz bir karbon kredisi satın alımınız bulunmuyor.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CorporateDashboard;