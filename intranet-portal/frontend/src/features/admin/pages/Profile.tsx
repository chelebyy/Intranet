import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { profileApi } from '../../../api/profileApi';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, selectedBirim } = useAuthStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) {
    return <div>Kullanıcı bilgileri bulunamadı.</div>;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Şifre en az 8 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      await profileApi.changePassword(passwordData);
      toast.success('Şifre değiştirildi');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      console.error('Şifre değiştirilirken hata:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Şifre değiştirilemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col h-full w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Profil Bilgileri</h1>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm shadow-sm transition-colors"
        >
          <span className="material-symbols-outlined text-lg">key</span>
          Şifre Değiştir
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kullanıcı Kartı */}
        <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-sm border border-border-color dark:border-dark-border">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary/10 rounded-full h-20 w-20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">person</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">
                {user.ad} {user.soyad}
              </h2>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {selectedBirim?.roleName || 'Kullanıcı'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Sicil Numarası</span>
              <p className="mt-1 text-lg font-medium text-text-primary dark:text-dark-text-primary">{user.sicil}</p>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Unvan</span>
              <p className="mt-1 text-lg font-medium text-text-primary dark:text-dark-text-primary">{user.unvan || '-'}</p>
            </div>
          </div>
        </div>

        {/* Birim & Yetki Kartı */}
        <div className="bg-card dark:bg-dark-card p-6 rounded-xl shadow-sm border border-border-color dark:border-dark-border">
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">Organizasyon Bilgileri</h3>
          
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Aktif Birim</span>
              <div className="mt-1 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">corporate_fare</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{selectedBirim?.birimAdi}</span>
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Aktif Rol</span>
              <div className="mt-1 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">badge</span>
                <span className="font-medium text-green-900 dark:text-green-100">{selectedBirim?.roleName}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border-color dark:border-dark-border mt-4">
               <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                 Hesap Oluşturulma Tarihi: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
               </p>
               <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                 Durum: <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>{user.isActive ? 'Aktif' : 'Pasif'}</span>
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-dark-card rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-color dark:border-dark-border">
              <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                Şifre Değiştir
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <span className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
                  Mevcut Şifre
                </span>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
                  Yeni Şifre
                </span>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="En az 8 karakter"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
                  Yeni Şifre Tekrar
                </span>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
