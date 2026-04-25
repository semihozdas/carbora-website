import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/auth.service';

const VerifyCode = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Önceki sayfadan email gelmediyse geri yolla
    const email = location.state?.email;

    // State'ler
    const [step, setStep] = useState(1); // 1: Kod Gir, 2: Yeni Şifre Gir
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [resetToken, setResetToken] = useState('');

    // Yeni Şifre State'leri
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Resend (Tekrar Gönder) Sayacı State'leri
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password', { replace: true });
        }
    }, [email, navigate]);

    // Sayacın çalışması için Effect
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleInputChange = (index, value) => {
        if (value && !/^\d+$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (error) setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // ADIM 1: Kodu Doğrula
    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        const fullCode = code.join('');

        if (fullCode.length < 6) return;
        setLoading(true);
        setError('');

        try {
            const response = await authService.verifyResetCode(email, fullCode);
            if(response.success) {
                setResetToken(response.resetToken);
                setStep(2); // Şifre belirleme adımına geç
            } else {
                setError(response.message || t('auth.errors.invalidCode'));
            }
        } catch (err) {
            setError(err.message || t('auth.errors.invalidCode'));
        } finally {
            setLoading(false);
        }
    };

    // ADIM 2: Yeni Şifreyi Kaydet
    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== newPasswordConfirm) {
            setError(t('auth.errors.passwordsMismatch', 'Şifreler eşleşmiyor.'));
            return;
        }

        if (newPassword.length < 6) {
            setError(t('auth.errors.passwordMin', 'Şifre en az 6 karakter olmalıdır.'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authService.resetPassword(resetToken, newPassword, newPasswordConfirm);
            if(response.success) {
                setSuccessMessage("Şifreniz başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsunuz...");
                setTimeout(() => {
                    navigate('/auth?tab=login', { replace: true });
                }, 2000);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(err.message || 'Şifre güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Kodu tekrar gönder (Resend)
    const handleResend = async () => {
        if (resendCooldown > 0) return; // Sayac devam ediyorsa işlem yapma

        try {
            await authService.requestPasswordReset(email);
            setResendCooldown(60); // Başarılı gönderimde sayacı 60 saniyeye kur
            alert("Kod tekrar gönderildi. Lütfen e-postanızı kontrol edin.");
        } catch (error) {
            alert("Kod gönderilemedi. Lütfen daha sonra tekrar deneyin.");
        }
    };

    if (!email) return null;

    return (
        <div className="bg-[#f5f8f6] dark:bg-[#0f2316] font-display antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-[#00e650] selection:text-black">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{backgroundImage: 'radial-gradient(circle at 15% 50%, #1f4d36 0%, transparent 25%), radial-gradient(circle at 85% 30%, #132A20 0%, transparent 25%)'}}></div>

            <div className="relative z-10 flex min-h-screen flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">

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

                <div className="w-full max-w-[480px] bg-[#132A20] rounded-3xl shadow-2xl border border-[#273a2e] overflow-hidden flex flex-col relative">
                    <div className="p-6 sm:p-8">

                        {/* Hata veya Başarı Mesajı Ortak */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm mb-6">
                                <span className="material-symbols-outlined">error</span>
                                <span>{error}</span>
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-[#00e650]/10 border border-[#00e650]/50 text-[#00e650] p-3 rounded-lg flex items-center gap-2 text-sm mb-6">
                                <span className="material-symbols-outlined">check_circle</span>
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {step === 1 ? (
                            // ----------------- 1. ADIM: KOD GİRME ALANI -----------------
                            <>
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="w-16 h-16 bg-[#051810] rounded-full flex items-center justify-center mb-4 border border-[#273a2e] shadow-inner">
                                        <span className="material-symbols-outlined text-[#00e650] text-3xl">verified_user</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{t('auth.titles.verifyCode', 'Kodu Doğrulayın')}</h2>
                                    <p className="text-[#9abca6] text-sm px-2">
                                        <span className="text-white font-medium">{email}</span> adresine gönderilen 6 haneli kodu aşağıya giriniz.
                                    </p>
                                </div>

                                <form className="flex flex-col gap-6" onSubmit={handleVerifySubmit}>
                                    <div className="flex justify-center gap-2 sm:gap-3">
                                        {code.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                className="w-10 h-12 sm:w-12 sm:h-14 text-center bg-[#051810] border border-[#273a2e] rounded-lg text-white text-xl font-bold focus:border-[#00e650] focus:ring-1 focus:ring-[#00e650] focus:shadow-[0_0_15px_rgba(0,230,80,0.5)] outline-none transition-all"
                                                maxLength="1"
                                                type="text"
                                                required
                                                value={digit}
                                                onChange={(e) => handleInputChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                            />
                                        ))}
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            className="group w-full h-12 bg-[#00e650] hover:bg-[#00cc47] text-[#0f2316] rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(0,230,80,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            <span>{loading ? t('auth.actions.verifying', 'Doğrulanıyor...') : t('auth.actions.verifyCode', 'Kodu Doğrula')}</span>
                                            <span className={`material-symbols-outlined text-lg font-bold transition-transform ${loading ? '' : 'group-hover:scale-110'}`}>check_circle</span>
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6 pt-6 border-t border-[#273a2e] text-center space-y-4 flex flex-col items-center">
                                    <p className="text-sm text-[#9abca6]">
                                        {t('auth.texts.didntReceiveCode', 'Kodu almadınız mı?')}
                                        <button
                                            onClick={handleResend}
                                            type="button"
                                            disabled={resendCooldown > 0}
                                            className={`font-medium ml-1 transition-colors ${
                                                resendCooldown > 0
                                                    ? 'text-[#5a7c66] cursor-not-allowed'
                                                    : 'text-[#00e650] hover:text-[#00cc47] hover:underline'
                                            }`}
                                        >
                                            {resendCooldown > 0
                                                ? `${t('auth.actions.resend', 'Tekrar Gönder')} (${resendCooldown}s)`
                                                : t('auth.actions.resend', 'Tekrar Gönder')}
                                        </button>
                                    </p>
                                    <Link to="/auth?tab=login" className="inline-flex items-center gap-2 text-sm font-medium text-[#9abca6] hover:text-white transition-colors group/back">
                                        <span className="material-symbols-outlined text-lg group-hover/back:-translate-x-1 transition-transform">arrow_back</span>
                                        <span>{t('auth.links.backToLogin', 'Giriş Sayfasına Dön')}</span>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            // ----------------- 2. ADIM: YENİ ŞİFRE ALANI -----------------
                            <>
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="w-16 h-16 bg-[#051810] rounded-full flex items-center justify-center mb-4 border border-[#273a2e] shadow-inner">
                                        <span className="material-symbols-outlined text-[#00e650] text-3xl">key</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Yeni Şifre Belirleyin</h2>
                                    <p className="text-[#9abca6] text-sm px-2">
                                        Lütfen yeni bir şifre giriniz.
                                    </p>
                                </div>

                                <form className="flex flex-col gap-5" onSubmit={handleResetPasswordSubmit}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-white text-sm font-medium pl-1">Yeni Şifre</label>
                                            <div className="relative group/input">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9abca6] group-focus-within/input:text-[#00e650] transition-colors">lock</span>
                                                <input
                                                    className="w-full bg-[#051810] text-white rounded-xl border-none pl-12 pr-4 py-4 placeholder:text-[#5a7c66] focus:ring-1 focus:ring-[#00e650] focus:shadow-[0_0_15px_rgba(0,230,80,0.5)] outline-none text-base transition-all"
                                                    type="password"
                                                    placeholder="Yeni Şifreniz"
                                                    required
                                                    value={newPassword}
                                                    onChange={(e) => {setNewPassword(e.target.value); setError('');}}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-white text-sm font-medium pl-1">Şifre Tekrar</label>
                                            <div className="relative group/input">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9abca6] group-focus-within/input:text-[#00e650] transition-colors">verified_user</span>
                                                <input
                                                    className="w-full bg-[#051810] text-white rounded-xl border-none pl-12 pr-4 py-4 placeholder:text-[#5a7c66] focus:ring-1 focus:ring-[#00e650] focus:shadow-[0_0_15px_rgba(0,230,80,0.5)] outline-none text-base transition-all"
                                                    type="password"
                                                    placeholder="Şifreyi Onaylayın"
                                                    required
                                                    value={newPasswordConfirm}
                                                    onChange={(e) => {setNewPasswordConfirm(e.target.value); setError('');}}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            className="group w-full h-12 bg-[#00e650] hover:bg-[#00cc47] text-[#0f2316] rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(0,230,80,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                                            type="submit"
                                            disabled={loading || successMessage !== ''}
                                        >
                                            <span>{loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}</span>
                                            <span className="material-symbols-outlined text-lg font-bold group-hover:translate-x-1 transition-transform">save</span>
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

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

export default VerifyCode;