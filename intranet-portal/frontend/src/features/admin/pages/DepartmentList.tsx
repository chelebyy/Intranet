import React, { useState, useEffect } from 'react';
import { birimsApi } from '../../../api/birimsApi';
import type { Birim, CreateBirimRequest } from '../../../types/api/birims';
import toast from 'react-hot-toast';

export const DepartmentList: React.FC = () => {
    const [birimler, setBirimler] = useState<Birim[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBirim, setEditingBirim] = useState<Birim | null>(null);
    const [formData, setFormData] = useState<CreateBirimRequest>({
        birimAdi: '',
        aciklama: '',
        isActive: true
    });

    useEffect(() => {
        fetchBirimler();
    }, []);

    const fetchBirimler = async () => {
        try {
            setLoading(true);
            const data = await birimsApi.getAll();
            setBirimler(data);
        } catch (error) {
            console.error('Birimler yüklenirken hata:', error);
            toast.error('Birimler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBirim) {
                await birimsApi.update(editingBirim.birimID, formData);
                toast.success('Birim başarıyla güncellendi');
            } else {
                await birimsApi.create(formData);
                toast.success('Birim başarıyla oluşturuldu');
            }
            setShowModal(false);
            setEditingBirim(null);
            setFormData({ birimAdi: '', aciklama: '', isActive: true });
            fetchBirimler();
        } catch (error) {
            console.error('Birim kaydedilirken hata:', error);
            toast.error('Birim kaydedilemedi');
        }
    };

    const handleEdit = (birim: Birim) => {
        setEditingBirim(birim);
        setFormData({
            birimAdi: birim.birimAdi,
            aciklama: birim.aciklama || '',
            isActive: birim.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (birimId: number) => {
        if (!confirm('Bu birimi silmek istediğinizden emin misiniz?')) return;
        try {
            await birimsApi.delete(birimId);
            toast.success('Birim başarıyla silindi');
            fetchBirimler();
        } catch (error) {
            console.error('Birim silinirken hata:', error);
            toast.error('Birim silinemedi');
        }
    };

    const openCreateModal = () => {
        setEditingBirim(null);
        setFormData({ birimAdi: '', aciklama: '', isActive: true });
        setShowModal(true);
    };

    return (
        <div className="p-6 md:p-8 flex flex-col h-full w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Birim Yönetimi</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Sistemdeki birimleri yönetin.
                        <span className="font-medium ml-1">({birimler.length} birim)</span>
                    </p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm shadow-sm transition-colors"
                >
                    <span className="material-symbols-outlined">add</span>
                    Yeni Birim Ekle
                </button>
            </div>

            {/* Birim Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : birimler.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 text-text-secondary dark:text-dark-text-secondary">
                        <span className="material-symbols-outlined text-5xl mb-2">corporate_fare</span>
                        <p>Henüz birim bulunmuyor</p>
                    </div>
                ) : (
                    birimler.map((birim) => (
                        <div 
                            key={birim.birimID} 
                            className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <span className="material-symbols-outlined text-primary">corporate_fare</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">
                                            {birim.birimAdi}
                                        </h3>
                                        <span className={`inline-flex items-center gap-1 text-xs ${birim.isActive ? 'text-green-600' : 'text-slate-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${birim.isActive ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                            {birim.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {birim.aciklama && (
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4 line-clamp-2">
                                    {birim.aciklama}
                                </p>
                            )}
                            
                            <div className="flex items-center gap-2 pt-3 border-t border-border-color dark:border-dark-border">
                                <button 
                                    onClick={() => handleEdit(birim)}
                                    className="flex-1 px-3 py-1.5 text-sm text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    Düzenle
                                </button>
                                <button 
                                    onClick={() => handleDelete(birim.birimID)}
                                    className="flex-1 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card dark:bg-dark-card rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
                            {editingBirim ? 'Birim Düzenle' : 'Yeni Birim Oluştur'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                                    Birim Adı *
                                </label>
                                <input
                                    type="text"
                                    value={formData.birimAdi}
                                    onChange={(e) => setFormData({ ...formData, birimAdi: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Örn: İnsan Kaynakları"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                                    Açıklama
                                </label>
                                <textarea
                                    value={formData.aciklama}
                                    onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    placeholder="Birim hakkında kısa açıklama..."
                                />
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 accent-primary"
                                />
                                <label htmlFor="isActive" className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                    Aktif
                                </label>
                            </div>
                            
                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-border-color dark:border-dark-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors font-medium"
                                >
                                    {editingBirim ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
