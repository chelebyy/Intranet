import React, { useState } from 'react';
import MatrixBackground from './MatrixBackground';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({ sicil: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
        // Login işlemleri burada yapılacak
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Arka Plan Efekti */}
            <MatrixBackground />

            {/* Login Kutusu */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                position: 'relative',
                zIndex: 1,
                padding: '20px'
            }}>
                <div style={{
                    background: 'rgba(23, 26, 33, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{
                            color: '#fff',
                            textShadow: '0 0 10px rgba(74, 158, 255, 0.8), 0 0 20px rgba(74, 158, 255, 0.8)',
                            marginBottom: '0.5rem',
                            fontSize: '2rem',
                            fontWeight: 600
                        }}>Hoş Geldiniz</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Sicil No Input */}
                        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Sicil Numarası"
                                value={formData.sicil}
                                onChange={(e) => setFormData({ ...formData, sicil: e.target.value })}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    width: '100%',
                                    height: '45px',
                                    padding: '0.5rem 1rem 0.5rem 2.5rem',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                </svg>
                            </div>
                        </div>

                        {/* Şifre Input */}
                        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Şifre"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                style={{
                                    background: 'rgba(35, 40, 50, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    width: '100%',
                                    height: '45px',
                                    padding: '0.5rem 2.5rem 0.5rem 2.5rem',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                </svg>
                            </div>
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                    </svg>
                                )}
                                import React, {useState} from 'react';
                                import MatrixBackground from './MatrixBackground';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({sicil: '', password: '' });
                                const [showPassword, setShowPassword] = useState(false);
                                const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
                                    e.preventDefault();
                                console.log('Login attempt:', formData);
        // Login işlemleri burada yapılacak
    };

                                return (
                                <div style={{ position: 'relative', minHeight: '100vh' }}>
                                    {/* Arka Plan Efekti */}
                                    <MatrixBackground />

                                    {/* Login Kutusu */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: '100vh',
                                        position: 'relative',
                                        zIndex: 1,
                                        padding: '20px'
                                    }}>
                                        <div style={{
                                            background: 'rgba(23, 26, 33, 0.8)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                            borderRadius: '12px',
                                            padding: '2.5rem',
                                            width: '100%',
                                            maxWidth: '400px',
                                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                                        }}>
                                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                                <h2 style={{
                                                    color: '#fff',
                                                    textShadow: '0 0 10px rgba(74, 158, 255, 0.8), 0 0 20px rgba(74, 158, 255, 0.8)',
                                                    marginBottom: '0.5rem',
                                                    fontSize: '2rem',
                                                    fontWeight: 600
                                                }}>Hoş Geldiniz</h2>
                                            </div>

                                            <form onSubmit={handleSubmit}>
                                                {/* Sicil No Input */}
                                                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Sicil Numarası"
                                                        value={formData.sicil}
                                                        onChange={(e) => setFormData({ ...formData, sicil: e.target.value })}
                                                        style={{
                                                            background: 'rgba(255, 255, 255, 0.1)',
                                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                                            borderRadius: '8px',
                                                            color: '#ffffff',
                                                            width: '100%',
                                                            height: '45px',
                                                            padding: '0.5rem 1rem 0.5rem 2.5rem',
                                                            outline: 'none',
                                                            fontSize: '1rem'
                                                        }}
                                                    />
                                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Şifre Input */}
                                                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Şifre"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        style={{
                                                            background: 'rgba(35, 40, 50, 0.8)',
                                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                                            borderRadius: '8px',
                                                            color: '#ffffff',
                                                            width: '100%',
                                                            height: '45px',
                                                            padding: '0.5rem 2.5rem 0.5rem 2.5rem',
                                                            outline: 'none',
                                                            fontSize: '1rem'
                                                        }}
                                                    />
                                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                                        </svg>
                                                    </div>
                                                    <div
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{
                                                            position: 'absolute',
                                                            right: '1rem',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            color: 'rgba(255, 255, 255, 0.5)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {showPassword ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Beni Hatırla */}
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                    <div style={{ position: 'relative', width: '18px', height: '18px', marginRight: '8px' }}>
                                                        <input
                                                            type="checkbox"
                                                            id="rememberMe"
                                                            checked={rememberMe}
                                                            onChange={(e) => setRememberMe(e.target.checked)}
                                                            style={{
                                                                position: 'absolute',
                                                                opacity: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                zIndex: 2,
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '18px',
                                                            height: '18px',
                                                            background: 'rgba(255, 255, 255, 0.1)',
                                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                                            borderRadius: '4px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            {rememberMe && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#4a9eff" viewBox="0 0 16 16">
                                                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <label htmlFor="rememberMe" style={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                        Beni Hatırla
                                                    </label>
                                                </div>

                                                {/* Buton */}
                                                <button
                                                    type="submit"
                                                    style={{
                                                        background: 'linear-gradient(45deg, #4a9eff, #6d18ff)',
                                                        border: 'none',
                                                        color: 'white',
                                                        width: '100%',
                                                        height: '45px',
                                                        borderRadius: '8px',
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        letterSpacing: '0.5px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.background = 'linear-gradient(45deg, #3a8eff, #5d08ff)';
                                                        e.currentTarget.style.boxShadow = '0 0 20px rgba(74, 158, 255, 0.4)';
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.background = 'linear-gradient(45deg, #4a9eff, #6d18ff)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                                                        <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z" />
                                                        <path fillRule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                                                    </svg>
                                                    Giriş Yap
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div >
                                );
};

                                export default LoginPage;
