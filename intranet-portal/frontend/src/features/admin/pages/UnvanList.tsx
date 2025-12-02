import React, { useState, useEffect } from 'react';
import { unvansApi } from '../../../api/unvansApi';
import type { Unvan } from '../../../types/api/unvans';

export const UnvanList: React.FC = () => {
    const [unvanlar, setUnvanlar] = useState<Unvan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUnvan, setEditingUnvan] = useState<Unvan | null>(null);
    const [formData, setFormData] = useState({
        unvanAdi: '',
        aciklama: '',
        isActive: true
    });
    const [saving, setSaving] = useState(false);

    const fetchUnvanlar = async () => {
        try {
            setLoading(true);
            const data = await unvansApi.getAll();
            setUnvanlar(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching unvanlar:', err);
            setError('Ünvanlar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnvanlar();
    }, []);

    const handleOpenModal = (unvan?: Unvan) => {
        if (unvan) {
            setEditingUnvan(unvan);
            setFormData({
                unvanAdi: unvan.unvanAdi,
                aciklama: unvan.aciklama || '',
                isActive: unvan.isActive
            });
        } else {
            setEditingUnvan(null);
            setFormData({
                unvanAdi: '',
                aciklama: '',
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUnvan(null);
        setFormData({
            unvanAdi: '',
            aciklama: '',
            isActive: true
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (editingUnvan) {
                await unvansApi.update(editingUnvan.unvanID, formData);
            } else {
                await unvansApi.create(formData);
            }
            handleCloseModal();
            fetchUnvanlar();
        } catch (err: any) {
            console.error('Error saving unvan:', err);
            setError(err.response?.data?.error?.message || 'Ünvan kaydedilirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu ünvanı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            await unvansApi.delete(id);
            fetchUnvanlar();
        } catch (err: any) {
            console.error('Error deleting unvan:', err);
            setError('Ünvan silinirken bir hata oluştu.');
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-8 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Ünvan Tanımlamaları</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary text-sm mt-1">
                        Sistemde kullanılacak ünvanları buradan yönetebilirsiniz.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-xl">add</span>
                    Yeni Ünvan
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border-color dark:border-dark-border">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary dark:text-dark-text-primary">Ünvan Adı</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary dark:text-dark-text-primary">Açıklama</th>
                            <th className="text-center px-6 py-4 text-sm font-semibold text-text-primary dark:text-dark-text-primary">Durum</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-text-primary dark:text-dark-text-primary">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unvanlar.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-text-secondary dark:text-dark-text-secondary">
                                    Henüz ünvan tanımlanmamış.
                                </td>
                            </tr>
                        ) : (
                            unvanlar.map((unvan) => (
                                <tr key={unvan.unvanID} className="border-b border-border-color dark:border-dark-border last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-text-primary dark:text-dark-text-primary">{unvan.unvanAdi}</span>
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary dark:text-dark-text-secondary">
                                        {unvan.aciklama || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            unvan.isActive 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {unvan.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(unvan)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <span className="material-symbols-outlined text-xl text-text-secondary dark:text-dark-text-secondary">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(unvan.unvanID)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <span className="material-symbols-outlined text-xl text-red-500">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl shadow-xl w-full max-w-md mx-4">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color dark:border-dark-border">
                            <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                                {editingUnvan ? 'Ünvan Düzenle' : 'Yeni Ünvan Ekle'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl text-text-secondary dark:text-dark-text-secondary">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                    Ünvan Adı <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.unvanAdi}
                                    onChange={(e) => setFormData(prev => ({ ...prev, unvanAdi: e.target.value }))}
                                    required
                                    className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Örn: Uzman, Müdür, Şef"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                    Açıklama
                                </label>
                                <textarea
                                    value={formData.aciklama}
                                    onChange={(e) => setFormData(prev => ({ ...prev, aciklama: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    placeholder="Ünvan hakkında açıklama..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="w-4 h-4 rounded border-border-color dark:border-dark-border text-primary focus:ring-primary/50"
                                />
                                <label htmlFor="isActive" className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                    Aktif
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
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
                </div>
            )}
        </div>
    );
};
