import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../features/admin/components/Sidebar';
import Header from '../components/Header';
import { Page } from '../../types';

const AdminLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update current page based on URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/users')) setCurrentPage(Page.USER_LIST);
    else if (path.includes('/departments')) setCurrentPage(Page.DEPARTMENT_LIST);
    else if (path.includes('/roles')) setCurrentPage(Page.ROLES_PERMISSIONS);
    else if (path.includes('/reports')) setCurrentPage(Page.REPORTS);
    else setCurrentPage(Page.DASHBOARD);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary overflow-hidden transition-colors duration-200">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDarkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
