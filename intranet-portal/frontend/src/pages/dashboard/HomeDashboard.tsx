import { useAuthStore } from '../../store/authStore';

export default function HomeDashboard() {
  const { user, currentBirimInfo } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş Geldiniz, {user?.ad} {user?.soyad}
        </h1>
        <p className="mt-2 text-gray-600">
          {currentBirimInfo?.birimAdi ? `${currentBirimInfo.birimAdi} birimindesiniz.` : 'Kurumsal İntranet Portalı'}
        </p>
      </div>

      {/* Announcements Placeholder (Phase 4) */}
      <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Duyurular & Panolar</h2>
        <p className="text-gray-500 italic">
          Yakında burada kurum içi duyurular ve önemli bildirimler yer alacaktır.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded text-sm text-blue-700">
          💡 Burası "Duyuru ve Uyarı Sistemi" geliştirmesi tamamlandığında güncellenecektir.
        </div>
      </div>

      {/* Quick Links Example */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-semibold text-gray-900">Profilim</h3>
          <p className="text-sm text-gray-500 mt-1">Kişisel bilgilerinizi güncelleyin.</p>
        </div>
        {/* Add more widgets here */}
      </div>
    </div>
  );
}
