import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/authApi';
import MatrixBackground from '../../shared/components/MatrixBackground';
import toast from 'react-hot-toast';

const BirimSelection: React.FC = () => {
    const navigate = useNavigate();
    const { user, birimleri, selectBirim, setSelectedBirimRole } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleSelectBirim = async (birimIndex: number) => {
        const selectedBirim = birimleri[birimIndex];
        setIsLoading(true);
        setSelectedIndex(birimIndex);

        try {
            // Backend'den yeni token al (birim bilgisi ile)
            const response = await authApi.selectBirim(selectedBirim.birimId);

            if (response.success && response.data) {
                // Store'u güncelle
                selectBirim(selectedBirim);
                
                // Seçilen birim ve rol bilgisini güncelle
                if (response.data.selectedBirim && response.data.selectedRole) {
                    setSelectedBirimRole(
                        response.data.selectedBirim,
                        response.data.selectedRole
                    );
                }

                toast.success(`${selectedBirim.birimAdi} birimine giriş yapıldı`);
                navigate('/dashboard');
            } else {
                toast.error(response.error?.message || 'Birim seçimi başarısız');
            }
        } catch (error) {
            console.error('Birim seçimi hatası:', error);
            toast.error('Birim seçimi sırasında bir hata oluştu');
        } finally {
            setIsLoading(false);
            setSelectedIndex(null);
        }
    };

    if (!user || birimleri.length === 0) {
        navigate('/login');
        return null;
    }

    return (
        <>
            <MatrixBackground />
            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-[600px] bg-white/5 backdrop-blur-md border border-white/15 rounded-[20px] p-10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Hoş Geldiniz, {user.ad} {user.soyad}
                        </h1>
                        <p className="text-white/60 text-base">
                            Lütfen çalışmak istediğiniz birimi seçin
                        </p>
                    </div>

                    {/* Birim List */}
                    <div className="grid gap-4">
                        {birimleri.map((birim, index) => (
                            <button
                                key={birim.birimId}
                                onClick={() => handleSelectBirim(index)}
                                disabled={isLoading}
                                className={`w-full p-6 bg-white/10 border border-white/20 rounded-xl text-left 
                                         transition-all duration-300 flex flex-col gap-2
                                         ${isLoading && selectedIndex === index 
                                           ? 'bg-purple-500/30 border-purple-500/60' 
                                           : 'hover:bg-purple-500/20 hover:border-purple-500/60 hover:-translate-y-0.5'}
                                         ${isLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                            >
                                <div className="text-xl font-semibold text-white flex items-center gap-2">
                                    {birim.birimAdi}
                                    {isLoading && selectedIndex === index && (
                                        <svg className="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                </div>
                                <div className="text-sm text-white/60">
                                    Rol: {birim.roleName}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Logout Section */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <button
                            onClick={() => {
                                useAuthStore.getState().logout();
                                navigate('/login');
                            }}
                            className="px-6 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 
                                     text-sm font-medium cursor-pointer transition-all duration-300
                                     hover:bg-red-500/30"
                        >
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BirimSelection;
