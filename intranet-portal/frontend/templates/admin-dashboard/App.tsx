import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { UserList } from './pages/UserList';
import { UserCreate } from './pages/UserCreate';
import { DepartmentList } from './pages/DepartmentList';
import { DepartmentCreate } from './pages/DepartmentCreate';
import { RolePermissions } from './pages/RolePermissions';
import { Reports } from './pages/Reports';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard />;
      case Page.USER_LIST:
        return <UserList onNavigate={setCurrentPage} />;
      case Page.USER_CREATE:
        return <UserCreate onNavigate={setCurrentPage} />;
      case Page.DEPARTMENT_LIST:
        return <DepartmentList onNavigate={setCurrentPage} />;
      case Page.DEPARTMENT_CREATE:
        return <DepartmentCreate onNavigate={setCurrentPage} />;
      case Page.ROLES_PERMISSIONS:
        return <RolePermissions />;
      case Page.REPORTS:
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary overflow-hidden transition-colors duration-200">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isDarkMode={darkMode} 
        toggleTheme={() => setDarkMode(!darkMode)} 
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;