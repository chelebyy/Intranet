import { useEffect, useState } from 'react';
import { X, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { announcementApi, type Announcement } from '../../api/announcementApi';

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementApi.getActiveForUser();
      if (response.data.success && response.data.data) {
        // Filter for Banner type and Not Read
        const banners = response.data.data.filter(a => 
          a.displayType === 'Banner' && !a.isRead
        );
        setAnnouncements(banners);
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    }
  };

  const handleDismiss = async () => {
    if (announcements.length === 0) return;
    
    const current = announcements[currentIndex];
    
    // Optimistic update
    setIsVisible(false);
    
    try {
      await announcementApi.acknowledge(current.announcementID);
       
      // Remove from list after short delay for animation
      setTimeout(() => {
        const nextList = announcements.filter(a => a.announcementID !== current.announcementID);
        setAnnouncements(nextList);
        setCurrentIndex(0);
        if (nextList.length > 0) setIsVisible(true);
      }, 300);

    } catch (error) {
      console.error('Dismiss error', error);
      setIsVisible(true); // Revert on error
    }
  };

  if (announcements.length === 0) return null;

  const current = announcements[currentIndex];

  const getStyle = (type: string) => {
    switch (type) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'Warning': return 'bg-yellow-500 text-white';
      case 'Info': default: return 'bg-blue-600 text-white';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Critical': return <ShieldAlert className="w-5 h-5 mr-2" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 mr-2" />;
      case 'Info': default: return <Info className="w-5 h-5 mr-2" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${getStyle(current.type)} px-4 py-3 relative shadow-md transition-all duration-300`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center flex-1 mr-8">
          {getIcon(current.type)}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="font-bold">{current.title}</span>
            <span className="text-sm opacity-90 hidden sm:inline">|</span>
            <div 
              className="text-sm prose prose-invert prose-sm max-w-none [&>p]:m-0 [&>p]:inline"
              dangerouslySetInnerHTML={{ __html: current.content }} 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {announcements.length > 1 && (
            <span className="text-xs opacity-75 hidden sm:inline">
              {currentIndex + 1} / {announcements.length}
            </span>
          )}
          
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            title="Okundu olarak işaretle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
