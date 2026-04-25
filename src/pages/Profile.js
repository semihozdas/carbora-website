import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import { 
    User, 
    Shield, 
    Lock, 
    Camera, 
    Save, 
    Key, 
    Trash2, 
    Eye, 
    EyeOff, 
    AlertTriangle,
    CheckCircle,
    Info,
    Settings,
    Mail,
    UserCircle
} from 'lucide-react';
import profileScreenDefaultProfilImage from '../assets/images/defaultProfilePhoto.png';

const Profile = () => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        name: '',
        surname: '',
        email: '',
        profilePhotoUrl: profileScreenDefaultProfilImage
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getUserProfile();
            setProfileData({
                name: data.name || '',
                surname: data.surname || '',
                email: data.email || '',
                profilePhotoUrl: data.profilePhotoUrl || profileScreenDefaultProfilImage
            });
        } catch (error) {
            console.error('Profil yüklenirken hata:', error);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const responseData = await userService.uploadProfilePhoto(file);
            setProfileData(prev => ({
                ...prev,
                profilePhotoUrl: responseData.profilePhotoUrl || profileScreenDefaultProfilImage
            }));
            setMessage({ type: 'success', text: 'Profil fotoğrafı başarıyla güncellendi.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Fotoğraf yüklenirken bir hata oluştu.' });
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await userService.updateMyName(profileData.name, profileData.surname);
            setMessage({ type: 'success', text: 'Profil bilgileriniz güncellendi.' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Güncelleme başarısız.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.newPasswordConfirm) {
            setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
            setLoading(false);
            return;
        }

        try {
            await userService.updatePassword(passwordData);
            setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi.' });
            setPasswordData({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Şifre değiştirilemedi.' });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.');
        if (!confirmed) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await userService.deleteMyAccount();
            authService.logout();
        } catch (error) {
            setMessage({ type: 'error', text: error?.message || 'Hesap silinirken bir hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] pt-24 pb-20 px-4 md:px-8 light-layout">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Ayarları</h1>
                    <p className="text-gray-500">Hesap bilgilerinizi ve güvenlik tercihlerinizi buradan yönetebilirsiniz.</p>
                </div>

                {message.text && (
                    <div className={`p-4 mb-8 rounded-xl text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                        {message.text}
                    </div>
                )}

                <div className="space-y-8">
                    {/* Kişisel Bilgiler */}
                    <div className="clean-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <UserCircle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Kişisel Bilgiler</h3>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10 pb-8 border-b border-gray-100">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                                    <img src={profileData.profilePhotoUrl} alt="Profil" className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-full"
                                    >
                                        <Camera size={24} className="text-white" />
                                    </button>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                                <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md border border-gray-100">
                                    <Camera size={14} className="text-gray-500" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">{profileData.name} {profileData.surname}</h4>
                                <div className="flex items-center gap-2 text-gray-500 mt-1">
                                    <Mail size={14} />
                                    <span className="text-sm">{profileData.email}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Ad</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={profileData.name} 
                                        onChange={handleProfileChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Soyad</label>
                                    <input 
                                        type="text" 
                                        name="surname" 
                                        value={profileData.surname} 
                                        onChange={handleProfileChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Güvenlik Ayarları */}
                    <div className="clean-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Lock size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Güvenlik ve Şifre</h3>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Mevcut Şifre</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword.current ? "text" : "password"} 
                                        name="currentPassword" 
                                        value={passwordData.currentPassword} 
                                        onChange={handlePasswordChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    />
                                    <button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Yeni Şifre</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword.new ? "text" : "password"} 
                                            name="newPassword" 
                                            value={passwordData.newPassword} 
                                            onChange={handlePasswordChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Yeni Şifre (Tekrar)</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword.confirm ? "text" : "password"} 
                                            name="newPasswordConfirm" 
                                            value={passwordData.newPasswordConfirm} 
                                            onChange={handlePasswordChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <Info size={18} className="text-blue-500 shrink-0" />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Şifreniz en az 8 karakterden oluşmalı; harf ve rakam içermelidir.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-100 flex items-center gap-2"
                                >
                                    <Key size={18} />
                                    {loading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tehlikeli Bölge */}
                    <div className="bg-red-50 rounded-2xl border border-red-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-red-900">Hesabı Kapat</h3>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <p className="text-sm font-semibold text-red-800">Hesabınızı kalıcı olarak silin</p>
                                <p className="text-xs text-red-600/70 mt-1 max-w-md">
                                    Bu işlemi yaptığınızda tüm puanlarınız, geçmişiniz ve verileriniz kalıcı olarak silinecektir.
                                </p>
                            </div>
                            <button 
                                onClick={handleDeleteAccount}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-100 flex items-center gap-2 whitespace-nowrap"
                            >
                                <Trash2 size={18} />
                                Hesabımı Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;
