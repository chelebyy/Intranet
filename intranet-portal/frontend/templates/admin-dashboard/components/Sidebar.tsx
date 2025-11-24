import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isDarkMode, toggleTheme }) => {
  const navItemClass = (page: Page) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
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
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm font-normal leading-normal">Admin Panel</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 mt-4">
          <div onClick={() => onNavigate(Page.DASHBOARD)} className={navItemClass(Page.DASHBOARD)}>
            <span className={iconClass(Page.DASHBOARD)}>dashboard</span>
            <p className="text-sm font-medium leading-normal">Dashboard</p>
          </div>
          
          <div onClick={() => onNavigate(Page.USER_LIST)} className={navItemClass(Page.USER_LIST)}>
            <span className={iconClass(Page.USER_LIST)}>group</span>
            <p className="text-sm font-medium leading-normal">Kullanıcı Yönetimi</p>
          </div>
          
          <div onClick={() => onNavigate(Page.DEPARTMENT_LIST)} className={navItemClass(Page.DEPARTMENT_LIST)}>
            <span className={iconClass(Page.DEPARTMENT_LIST)}>corporate_fare</span>
            <p className="text-sm font-medium leading-normal">Birimler</p>
          </div>

          <div onClick={() => onNavigate(Page.REPORTS)} className={navItemClass(Page.REPORTS)}>
            <span className={iconClass(Page.REPORTS)}>bar_chart</span>
            <p className="text-sm font-medium leading-normal">Raporlar</p>
          </div>

          <div onClick={() => onNavigate(Page.ROLES_PERMISSIONS)} className={navItemClass(Page.ROLES_PERMISSIONS)}>
            <span className={iconClass(Page.ROLES_PERMISSIONS)}>security</span>
            <p className="text-sm font-medium leading-normal">Role & Permission</p>
          </div>
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <div onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            <p className="text-sm font-medium leading-normal">{isDarkMode ? 'Açık Tema' : 'Koyu Tema'}</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">account_circle</span>
            <p className="text-sm font-medium leading-normal">Profil</p>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">logout</span>
            <p className="text-sm font-medium leading-normal">Çıkış Yap</p>
          </div>
        </div>
      </div>
    </aside>
  );
};