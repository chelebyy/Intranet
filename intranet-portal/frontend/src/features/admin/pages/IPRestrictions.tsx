import React, { useState, useEffect } from 'react';
import { ipRestrictionsApi } from '../../../api/ipRestrictionsApi';
import type { IPRestriction, CreateIPRestrictionDto } from '../../../api/ipRestrictionsApi';
import toast from 'react-hot-toast';

export const IPRestrictions: React.FC = () => {
    const [restrictions, setRestrictions] = useState<IPRestriction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [formData, setFormData] = useState<CreateIPRestrictionDto>({
        ipAddress: '',
        description: '',
        type: 'Whitelist'
    });

    useEffect(() => {
        fetchRestrictions();
    }, []);

    const fetchRestrictions = async () => {
        try {
            setLoading(true);
            const data = await ipRestrictionsApi.getAll();
            setRestrictions(data);
        } catch (error) {
            console.error('IP kuralları yüklenirken hata:', error);
            toast.error('IP kuralları yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.ipAddress) {
            toast.error('IP adresi gerekli');
            return;
        }

        try {
            await ipRestrictionsApi.create(formData);
            toast.success('IP kuralı eklendi');
            setShowModal(false);
            setFormData({ ipAddress: '', description: '', type: 'Whitelist' });
            fetchRestrictions();
        } catch (error) {
            console.error('IP kuralı eklenirken hata:', error);
            toast.error('IP kuralı eklenemedi');
        }
    };

    const handleToggleActive = async (restriction: IPRestriction) => {
        try {
            await ipRestrictionsApi.update(restriction.id, { isActive: !restriction.isActive });
            toast.success(restriction.isActive ? 'Kural devre dışı bırakıldı' : 'Kural aktifleştirildi');
            fetchRestrictions();
        } catch (error) {
            console.error('Kural güncellenirken hata:', error);
            toast.error('Kural güncellenemedi');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await ipRestrictionsApi.delete(id);
            toast.success('IP kuralı silindi');
            setDeleteConfirm(null);
            fetchRestrictions();
        } catch (error) {
            console.error('IP kuralı silinirken hata:', error);
            toast.error('IP kuralı silinemedi');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('tr-TR');
    };

    return (
        <div className="p-6 md:p-8 flex flex-col h-full w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">IP Kısıtlamaları</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Sisteme erişim izni verilen veya engellenen IP adreslerini yönetin.
                    </p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm shadow-sm transition-colors"
                >
                    <span className="material-symbols-outlined">add</span>
                    Yeni Kural Ekle
                </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</span>
                        <div>
                            <h3 className="font-semibold text-green-800 dark:text-green-300">Whitelist</h3>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                {restrictions.filter(r => r.type === 'Whitelist' && r.isActive).length} aktif kural
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">block</span>
                        <div>
                            <h3 className="font-semibold text-red-800 dark:text-red-300">Blacklist</h3>
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {restrictions.filter(r => r.type === 'Blacklist' && r.isActive).length} aktif kural
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex-1">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : restrictions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-text-secondary dark:text-dark-text-secondary">
                        <span className="material-symbols-outlined text-5xl mb-2">security</span>
                        <p>Henüz IP kuralı bulunmuyor</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary dark:text-dark-text-secondary">
                            <thead className="text-xs text-text-primary dark:text-dark-text-primary uppercase bg-slate-50 dark:bg-slate-800 border-b border-border-color dark:border-dark-border">
                                <tr>
                                    <th className="px-6 py-3">IP Adresi</th>
                                    <th className="px-6 py-3">Tip</th>
                                    <th className="px-6 py-3">Açıklama</th>
                                    <th className="px-6 py-3">Durum</th>
                                    <th className="px-6 py-3">Oluşturulma</th>
                                    <th className="px-6 py-3">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-dark-border">
                                {restrictions.map((restriction) => (
                                    <tr key={restriction.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-dark-card">
                                        <td className="px-6 py-4 font-mono font-medium text-text-primary dark:text-dark-text-primary">
                                            {restriction.ipAddress}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                                restriction.type === 'Whitelist' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {restriction.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{restriction.description || '-'}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(restriction)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                                    restriction.isActive 
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400 hover:bg-slate-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${restriction.isActive ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                                                {restriction.isActive ? 'Aktif' : 'Pasif'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-xs">{formatDate(restriction.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            {deleteConfirm === restriction.id ? (
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleDelete(restriction.id)}
                                                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                                    >
                                                        Onayla
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-xs rounded hover:bg-slate-300"
                                                    >
                                                        İptal
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setDeleteConfirm(restriction.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card dark:bg-dark-card rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color dark:border-dark-border">
                            <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                                Yeni IP Kuralı
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
                                    IP Adresi / CIDR
                                </label>
                                <input
                                    type="text"
                                    value={formData.ipAddress}
                                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                                    className="w-full px-3 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="192.168.1.1 veya 192.168.1.0/24"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
                                    Tip
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Whitelist' | 'Blacklist' })}
                                    className="w-full px-3 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="Whitelist">Whitelist (İzin Ver)</option>
                                    <option value="Blacklist">Blacklist (Engelle)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
                                    Açıklama
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Örn: Ofis ağı"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80 rounded-lg transition-colors"
                                >
                                    Ekle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
