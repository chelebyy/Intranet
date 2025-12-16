import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { maintenanceApi } from '../../api/maintenanceApi';

export const ScheduledMaintenanceBanner: React.FC = () => {
    const [scheduledData, setScheduledData] = useState<{time: string, message: string} | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const checkSchedule = async () => {
            try {
                const response = await maintenanceApi.getStatus();
                const status = response.data.data;
                if (status?.scheduledMaintenanceTime) {
                    const scheduledTime = new Date(status.scheduledMaintenanceTime);
                    const now = new Date();
                    
                    if (scheduledTime > now) {
                        setScheduledData({
                            time: status.scheduledMaintenanceTime,
                            message: status.scheduledMaintenanceMessage || 'Planlı bakım çalışması yapılacaktır.'
                        });
                    } else {
                        setScheduledData(null);
                    }
                } else {
                    setScheduledData(null);
                }
            } catch (error) {
                console.error('Failed to check maintenance schedule:', error);
            }
        };

        checkSchedule();
        const interval = setInterval(checkSchedule, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!scheduledData) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const target = new Date(scheduledData.time).getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft('Bakım başlıyor...');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            let timeString = '';
            if (days > 0) timeString += `${days} gün `;
            if (hours > 0) timeString += `${hours} saat `;
            timeString += `${minutes} dakika`;
            
            setTimeLeft(timeString);
        };

        updateTimer();
        const timer = setInterval(updateTimer, 60000); // Update text every minute
        return () => clearInterval(timer);
    }, [scheduledData]);

    if (!scheduledData) return null;

    return (
        <div className="bg-blue-600 text-white px-4 py-2 text-center font-medium shadow-md flex flex-wrap items-center justify-center gap-2 z-40 relative">
            <Clock className="w-5 h-5 animate-pulse" />
            <span>{scheduledData.message}</span>
            <span className="bg-blue-700 px-2 py-0.5 rounded text-sm font-bold border border-blue-400">
                {timeLeft} kaldı
            </span>
        </div>
    );
};
