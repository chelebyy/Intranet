import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../../api/usersApi';
import { birimsApi } from '../../../api/birimsApi';
import { rolesApi } from '../../../api/rolesApi';
import type { Birim } from '../../../types/api/birims';
import type { Role } from '../../../types/api/roles';

export const UserCreate: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [birimler, setBirimler] = useState<Birim[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [formData, setFormData] = useState({
        adSoyad: '',
        sicil: '',
        unvan: '',
        password: '',
        birimId: '',
        roleId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [birimData, roleData] = await Promise.all([
                    birimsApi.getAll(),
                    rolesApi.getAll()
                ]);
                setBirimler(birimData);
                setRoles(roleData);
            } catch (err) {
                console.error('Error fetching form data:', err);
                setError('Birim ve rol listesi yüklenirken bir hata oluştu.');
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
                adSoyad: formData.adSoyad,
                sicil: formData.sicil,
                unvan: formData.unvan,
                sifre: formData.password, // Map password to sifre
                birimId: formData.birimId ? Number(formData.birimId) : undefined,
                roleId: formData.roleId ? Number(formData.roleId) : undefined
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
                                Ad Soyad <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="adSoyad"
                                value={formData.adSoyad}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Örn: Ahmet Yılmaz"
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
                            <input
                                type="text"
                                name="unvan"
                                value={formData.unvan}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Örn: Uzman"
                            />
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                Birim
                            </label>
                            <select
                                name="birimId"
                                value={formData.birimId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">Seçiniz</option>
                                {birimler.map(birim => (
                                    <option key={birim.birimID} value={birim.birimID}>
                                        {birim.birimAdi}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                Rol
                            </label>
                            <select
                                name="roleId"
                                value={formData.roleId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">Seçiniz</option>
                                {roles.map(role => (
                                    <option key={role.roleID} value={role.roleID}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>
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
