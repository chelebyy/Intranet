import React from 'react';
import { useAuthStore } from '../../../store/authStore';

export const Profile: React.FC = () => {
  const { user, selectedBirim } = useAuthStore();

  if (!user) {
    return <div>Kullanıcı bilgileri bulunamadı.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profil Bilgileri</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kullanıcı Kartı */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-center bg-no-repeat bg-cover rounded-full h-20 w-20 bg-gray-200" style={{backgroundImage: 'url("https://picsum.photos/200")'}}></div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.ad} {user.soyad}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedBirim?.roleName || 'Kullanıcı'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Sicil Numarası</label>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{user.sicil}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">T.C. Kimlik No</label>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{user.tcKimlikNo || '-'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Telefon</label>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{user.telefon || '-'}</p>
            </div>
          </div>
        </div>

        {/* Birim & Yetki Kartı */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organizasyon Bilgileri</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Aktif Birim</label>
              <div className="mt-1 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">corporate_fare</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{selectedBirim?.birimAdi}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Aktif Rol</label>
              <div className="mt-1 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">badge</span>
                <span className="font-medium text-green-900 dark:text-green-100">{selectedBirim?.roleName}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
               <p className="text-xs text-gray-500">
                 Hesap Oluşturulma Tarihi: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
               </p>
               <p className="text-xs text-gray-500 mt-1">
                 Durum: <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>{user.isActive ? 'Aktif' : 'Pasif'}</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
