import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MatrixBackground from '../../shared/components/MatrixBackground';
import { useAuthStore } from '../../store/authStore';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [formData, setFormData] = useState({ sicil: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login({ ...formData, rememberMe });

            // Check if user needs to select birim
            const authState = useAuthStore.getState();
            if (authState.birimleri.length > 1 && !authState.selectedBirim) {
                navigate('/select-birim');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            <MatrixBackground />
            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-[450px] bg-white/5 backdrop-blur-md border border-white/15 rounded-[20px] p-12 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-purple-700 bg-clip-text text-transparent mb-2">
                            Hoş Geldiniz
                        </h1>
                        <p className="text-white/60 text-base">
                            Kurumsal İntranet Portalı
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Error Message */}
                        {error && (
                            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Sicil Input */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="sicil" className="text-white/90 text-[0.95rem] font-medium">
                                Sicil Numarası
                            </label>
                            <input
                                type="text"
                                id="sicil"
                                name="sicil"
                                value={formData.sicil}
                                onChange={handleChange}
                                placeholder="00001"
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-[10px] text-white text-base 
                                         placeholder-white/40 outline-none transition-all duration-300
                                         focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-white/90 text-[0.95rem] font-medium">
                                Şifre
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-[10px] text-white text-base 
                                             placeholder-white/40 outline-none transition-all duration-300
                                             focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/60 
                                             cursor-pointer text-xl p-0 hover:text-white/80 transition-colors"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 cursor-pointer accent-purple-500"
                            />
                            <label htmlFor="remember" className="text-white/70 text-sm cursor-pointer">
                                Beni Hatırla
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 rounded-[10px] text-white text-base font-semibold 
                                      transition-all duration-300 shadow-lg shadow-purple-500/30
                                      ${isLoading 
                                        ? 'bg-purple-500/50 cursor-not-allowed' 
                                        : 'bg-gradient-to-br from-purple-400 to-purple-700 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40'
                                      }`}
                        >
                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>

                    {/* Forgot Password Link */}
                    <div className="mt-6 text-center">
                        <a href="#" className="text-purple-400/90 text-sm no-underline hover:text-purple-300 transition-colors">
                            Şifremi Unuttum
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
