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
                    maxWidth: '600px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '0.5rem'
                        }}>
                            Hoş Geldiniz, {user.ad} {user.soyad}
                        </div>
                        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem' }}>
                            Lütfen çalışmak istediğiniz birimi seçin
                        </p>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {birimleri.map((birim, index) => (
                            <button
                                key={birim.birimId}
                                onClick={() => handleSelectBirim(index)}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.6)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: 'white'
                                }}>
                                    {birim.birimAdi}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: 'rgba(255, 255, 255, 0.6)'
                                }}>
                                    Rol: {birim.roleName}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center'
                    }}>
                        <button
                            onClick={() => {
                                useAuthStore.getState().logout();
                                navigate('/login');
                            }}
                            style={{
                                padding: '0.5rem 1.5rem',
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                borderRadius: '8px',
                                color: '#fca5a5',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            }}
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
