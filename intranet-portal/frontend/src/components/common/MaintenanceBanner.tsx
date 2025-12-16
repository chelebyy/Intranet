import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';

export const MaintenanceBanner: React.FC = () => {
    const [isMaintenance, setIsMaintenance] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await apiClient.get<boolean>('/admin/maintenance/status');
                // API response wrapper handling might be needed depending on apiClient
                // Assuming apiClient returns data directly or we need to access .data
                // Based on previous files, apiClient usually returns the axios response.
                // Let's assume standard ApiResponse wrapper: { success, data }
                if (response.data && (response.data as any).data === true) {
                    setIsMaintenance(true);
                } else {
                    setIsMaintenance(false);
                }
            } catch (error) {
                // If API fails, we don't show maintenance mode to avoid false positives
                console.error('Maintenance check failed', error);
            }
        };

        // Check immediately and every 30 seconds
        checkStatus();
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!isMaintenance) return null;

    return (
        <div className="bg-amber-500 text-white px-4 py-2 text-center font-medium shadow-md flex items-center justify-center gap-2 z-50 relative animate-pulse">
            <span className="material-symbols-outlined">warning</span>
            <span>DİKKAT: Sistem şu anda bakım modundadır. Veri girişleriniz kaydedilmeyebilir.</span>
        </div>
    );
};
