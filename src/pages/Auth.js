import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
    Mail, 
    Lock, 
    User, 
    ArrowRight, 
    Home, 
    ShieldCheck, 
    AlertCircle, 
    Terminal, 
    Zap,
    Fingerprint,
    Shield
} from 'lucide-react';

const Auth = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register, registerCorporate } = useAuth();

    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(location.search);
        const tabParam = params.get('tab');
        const stateTab = location.state?.tab || location.state?.initialTab;
        const raw = (tabParam || stateTab || 'login');
        const normalized = typeof raw === 'string' ? raw.toLowerCase() : 'login';

        if (normalized === 'register' || normalized === 'signup') return 'register';
        return 'login';
    });

    const [registerType, setRegisterType] = useState('individual');
    const [formData, setFormData] = useState({
        email: '', password: '', name: '', surname: '', passwordConfirm: '', terms: false,
        companyName: '', taxOffice: '', taxNumber: '', contactPhone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (error) setError('');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
        setSuccessMessage('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccessMessage('');
        try {
            const response = await login(formData.email, formData.password);
            if (response.role === 'ROLE_CORPORATE') navigate('/corporate/dashboard');
            else if (response.role === 'ROLE_ADMIN') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'AUTHENTICATION_FAILURE: INVALID_CREDENTIALS');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccessMessage('');

        if (formData.password !== formData.passwordConfirm) { setError('VALIDATION_ERROR: PASSWORDS_DO_NOT_MATCH'); setLoading(false); return; }
        if (formData.password.length < 6) { setError('VALIDATION_ERROR: PASSWORD_STRENGTH_INSUFFICIENT'); setLoading(false); return; }

        try {
            if (registerType === 'individual') {
                await register({ email: formData.email, password: formData.password, passwordConfirm: formData.passwordConfirm, name: formData.name.trim(), surname: formData.surname.trim() });
            } else {
                await registerCorporate({
                    email: formData.email, password: formData.password, passwordConfirm: formData.passwordConfirm, name: formData.name.trim(), surname: formData.surname.trim(),
                    companyName: formData.companyName.trim(), taxOffice: formData.taxOffice.trim(), taxNumber: formData.taxNumber.trim(), contactPhone: formData.contactPhone.trim()
                });
            }

            setSuccessMessage('IDENTITY_ESTABLISHED: PLEASE_PROCEED_TO_LOGIN');
            setActiveTab('login');
            setFormData({ email: '', password: '', name: '', surname: '', passwordConfirm: '', terms: false, companyName: '', taxOffice: '', taxNumber: '', contactPhone: '' });
        } catch (err) {
            setError(err.message || 'REGISTRATION_FAILURE: SYSTEM_REJECTION');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-scan z-50"></div>

            <Link to="/" className="fixed top-8 left-8 p-3 bg-white/5 border border-white/10 text-text-muted hover:text-primary transition-all rounded-sm z-50">
                <Home size={20} />
            </Link>

            <div className="w-full max-w-4xl grid md:grid-cols-2 bg-[#0a0a0c] border border-white/5 rounded-sm overflow-hidden shadow-2xl relative z-10">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40"></div>

                {/* Left Panel: Branding */}
                <div className="p-12 bg-primary/5 flex flex-col justify-between border-r border-white/5 relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-primary mb-8">
                            <Terminal size={16} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">SYSTEM_AUTH_V4.2</span>
                        </div>
                        <h1 className="text-5xl font-display font-black uppercase italic leading-none mb-4">
                            CARBORA<br />
                            <span className="text-primary">CENTRAL</span>
                        </h1>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                            Establish your identity to join the global environmental resistance.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
                            <div className="w-8 h-px bg-white/20"></div>
                            NETWORK_STATUS: <span className="text-primary">ENCRYPTED</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                <Fingerprint size={24} className="text-primary opacity-50" />
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                <Shield size={24} className="text-accent opacity-50" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,157,0.05),transparent)]"></div>
                </div>

                {/* Right Panel: Form */}
                <div className="p-12">
                    <div className="flex gap-8 mb-10 border-b border-white/5">
                        <button 
                            onClick={() => handleTabChange('login')}
                            className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'login' ? 'text-primary' : 'text-text-muted hover:text-white'}`}
                        >
                            LOGIN_UNIT
                            {activeTab === 'login' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-neon-green"></div>}
                        </button>
                        <button 
                            onClick={() => handleTabChange('register')}
                            className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'register' ? 'text-primary' : 'text-text-muted hover:text-white'}`}
                        >
                            ESTABLISH_NODE
                            {activeTab === 'register' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-neon-green"></div>}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-8 p-4 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                            <ShieldCheck size={14} />
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-6">
                        {activeTab === 'register' && (
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <button 
                                    type="button" 
                                    onClick={() => setRegisterType('individual')}
                                    className={`py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${registerType === 'individual' ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10 text-text-muted'}`}
                                >
                                    INDIVIDUAL
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setRegisterType('corporate')}
                                    className={`py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${registerType === 'corporate' ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10 text-text-muted'}`}
                                >
                                    CORPORATE
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {activeTab === 'register' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">GIVEN_NAME</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-primary transition-all rounded-sm" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">SURNAME</label>
                                            <input type="text" name="surname" value={formData.surname} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-primary transition-all rounded-sm" required />
                                        </div>
                                    </div>
                                    {registerType === 'corporate' && (
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-accent">COMPANY_IDENTITY</label>
                                                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-accent transition-all rounded-sm" required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-accent">TAX_CODE</label>
                                                    <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-accent transition-all rounded-sm" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-accent">UPLINK_NODE</label>
                                                    <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-accent transition-all rounded-sm" required />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">IDENTITY_PROTOCOL (EMAIL)</label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 pl-12 text-xs outline-none focus:border-primary transition-all rounded-sm" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">ACCESS_KEY (PASSWORD)</label>
                                    {activeTab === 'login' && <Link to="/forgot-password" size={10} className="text-[10px] font-black text-primary hover:text-white transition-all uppercase tracking-widest">KEY_LOST?</Link>}
                                </div>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 pl-12 text-xs outline-none focus:border-primary transition-all rounded-sm" required />
                                </div>
                            </div>

                            {activeTab === 'register' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">VERIFY_KEY</label>
                                    <div className="relative">
                                        <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 pl-12 text-xs outline-none focus:border-primary transition-all rounded-sm" required />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-primary text-black font-black uppercase tracking-[0.4em] text-xs skew-x-[-12deg] hover:bg-white hover:shadow-neon-green transition-all flex items-center justify-center gap-3"
                        >
                            <span className="skew-x-[12deg] inline-block flex items-center gap-3">
                                {loading ? 'PROCESSING...' : (activeTab === 'login' ? 'ESTABLISH_LINK' : 'INITIALIZE_AGENT')}
                                <ArrowRight size={16} />
                            </span>
                        </button>
                    </form>
                </div>
            </div>
            
            <footer className="fixed bottom-8 text-center text-[8px] font-black uppercase tracking-[0.4em] text-text-muted">
                CARBORA_CORE_v4.2 // © {new Date().getFullYear()} BILGISIM_GROUP
            </footer>
        </div>
    );
};

export default Auth;