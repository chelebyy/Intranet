import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../../api/usersApi';
import { unvansApi } from '../../../api/unvansApi';
import type { Unvan } from '../../../types/api/unvans';

export const UserCreate: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unvanlar, setUnvanlar] = useState<Unvan[]>([]);

    const [formData, setFormData] = useState({
        ad: '',
        soyad: '',
        sicil: '',
        unvan: '',
        password: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const unvanData = await unvansApi.getAll();
                setUnvanlar(unvanData.filter(u => u.isActive));
            } catch (err) {
                console.error('Error fetching form data:', err);
                setError('Form verileri yüklenirken bir hata oluştu.');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await usersApi.create({
                ad: formData.ad,
                soyad: formData.soyad,
                sicil: formData.sicil,
                unvan: formData.unvan,
                sifre: formData.password
            });
            navigate('/users');
        } catch (err: any) {
            console.error('Error creating user:', err);
            setError(err.message || 'Kullanıcı oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/users')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Yeni Kullanıcı Ekle</h1>
            </div>

            <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                Ad <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ad"
                                value={formData.ad}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Örn: Ahmet"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                Soyad <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="soyad"
                                value={formData.soyad}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Örn: Yılmaz"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                Sicil No <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="sicil"
                                value={formData.sicil}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Örn: 12345"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                Ünvan
                            </label>
                            <select
                                name="unvan"
                                value={formData.unvan}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">Seçiniz</option>
                                {unvanlar.map(unvan => (
                                    <option key={unvan.unvanID} value={unvan.unvanAdi}>
                                        {unvan.unvanAdi}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                Şifre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="En az 12 karakter"
                                minLength={12}
                            />
                        </div>

                    </div>

                    {/* Info box about birim-role assignment */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">info</span>
                            <div>
                                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Birim ve Rol Ataması</p>
                                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                    Kullanıcı oluşturulduktan sonra, düzenleme sayfasından birim ve rol ataması yapabilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-border-color dark:border-dark-border mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/users')}
                            className="px-4 py-2 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Kaydediliyor...
                                </>
                            ) : (
                                'Kaydet'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
