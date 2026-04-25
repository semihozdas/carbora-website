import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Leaf } from 'lucide-react';
import '../styles/Footer.css';


const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-grid">

                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="footer-logo-text">CARBORA</span>
                        </Link>
                        <p className="footer-description">Geri dönüşümü doğrulanabilir karbon kredisine dönüştüren platform.</p>
                        <div style={{ marginTop: 18 }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '5px 12px', borderRadius: 999,
                                background: 'rgba(0,255,135,.07)',
                                border: '1px solid rgba(0,255,135,.18)',
                                fontSize: 12, color: '#00FF87', fontWeight: 600,
                            }}>
                                <span className="footer-glow-dot" />
                                Canlı
                            </div>
                        </div>
                    </div>

                    {/* Platform */}
                    <div className="footer-column">
                        <h3 className="footer-title">Platform</h3>
                        <ul className="footer-links">
                            <li><a href="/#hero" onClick={e => { e.preventDefault(); document.getElementById('hero')?.scrollIntoView({behavior:'smooth'}); }} style={{cursor:'pointer'}}>Ana Sayfa</a></li>
                            <li><a href="/#nasil" onClick={e => { e.preventDefault(); document.getElementById('nasil')?.scrollIntoView({behavior:'smooth'}); }} style={{cursor:'pointer'}}>Nasıl Çalışır</a></li>
                        </ul>
                    </div>

                    {/* Corporate */}
                    <div className="footer-column">
                        <h3 className="footer-title">Kurumsal</h3>
                        <ul className="footer-links">
                            <li><a href="/#hakkimizda" onClick={e => { e.preventDefault(); document.getElementById('hakkimizda')?.scrollIntoView({behavior:'smooth'}); }} style={{cursor:'pointer'}}>Hakkımızda</a></li>
                            <li><a href="/#iletisim" onClick={e => { e.preventDefault(); document.getElementById('iletisim')?.scrollIntoView({behavior:'smooth'}); }} style={{cursor:'pointer'}}>İletişim</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-column">
                        <h3 className="footer-title">Yasal</h3>
                        <ul className="footer-links">
                            <li><Link to="/privacy">Gizlilik Politikası</Link></li>
                            <li><Link to="/terms">Kullanım Koşulları</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">
                        © {new Date().getFullYear()} Carbora
                        <span className="footer-glow-dot" />
                        Tüm hakları saklıdır.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Leaf size={12} color="rgba(0,255,135,.6)" />
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                            Yeşil Bir Gelecek İçin
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
