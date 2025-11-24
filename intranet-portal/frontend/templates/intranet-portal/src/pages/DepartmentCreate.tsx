import React, { useState } from 'react';
import { Page } from '../types';

interface DepartmentCreateProps {
    onNavigate: (page: Page) => void;
}

export const DepartmentCreate: React.FC<DepartmentCreateProps> = ({ onNavigate }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
        onNavigate(Page.DEPARTMENT_LIST);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4 text-sm text-text-secondary">
             <span>Yönetim Paneli</span> 
             <span className="material-symbols-outlined text-sm">chevron_right</span>
             <span className="cursor-pointer hover:text-primary" onClick={() => onNavigate(Page.DEPARTMENT_LIST)}>Birimler</span>
             <span className="material-symbols-outlined text-sm">chevron_right</span>
             <span className="text-text-primary font-medium">Yeni Ekle</span>
        </div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-8">Yeni Birim Ekle</h1>

        <div className="bg-card border border-border-color rounded-xl p-8 shadow-sm">
            <form onSubmit={handleSave}>
                <div className="mb-10">
                    <h2 className="text-lg font-bold text-text-primary pb-3 border-b border-border-color mb-6">Birim Temel Bilgileri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-primary">Birim Adı <span className="text-red-500">*</span></label>
                            <input required type="text" placeholder="Örn: İnsan Kaynakları Departmanı" className="form-input rounded-lg border border-border-color h-12 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary/80" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-primary">Birim Kodu</label>
                            <input type="text" placeholder="Örn: HR-01" className="form-input rounded-lg border border-border-color h-12 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary/80" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-primary">Üst Birimi</label>
                            <div className="relative">
                                <select className="form-select w-full rounded-lg border border-border-color h-12 px-4 appearance-none focus:ring-2 focus:ring-primary/50 focus:border-primary/80 bg-white">
                                    <option value="">Seçiniz (Opsiyonel)</option>
                                    <option value="1">Genel Müdürlük</option>
                                    <option value="2">Mühendislik Departmanı</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">expand_more</span>
                            </div>
                        </div>
                         <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-medium text-text-primary">Açıklama</label>
                            <textarea rows={4} placeholder="Birimle ilgili kısa bir açıklama giriniz." className="form-textarea rounded-lg border border-border-color p-4 focus:ring-2 focus:ring-primary/50 focus:border-primary/80 resize-none"></textarea>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <h2 className="text-lg font-bold text-text-primary pb-3 border-b border-border-color mb-6">Yetkilendirme ve Durum</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-primary">Birim Sorumlusu</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
                                <input type="text" placeholder="Kullanıcı ara..." className="form-input w-full rounded-lg border border-border-color h-12 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary/80" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-primary">Durum</label>
                            <div className="h-12 flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    <span className="ml-3 text-sm font-medium text-text-secondary">Aktif</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-border-color pt-6">
                    <button type="button" onClick={() => onNavigate(Page.DEPARTMENT_LIST)} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-text-secondary border border-border-color hover:bg-slate-50 transition-colors">İptal</button>
                    <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm">Kaydet</button>
                </div>
            </form>
        </div>

        {showSuccess && (
            <div className="fixed bottom-5 right-5 flex items-center gap-4 bg-green-600 text-white p-4 rounded-lg shadow-lg animate-bounce">
                <span className="material-symbols-outlined">check_circle</span>
                <div>
                    <p className="font-bold">Başarılı</p>
                    <p className="text-sm">Birim başarıyla oluşturuldu.</p>
                </div>
                <button onClick={() => setShowSuccess(false)} className="ml-auto p-1 hover:bg-green-700 rounded-full">
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
        )}
    </div>
  );
};