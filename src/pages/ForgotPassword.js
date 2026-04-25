import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/auth.service';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.requestPasswordReset(email);

            if(response.success) {
                // Başarılı olunca e-postayı taşıyarak kod sayfasına yönlendir
                navigate('/verify-code', { state: { email: email } });
            } else {
                setError(response.message || t('auth.errors.resetFailed'));
            }
        } catch (err) {
            setError(err.message || t('auth.errors.resetFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f5f8f6] dark:bg-[#0f2316] font-display antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-[#00e650] selection:text-black">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{backgroundImage: 'radial-gradient(circle at 15% 50%, #1f4d36 0%, transparent 25%), radial-gradient(circle at 85% 30%, #132A20 0%, transparent 25%)'}}></div>

            <div className="relative z-10 flex min-h-screen flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">

                {/* Logo ve Başlık */}
                <div className="flex flex-col items-center mb-8 gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#132A20] to-[#051810] rounded-2xl border border-[#273a2e] shadow-lg">
                        <div className="w-10 h-10 text-[#00e650]">
                            <svg fill="none" height="100%" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="100%" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"></path>
                                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Carbora</h1>
                    <p className="text-[#9abca6] text-sm text-center max-w-xs">{t('auth.subtitle.recover', 'Hesabınıza yeniden erişim sağlayın.')}</p>
                </div>

                {/* Ana Kart */}
                <div className="w-full max-w-[480px] bg-[#132A20] rounded-3xl shadow-2xl border border-[#273a2e] overflow-hidden flex flex-col relative">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 bg-[#051810] rounded-full flex items-center justify-center mb-4 border border-[#273a2e] shadow-inner">
                                <span className="material-symbols-outlined text-[#00e650] text-3xl">lock_reset</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{t('auth.titles.forgotPassword', 'Şifrenizi mi Unuttunuz?')}</h2>
                            <p className="text-[#9abca6] text-sm">{t('auth.descriptions.enterEmail', 'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.')}</p>
                        </div>

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm">
                                    <span className="material-symbols-outlined">error</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-white text-sm font-medium pl-1" htmlFor="reset-email">{t('auth.fields.email', 'E-posta')}</label>
                                    <div className="relative group/input">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9abca6] group-focus-within/input:text-[#00e650] transition-colors">mail</span>
                                        <input
                                            className="w-full bg-[#051810] text-white rounded-xl border-none pl-12 pr-4 py-4 placeholder:text-[#5a7c66] focus:ring-1 focus:ring-[#00e650] focus:shadow-[0_0_15px_rgba(0,230,80,0.5)] outline-none text-base transition-all"
                                            id="reset-email"
                                            name="email"
                                            placeholder="ornek@email.com"
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    className="group w-full h-12 bg-[#00e650] hover:bg-[#00cc47] text-[#0f2316] rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(0,230,80,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                                    type="submit"
                                    disabled={loading || !email}
                                >
                                    <span>{loading ? t('auth.actions.sending', 'Gönderiliyor...') : t('auth.actions.sendResetLink', 'Sıfırlama Bağlantısı Gönder')}</span>
                                    <span className={`material-symbols-outlined text-lg font-bold transition-transform ${loading ? '' : 'group-hover:translate-x-1'}`}>send</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 pt-6 border-t border-[#273a2e] text-center">
                            <Link to="/auth?tab=login" className="inline-flex items-center gap-2 text-sm font-medium text-[#9abca6] hover:text-white transition-colors group/back">
                                <span className="material-symbols-outlined text-lg group-hover/back:-translate-x-1 transition-transform">arrow_back</span>
                                <span>{t('auth.links.backToLogin', 'Giriş Sayfasına Dön')}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <footer className="mt-12 text-center">
                    <p className="text-xs text-[#395643]">
                        © {new Date().getFullYear()} Carbora Inc. Tüm hakları saklıdır.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default ForgotPassword;