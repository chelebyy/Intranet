import React from 'react';
import { Page } from '../types';

interface UserCreateProps {
    onNavigate: (page: Page) => void;
}

export const UserCreate: React.FC<UserCreateProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4 text-sm text-text-secondary items-center">
            <span className="cursor-pointer hover:text-primary">Yönetim Paneli</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="cursor-pointer hover:text-primary" onClick={() => onNavigate(Page.USER_LIST)}>Kullanıcılar</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-text-primary font-medium">Yeni Kullanıcı Oluştur</span>
        </div>

        <h1 className="text-3xl font-black text-text-primary mb-8 tracking-tight">Yeni Kullanıcı Oluştur</h1>

        <form className="flex flex-col gap-6">
            {/* Basic Info */}
            <div className="bg-card border border-border-color rounded-xl shadow-sm overflow-hidden">
                <h3 className="bg-background px-6 py-4 border-b border-border-color font-bold text-text-primary">Temel Bilgiler</h3>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-text-primary font-medium">Profil Fotoğrafı Yükle</p>
                        </div>
                        <button type="button" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-text-primary rounded-lg text-sm font-medium transition-colors">Dosya Seç</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-text-primary">Ad</label>
                            <input type="text" className="form-input rounded-lg border-border-color focus:ring-primary focus:border-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-text-primary">Soyad</label>
                            <input type="text" className="form-input rounded-lg border-border-color focus:ring-primary focus:border-primary" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-primary">Sicil</label>
                        <input type="text" className="form-input rounded-lg border-border-color focus:ring-primary focus:border-primary w-full" />
                    </div>
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-card border border-border-color rounded-xl shadow-sm overflow-hidden">
                <h3 className="bg-background px-6 py-4 border-b border-border-color font-bold text-text-primary">Hesap ve Yetki Bilgileri</h3>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-text-primary">Kullanıcı Rolü</label>
                            <select className="form-select rounded-lg border-border-color focus:ring-primary focus:border-primary">
                                <option>Standart Kullanıcı</option>
                                <option>Admin</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-text-primary">Departman</label>
                            <select className="form-select rounded-lg border-border-color focus:ring-primary focus:border-primary">
                                <option>İnsan Kaynakları</option>
                                <option>IT</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-text-primary">Şifre</label>
                            <div className="relative">
                                <input type="password" className="form-input w-full rounded-lg border-border-color focus:ring-primary focus:border-primary pr-10" />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                                    <span className="material-symbols-outlined text-xl">visibility_off</span>
                                </button>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">En az 8 karakter, 1 büyük harf ve 1 rakam içermelidir.</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-text-primary">Şifre Doğrula</label>
                            <input type="password" className="form-input rounded-lg border-border-color focus:ring-primary focus:border-primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings */}
             <div className="bg-card border border-border-color rounded-xl shadow-sm overflow-hidden">
                <h3 className="bg-background px-6 py-4 border-b border-border-color font-bold text-text-primary">Hesap Durumu ve Ayarlar</h3>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-text-primary">Hesap Aktif</span>
                            <span className="text-sm text-text-secondary">Kullanıcı sisteme giriş yapabilir.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-text-primary">Hoş geldin e-postası gönder</span>
                            <span className="text-sm text-text-secondary">Kullanıcıya hesap bilgileri e-posta ile bildirilsin.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => onNavigate(Page.USER_LIST)} className="px-6 py-2.5 bg-white border border-border-color text-text-primary font-medium rounded-lg hover:bg-slate-50 transition-colors">İptal Et</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">Kullanıcı Oluştur</button>
            </div>
        </form>
    </div>
  );
};