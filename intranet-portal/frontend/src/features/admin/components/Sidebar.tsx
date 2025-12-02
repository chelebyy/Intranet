import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { usePermission, Permissions } from '../../../hooks/usePermission';
import { Page } from '../../../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface MenuItem {
  page: Page;
  path: string;
  icon: string;
  label: string;
  permission?: { resource: string; action: string };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const { user, selectedBirim, currentRoleInfo, logout } = useAuthStore();
  const { hasPermission } = usePermission();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // SuperAdmin check
  const isSuperAdmin = currentRoleInfo?.roleName === 'SuperAdmin';

  // Menu items with permission requirements
  const menuItems: MenuItem[] = useMemo(() => [
    { 
      page: Page.DASHBOARD, 
      path: '/dashboard', 
      icon: 'dashboard', 
      label: 'Dashboard' 
      // Dashboard is accessible to all authenticated users
    },
    { 
      page: Page.USER_LIST, 
      path: '/users', 
      icon: 'group', 
      label: 'Kullanıcı Yönetimi',
      permission: Permissions.User.Read
    },
    { 
      page: Page.DEPARTMENT_LIST, 
      path: '/departments', 
      icon: 'corporate_fare', 
      label: 'Birimler',
      permission: Permissions.Birim.Read
    },
    { 
      page: Page.ROLES_PERMISSIONS, 
      path: '/roles', 
      icon: 'security', 
      label: 'Role & Permission',
      permission: Permissions.Role.Read
    },
    { 
      page: Page.AUDIT_LOG, 
      path: '/audit-log', 
      icon: 'history', 
      label: 'Audit Log',
      permission: Permissions.AuditLog.Read
    },
    { 
      page: Page.IP_RESTRICTIONS, 
      path: '/ip-restrictions', 
      icon: 'shield', 
      label: 'IP Kısıtlamaları',
      permission: Permissions.System.Read
    },
  ], []);

  // Filter menu items based on permissions
  const visibleMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      // No permission required - show to everyone
      if (!item.permission) return true;
      // SuperAdmin sees everything
      if (isSuperAdmin) return true;
      // Check permission
      return hasPermission(item.permission.resource, item.permission.action);
    });
  }, [menuItems, isSuperAdmin, hasPermission]);

  const navItemClass = (page: Page) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
      currentPage === page ||
      (page === Page.DEPARTMENT_LIST && currentPage === Page.DEPARTMENT_CREATE) ||
      (page === Page.USER_LIST && currentPage === Page.USER_CREATE)
        ? 'bg-primary-light dark:bg-primary/20 text-primary'
        : 'text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-primary dark:hover:text-dark-text-primary'
    }`;

  const iconClass = (page: Page) =>
     `material-symbols-outlined text-2xl ${
      currentPage === page ||
      (page === Page.DEPARTMENT_LIST && currentPage === Page.DEPARTMENT_CREATE) ||
      (page === Page.USER_LIST && currentPage === Page.USER_CREATE)
        ? 'fill'
        : ''
    }`;

  return (
    <aside className="flex flex-col w-64 bg-sidebar dark:bg-dark-sidebar border-r border-border-color dark:border-dark-border shrink-0 h-full transition-colors duration-200">
      <div className="flex flex-col gap-4 p-4 h-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://picsum.photos/200")'}}></div>
          <div className="flex flex-col">
            <h1 className="text-text-primary dark:text-dark-text-primary text-base font-bold leading-normal">Intranet Portal</h1>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm font-normal leading-normal">
              {selectedBirim?.birimAdi || 'Admin Panel'}
            </p>
          </div>
        </div>

        {user && (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 mb-2">
            <p className="text-text-primary dark:text-dark-text-primary text-sm font-semibold">
              {user.ad} {user.soyad}
            </p>
            <p className="text-text-secondary dark:text-dark-text-secondary text-xs">
              {selectedBirim?.roleName || 'Sistem Yöneticisi'}
            </p>
          </div>
        )}

        <nav className="flex flex-col gap-1 mt-4">
          {visibleMenuItems.map((item) => (
            <button 
              key={item.page}
              type="button"
              onClick={() => { onNavigate(item.page); navigate(item.path); }} 
              className={navItemClass(item.page)}
            >
              <span className={iconClass(item.page)}>{item.icon}</span>
              <span className="text-sm font-medium leading-normal">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <button 
            type="button"
            onClick={toggleTheme} 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            <span className="text-sm font-medium leading-normal">{isDarkMode ? 'Açık Tema' : 'Koyu Tema'}</span>
          </button>
          <button 
            type="button"
            onClick={() => { onNavigate(Page.PROFILE); navigate('/profile'); }} 
            className={navItemClass(Page.PROFILE)}
          >
            <span className={iconClass(Page.PROFILE)}>account_circle</span>
            <span className="text-sm font-medium leading-normal">Profil</span>
          </button>
          <button 
            type="button"
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
            <span className="text-sm font-medium leading-normal">Çıkış Yap</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
