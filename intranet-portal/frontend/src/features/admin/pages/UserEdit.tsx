import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usersApi } from '../../../api/usersApi';
import { unvansApi } from '../../../api/unvansApi';
import { birimsApi } from '../../../api/birimsApi';
import { rolesApi } from '../../../api/rolesApi';
import type { Unvan } from '../../../types/api/unvans';
import type { UserDto } from '../../../types/api/users';
import type { Birim } from '../../../types/api/birims';
import type { Role } from '../../../types/api/roles';

export const UserEdit: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unvanlar, setUnvanlar] = useState<Unvan[]>([]);
    const [birimler, setBirimler] = useState<Birim[]>([]);
    const [roller, setRoller] = useState<Role[]>([]);
    const [user, setUser] = useState<UserDto | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'assignments' | 'permissions'>('general');
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignmentForm, setAssignmentForm] = useState({ birimId: '', roleId: '' });
    const [assignmentSaving, setAssignmentSaving] = useState(false);

    const [formData, setFormData] = useState({
        ad: '',
        soyad: '',
        sicil: '',
        unvan: '',
        isActive: true
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const [userData, unvanData, birimData, roleData] = await Promise.all([
                    usersApi.getById(Number(id)),
                    unvansApi.getAll(),
                    birimsApi.getAll(),
                    rolesApi.getAll()
                ]);
                
                setUser(userData);
                setUnvanlar(unvanData.filter(u => u.isActive));
                setBirimler(birimData.filter(b => b.isActive));
                setRoller(roleData);
                
                setFormData({
                    ad: userData.ad || '',
                    soyad: userData.soyad || '',
                    sicil: userData.sicil || '',
                    unvan: userData.unvan || '',
                    isActive: userData.isActive
                });
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        
        setSaving(true);
        setError(null);

        try {
            await usersApi.update(Number(id), {
                ad: formData.ad,
                soyad: formData.soyad,
                sicil: formData.sicil,
                unvan: formData.unvan,
                isActive: formData.isActive
            });
            navigate('/users');
        } catch (err: any) {
            console.error('Error updating user:', err);
            setError(err.response?.data?.error?.message || 'Kullanıcı güncellenirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const refreshUser = async () => {
        if (!id) return;
        try {
            const userData = await usersApi.getById(Number(id));
            setUser(userData);
        } catch (err) {
            console.error('Error refreshing user:', err);
        }
    };

    const handleAddAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !assignmentForm.birimId || !assignmentForm.roleId) return;

        setAssignmentSaving(true);
        setError(null);

        try {
            await usersApi.addBirimRole(
                Number(id),
                Number(assignmentForm.birimId),
                Number(assignmentForm.roleId)
            );
            setShowAssignmentModal(false);
            setAssignmentForm({ birimId: '', roleId: '' });
            await refreshUser();
        } catch (err: any) {
            console.error('Error adding assignment:', err);
            setError(err.response?.data?.error?.message || 'Atama eklenirken bir hata oluştu.');
        } finally {
            setAssignmentSaving(false);
        }
    };

    const handleRemoveAssignment = async (birimId: number) => {
        if (!id) return;
        if (!confirm('Bu atamayı kaldırmak istediğinizden emin misiniz?')) return;

        try {
            await usersApi.removeBirimRole(Number(id), birimId);
            await refreshUser();
        } catch (err: any) {
            console.error('Error removing assignment:', err);
            setError(err.response?.data?.error?.message || 'Atama kaldırılırken bir hata oluştu.');
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 md:p-8">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                    Kullanıcı bulunamadı.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/users')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Kullanıcı Düzenle</h1>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                        {user?.ad} {user?.soyad} - {user?.sicil}
                    </p>
                </div>
                <div className="ml-auto">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        formData.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                        {formData.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-border-color dark:border-dark-border mb-6">
                <nav className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'general'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg align-middle mr-2">person</span>
                        Genel Bilgiler
                    </button>
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'assignments'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg align-middle mr-2">assignment_ind</span>
                        Birim & Rol Atamaları
                    </button>
                    <button
                        onClick={() => setActiveTab('permissions')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'permissions'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg align-middle mr-2">security</span>
                        Sayfa Yetkileri
                    </button>
                </nav>
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="ad" className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                    Ad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="ad"
                                    name="ad"
                                    value={formData.ad}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Örn: Ahmet"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="soyad" className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                    Soyad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="soyad"
                                    name="soyad"
                                    value={formData.soyad}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Örn: Yılmaz"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="sicil" className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                    Sicil No <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="sicil"
                                    name="sicil"
                                    value={formData.sicil}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Örn: 12345"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="unvan" className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                    Ünvan
                                </label>
                                <select
                                    id="unvan"
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
                        </div>

                        {/* Active/Passive Toggle */}
                        <div className="pt-4 border-t border-border-color dark:border-dark-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-text-primary dark:text-dark-text-primary">Kullanıcı Durumu</h3>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                        Pasif kullanıcılar sisteme giriş yapamaz
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    <span className="ms-3 text-sm font-medium text-text-primary dark:text-dark-text-primary">
                                        {formData.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-border-color dark:border-dark-border">
                            <button
                                type="button"
                                onClick={() => navigate('/users')}
                                className="px-4 py-2 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving ? (
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
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
                <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Birim & Rol Atamaları</h2>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                Kullanıcının atandığı birimler ve sahip olduğu roller
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAssignmentModal(true)}
                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Yeni Atama Ekle
                        </button>
                    </div>

                    {user?.birimRoles && user.birimRoles.length > 0 ? (
                        <div className="space-y-3">
                            {user.birimRoles.map((br) => (
                                <div key={`${br.birimID}-${br.roleID}`} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-border-color dark:border-dark-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">apartment</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary dark:text-dark-text-primary">{br.birimAdi}</p>
                                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">badge</span>
                                                {br.roleName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAssignment(br.birimID)}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Kaldır"
                                        >
                                            <span className="material-symbols-outlined text-red-500">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-text-secondary dark:text-dark-text-secondary">assignment_ind</span>
                            </div>
                            <h3 className="text-lg font-medium text-text-primary dark:text-dark-text-primary mb-2">Henüz atama yapılmamış</h3>
                            <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                                Bu kullanıcıya birim ve rol atamak için yukarıdaki butonu kullanın.
                            </p>
                        </div>
                    )}

                    {/* Available Birims and Roles for reference */}
                    <div className="mt-6 pt-6 border-t border-border-color dark:border-dark-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-3">Mevcut Birimler</h3>
                                <div className="flex flex-wrap gap-2">
                                    {birimler.map(birim => (
                                        <span key={birim.birimID} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                                            {birim.birimAdi}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-3">Mevcut Roller</h3>
                                <div className="flex flex-wrap gap-2">
                                    {roller.map(rol => (
                                        <span key={rol.roleID} className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                                            {rol.roleName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
                <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Sayfa Yetkileri</h2>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                Kullanıcının erişebildiği sayfalar ve modüller
                            </p>
                        </div>
                    </div>

                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-amber-600 dark:text-amber-400">construction</span>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary dark:text-dark-text-primary mb-2">Yakında Eklenecek</h3>
                        <p className="text-text-secondary dark:text-dark-text-secondary max-w-md mx-auto">
                            Sayfa bazlı yetkilendirme sistemi henüz geliştirme aşamasındadır. 
                            Bu özellik ile kullanıcılara özel sayfa erişim yetkileri tanımlayabileceksiniz.
                        </p>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {showAssignmentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl shadow-xl w-full max-w-md mx-4">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color dark:border-dark-border">
                            <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                                Yeni Birim-Rol Ataması
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAssignmentModal(false);
                                    setAssignmentForm({ birimId: '', roleId: '' });
                                }}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl text-text-secondary dark:text-dark-text-secondary">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddAssignment} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="birimId" className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                    Birim <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="birimId"
                                    value={assignmentForm.birimId}
                                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, birimId: e.target.value }))}
                                    required
                                    className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="">Birim Seçiniz</option>
                                    {birimler.map(birim => (
                                        <option key={birim.birimID} value={birim.birimID}>
                                            {birim.birimAdi}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="roleId" className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                    Rol <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="roleId"
                                    value={assignmentForm.roleId}
                                    onChange={(e) => setAssignmentForm(prev => ({ ...prev, roleId: e.target.value }))}
                                    required
                                    className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="">Rol Seçiniz</option>
                                    {roller.map(rol => (
                                        <option key={rol.roleID} value={rol.roleID}>
                                            {rol.roleName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAssignmentModal(false);
                                        setAssignmentForm({ birimId: '', roleId: '' });
                                    }}
                                    className="px-4 py-2 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={assignmentSaving}
                                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {assignmentSaving ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        'Ata'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
