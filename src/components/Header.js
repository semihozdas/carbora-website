import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/user.service';
import '../styles/Header.css';
import profileScreenDefaultProfilImage from '../assets/images/defaultProfilePhoto.png';

import { ChevronDown, LayoutDashboard, Settings, LogOut, Menu, ShieldAlert, User, CircleUser } from 'lucide-react';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const [headerUserData, setHeaderUserData] = useState({
        name: '',
        profilePhotoUrl: profileScreenDefaultProfilImage
    });

    const currentLang = (i18n.resolvedLanguage || i18n.language || 'tr').split('-')[0];

    useEffect(() => {
        if (isAuthenticated) {
            userService.getUserProfile()
                .then(data => {
                    setHeaderUserData({
                        name: data.name || user?.name || '',
                        // Backend'den gelen URL varsa kullan, yoksa default resmi göster
                        profilePhotoUrl: data.profilePhotoUrl || profileScreenDefaultProfilImage
                    });
                })
                .catch(err => {
                    console.error("Header için profil verisi alınamadı:", err);
                    // Hata olursa Context'ten gelen verileri (varsa) fallback olarak kullan
                    setHeaderUserData({
                        name: user?.name || '',
                        profilePhotoUrl: user?.profilePhotoUrl || profileScreenDefaultProfilImage
                    });
                });
        }
    }, [isAuthenticated, user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // --- Kullanıcı rolüne göre doğru Dashboard yolunu belirleme ---
    const getDashboardPath = () => {
        if (user?.role === 'ROLE_CORPORATE') return '/corporate/dashboard';
        if (user?.role === 'ROLE_ADMIN') return '/admin';
        return '/dashboard'; // ROLE_USER
    };

    return (
        <header className="header-container">
            <div className="header-content">
                <Link to="/" className="header-logo group">
                    <span className="logo-text font-display font-black tracking-tighter italic">CARBORA</span>
                </Link>

                <nav className="header-nav">
                    <Link to="/" className="nav-link">Ana Sayfa</Link>
                    <a href="/#hakkimizda" onClick={e => { e.preventDefault(); document.getElementById('hakkimizda')?.scrollIntoView({behavior:'smooth'}); }} className="nav-link" style={{cursor:'pointer'}}>Hakkımızda</a>
                    <a href="/#nasil" onClick={e => { e.preventDefault(); document.getElementById('nasil')?.scrollIntoView({behavior:'smooth'}); }} className="nav-link" style={{cursor:'pointer'}}>Nasıl Çalışır</a>
                    <a href="/#iletisim" onClick={e => { e.preventDefault(); document.getElementById('iletisim')?.scrollIntoView({behavior:'smooth'}); }} className="nav-link" style={{cursor:'pointer'}}>İletişim</a>
                </nav>

                <div className="header-actions">

                    {!isAuthenticated ? (
                        <>{/* Giriş/Kayıt butonları pasif */}</>
                    ) : (
                        <div
                            className="user-dropdown header-desktop-only-block"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button className="user-dropdown-button">
                                <div className="user-avatar-placeholder">
                                    <CircleUser size={32} strokeWidth={1.5} className="user-avatar-icon" />
                                </div>
                                <ChevronDown className={`dropdown-arrow transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                            </button>

                            {isDropdownOpen && <div className="dropdown-menu-bridge" aria-hidden="true" />}

                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <p className="user-name">{headerUserData.name || t('header.user.defaultName')}</p>
                                        <p className="user-badge">{user?.role === 'ROLE_CORPORATE' ? 'Kurumsal' : t('header.user.premium')}</p>
                                    </div>
                                    <div className="dropdown-items">

                                        <Link to={getDashboardPath()} className="dropdown-item">
                                            <LayoutDashboard size={18} />
                                            <span>{t('header.dropdown.dashboard')}</span>
                                        </Link>

                                        {/* Eğer kullanıcı rolü ROLE_ADMIN ise bu butonu göster */}
                                        {user?.role === 'ROLE_ADMIN' && (
                                            <Link to="/admin" className="dropdown-item" style={{color: '#facc15'}}>
                                                <ShieldAlert size={18} />
                                                <span>{t('header.dropdown.adminPanel')}</span>
                                            </Link>
                                        )}

                                        <Link to="/profile" className="dropdown-item">
                                            <Settings size={18} />
                                            <span>{t('header.dropdown.profileSettings')}</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button onClick={handleLogout} className="dropdown-item logout">
                                            <LogOut size={18} />
                                            <span>{t('header.dropdown.logout')}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobil Menü Dropdown */}
            {isMobileMenuOpen && (
                <div className="mobile-menu-container">
                    <nav className="mobile-nav">
                        <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                            Ana Sayfa
                        </Link>
                        <a href="/#hakkimizda" className="mobile-nav-link"
                              onClick={() => { setIsMobileMenuOpen(false); setTimeout(() => document.getElementById('hakkimizda')?.scrollIntoView({behavior:'smooth'}), 100); }}>Hakkımızda</a>
                        <a href="/#nasil" className="mobile-nav-link"
                              onClick={() => { setIsMobileMenuOpen(false); setTimeout(() => document.getElementById('nasil')?.scrollIntoView({behavior:'smooth'}), 100); }}>Nasıl Çalışır</a>
                        <a href="/#iletisim" className="mobile-nav-link"
                              onClick={() => { setIsMobileMenuOpen(false); setTimeout(() => document.getElementById('iletisim')?.scrollIntoView({behavior:'smooth'}), 100); }}>İletişim</a>
                        <div className="mobile-divider"></div>
                        {!isAuthenticated ? (
                            <>{/* Mobil giriş/kayıt pasif */}</>
                        ) : (
                            <>
                                <Link to={getDashboardPath()} className="mobile-nav-link"
                                      onClick={() => setIsMobileMenuOpen(false)}>{t('header.dropdown.dashboard')}</Link>
                                <button onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }} className="mobile-nav-link logout">{t('header.dropdown.logout')}
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;