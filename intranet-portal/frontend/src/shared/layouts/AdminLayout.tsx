import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { MaintenanceBanner } from '../../components/common/MaintenanceBanner';
import { ScheduledMaintenanceBanner } from '../../components/common/ScheduledMaintenanceBanner';
import Header from '../components/Header';
import { useAuthStore } from '@/store/authStore';
import { maintenanceApi } from '@/api/maintenanceApi';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, birimleri } = useAuthStore();

    // Check Maintenance Status
    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                // Determine if user is Admin/SuperAdmin
                // Checking directly against loaded roles in store
                const isSuperAdmin = birimleri?.some(r => r.roleName === 'SuperAdmin');
                // const isAdmin = birimleri?.some(r => r.roleName === 'Admin' || r.roleName === 'SuperAdmin');

                // If user is SuperAdmin, they bypass maintenance lock.
                if (isSuperAdmin) return;

                const response = await maintenanceApi.getStatus();
                
                if (response.data.data?.isManualMaintenanceEnabled) {
                     navigate('/maintenance');
                }
            } catch (error) {
                console.error("Maintenance check failed", error);
            }
        };

        checkMaintenance();
        const interval = setInterval(checkMaintenance, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [location.pathname, navigate, user, birimleri]);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <MaintenanceBanner />
        <ScheduledMaintenanceBanner />
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
