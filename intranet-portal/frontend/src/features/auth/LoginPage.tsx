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
            <div style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '450px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    padding: '3rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.5rem'
                        }}>
                            Hoş Geldiniz
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem' }}>
                            Kurumsal İntranet Portalı
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {error && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#fca5a5',
                                fontSize: '0.875rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="sicil" style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                            }}>
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
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '10px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="password" style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                            }}>
                                Şifre
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 3rem 0.75rem 1rem',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '10px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        cursor: 'pointer',
                                        fontSize: '1.25rem',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                            />
                            <label htmlFor="remember" style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.875rem',
                                cursor: 'pointer'
                            }}>
                                Beni Hatırla
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                background: isLoading
                                    ? 'rgba(102, 126, 234, 0.5)'
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 20px -5px rgba(102, 126, 234, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(102, 126, 234, 0.5)';
                                }
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(102, 126, 234, 0.3)';
                            }}
                        >
                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <a href="#" style={{
                            color: 'rgba(102, 126, 234, 0.9)',
                            fontSize: '0.875rem',
                            textDecoration: 'none'
                        }}>
                            Şifremi Unuttum
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
