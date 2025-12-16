import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Megaphone, ChevronRight } from 'lucide-react';
import { announcementApi, type Announcement } from '../../api/announcementApi';

export default function RecentAnnouncementsWidget() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementApi.getActiveForUser();
      if (response.data.success && response.data.data) {
        // Filter for Widget type or Info type, take top 5
        const widgets = response.data.data
          .filter(a => a.displayType === 'Widget' || a.displayType === 'Modal') // Show modals here too for reference
          .slice(0, 5);
        setAnnouncements(widgets);
      }
    } catch (error) {
      console.error('Widget fetch error', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />;
  if (announcements.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Megaphone className="w-5 h-5 mr-2 text-indigo-600" />
          Duyurular
        </h3>
      </div>
      
      <div className="space-y-4">
        {announcements.map((item) => (
          <div key={item.announcementID} className="group flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                <span dangerouslySetInnerHTML={{ __html: item.content.replace(/<[^>]+>/g, '') }} />
              </p>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {format(new Date(item.createdAt), 'd MMM', { locale: tr })}
            </div>
          </div>
        ))}
      </div>
      
      {announcements.length >= 5 && (
        <button className="w-full mt-4 text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center py-2">
          Tümünü Gör <ChevronRight className="w-3 h-3 ml-1" />
        </button>
      )}
    </div>
  );
}
