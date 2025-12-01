import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import MatrixBackground from '../../shared/components/MatrixBackground';

const BirimSelection: React.FC = () => {
    const navigate = useNavigate();
    const { user, birimleri, selectBirim } = useAuthStore();

    const handleSelectBirim = (birimIndex: number) => {
        const selectedBirim = birimleri[birimIndex];
        selectBirim(selectedBirim);
        navigate('/dashboard');
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
                                className="w-full p-6 bg-white/10 border border-white/20 rounded-xl text-left cursor-pointer 
                                         transition-all duration-300 flex flex-col gap-2
                                         hover:bg-purple-500/20 hover:border-purple-500/60 hover:-translate-y-0.5"
                            >
                                <div className="text-xl font-semibold text-white">
                                    {birim.birimAdi}
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
