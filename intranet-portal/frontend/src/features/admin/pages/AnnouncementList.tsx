import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Plus, Edit, Trash2, AlertCircle, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { announcementApi, type Announcement } from '../../../api/announcementApi';
import usePermission, { Permissions } from '../../../hooks/usePermission';
import toast from 'react-hot-toast';

export default function AnnouncementList() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canCreate = hasPermission(Permissions.ManageMaintenance.resource, Permissions.ManageMaintenance.action) || 
                    hasPermission('announcement', 'create');
  const canEdit = hasPermission('announcement', 'update');
  const canDelete = hasPermission('announcement', 'delete');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await announcementApi.getAll();
      if (response.data.success && response.data.data) {
        setAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
      toast.error('Duyurular yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;

    try {
      await announcementApi.delete(id);
      toast.success('Duyuru başarıyla silindi');
      fetchAnnouncements();
    } catch (error) {
      console.error('Delete error', error);
      toast.error('Silme işlemi başarısız oldu');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'Critical': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (isActive: boolean, endDate: string) => {
    const isExpired = new Date(endDate) < new Date();
    
    if (!isActive) return <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">Pasif</span>;
    if (isExpired) return <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">Süresi Dolmuş</span>;
    return <span className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">Yayında</span>;
  };

  if (isLoading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Duyuru Yönetimi</h1>
        {canCreate && (
          <button
            onClick={() => navigate('/admin/announcements/new')}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Duyuru
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih Aralığı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Öncelik</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Henüz duyuru bulunmamaktadır.
                </td>
              </tr>
            ) : (
              announcements.map((item) => (
                <tr key={item.announcementID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.isActive, item.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <span className="text-sm text-gray-700">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{item.displayType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{format(new Date(item.startDate), 'dd MMM yyyy', { locale: tr })}</div>
                    <div className="text-xs">bitiş: {format(new Date(item.endDate), 'dd MMM yyyy', { locale: tr })}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {canEdit && (
                      <button
                        onClick={() => navigate(`/admin/announcements/edit/${item.announcementID}`)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(item.announcementID)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
