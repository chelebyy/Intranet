import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Get current page name for breadcrumb
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/users')) return 'Kullanıcı Yönetimi';
    if (path.includes('/definitions/unvanlar')) return 'Ünvanlar';
    if (path.includes('/definitions/departments')) return 'Birimler';
    if (path.includes('/roles')) return 'Roller ve İzinler';
    if (path.includes('/audit-log')) return 'Denetim Kayıtları';
    if (path.includes('/ip-restrictions')) return 'IP Kısıtlamaları';
    if (path.includes('/profile')) return 'Profil';
    if (path.includes('/test')) return 'Test Sayfası';
    return 'Dashboard';
  };

  return (
    <SidebarProvider>
      <AppSidebar isDarkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-slate-900 px-4 shadow-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Yönetim Paneli</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
