import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';
import { 
  ChevronDown, 
  Building2, 
  LogOut, 
  User, 
  Check 
} from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * Header component with birim switcher dropdown
 * Reference: IMPLEMENTATION_ROADMAP.md - Faz 3
 */
const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, birimleri, selectedBirim, selectBirim, setSelectedBirimRole, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchBirim = async (birim: typeof birimleri[0]) => {
    if (birim.birimId === selectedBirim?.birimId) {
      setIsDropdownOpen(false);
      return;
    }

    const startTime = performance.now();
    setIsSwitching(true);
    
    try {
      const response = await authApi.selectBirim(birim.birimId);

      if (response.success && response.data) {
        selectBirim(birim);
        
        if (response.data.selectedBirim && response.data.selectedRole) {
          setSelectedBirimRole(
            response.data.selectedBirim,
            response.data.selectedRole
          );
        }

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        
        toast.success(`${birim.birimAdi} birimine geçildi (${duration}ms)`);
        setIsDropdownOpen(false);
        
        // Navigate to unit specific dashboard
        if (birim.birimAdi === 'Bilgi İşlem') {
          navigate('/it/dashboard');
        } else if (birim.birimAdi === 'test') {
          navigate('/test-unit/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(response.error?.message || 'Birim değiştirme başarısız');
      }
    } catch (error) {
      console.error('Birim değiştirme hatası:', error);
      toast.error('Birim değiştirme sırasında bir hata oluştu');
    } finally {
      setIsSwitching(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-slate-900 px-4 shadow-sm">
      {/* Left side - Sidebar trigger & Breadcrumb */}
      <div className="flex items-center gap-2">
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
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side - User info & birim switcher */}
      <div className="flex items-center gap-4">
        {/* Birim Switcher */}
        {birimleri.length > 1 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isSwitching}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 
                       text-primary dark:text-primary-light transition-colors duration-200"
            >
              <Building2 className="w-4 h-4" />
              <span className="font-medium text-sm max-w-[150px] truncate">
                {selectedBirim?.birimAdi || 'Birim Seç'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 
                            dark:border-slate-700 rounded-lg shadow-xl z-[100] py-2">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Birim Değiştir
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto bg-white dark:bg-slate-800">
                  {birimleri.map((birim) => (
                    <button
                      key={birim.birimId}
                      onClick={() => handleSwitchBirim(birim)}
                      disabled={isSwitching}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left
                                hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors
                                ${birim.birimId === selectedBirim?.birimId ? 'bg-blue-50 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {birim.birimAdi}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {birim.roleName}
                        </span>
                      </div>
                      {birim.birimId === selectedBirim?.birimId && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Single birim display */}
        {birimleri.length === 1 && selectedBirim && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Building2 className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary" />
            <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
              {selectedBirim.birimAdi}
            </span>
          </div>
        )}

        {/* User menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-border dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                {user.ad} {user.soyad}
              </p>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                {selectedBirim?.roleName}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-text-secondary 
                     hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Çıkış Yap"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
