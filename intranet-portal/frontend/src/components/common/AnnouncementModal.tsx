import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { announcementApi, type Announcement } from '../../api/announcementApi';

export function AnnouncementModal() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementApi.getActiveForUser();
      if (response.data.success && response.data.data) {
        // Filter for Modal type and Not Read
        const modals = response.data.data.filter(a => 
          (a.displayType === 'Modal' || a.type === 'Critical') && !a.isRead
        );
        setAnnouncements(modals);
        if (modals.length > 0) setIsOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    }
  };

  const handleAcknowledge = async () => {
    if (announcements.length === 0) return;
    const current = announcements[0];

    try {
      await announcementApi.acknowledge(current.announcementID);
      
      // Remove current and show next
      const nextList = announcements.slice(1);
      setAnnouncements(nextList);
      
      if (nextList.length === 0) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Ack error', error);
    }
  };

  if (announcements.length === 0) return null;

  const current = announcements[0];
  const isCritical = current.type === 'Critical';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing critical announcements without acknowledgment
      if (!open && !isCritical) setIsOpen(false);
    }}>
      <DialogContent className={`sm:max-w-[500px] ${isCritical ? 'border-l-4 border-l-red-600' : ''}`}>
        <DialogHeader>
          <DialogTitle className={isCritical ? 'text-red-600' : ''}>
            {current.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {new Date(current.createdAt).toLocaleDateString('tr-TR')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
           {/* Safe HTML render */}
           <div 
             className="prose prose-sm max-w-none"
             dangerouslySetInnerHTML={{ __html: current.content }} 
           />
        </div>

        <DialogFooter>
          <Button onClick={handleAcknowledge} variant={isCritical ? "destructive" : "default"}>
            {isCritical ? 'Okudum, Anladım' : 'Tamam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
