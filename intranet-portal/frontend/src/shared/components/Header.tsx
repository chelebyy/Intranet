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
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
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

// User Menu Component
interface UserMenuProps {
  user: any;
  selectedBirim: any;
  handleLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, selectedBirim, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative pl-4 border-l border-border dark:border-dark-border" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
          {user?.ad?.[0]}{user?.soyad?.[0]}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.ad} {user.soyad}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedBirim?.roleName}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl z-[100] overflow-hidden
                      bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.ad} {user.soyad}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedBirim?.roleName}
            </p>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => { navigate('/profile'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                       text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">Profil</span>
            </button>

          </div>

          {/* Logout */}
          <div className="p-2 border-t border-gray-100 dark:border-slate-700">
            <button
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                       text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl shadow-2xl z-[100] overflow-hidden
                            bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 
                            border border-gray-200 dark:border-slate-700/50 backdrop-blur-xl">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                      Birim Değiştir
                    </p>
                  </div>
                </div>
                
                {/* Birim List */}
                <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                  {birimleri.map((birim) => (
                    <button
                      key={birim.birimId}
                      onClick={() => handleSwitchBirim(birim)}
                      disabled={isSwitching}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left
                                transition-all duration-200 group
                                ${birim.birimId === selectedBirim?.birimId 
                                  ? 'bg-purple-50 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-cyan-500/20 border border-purple-200 dark:border-purple-500/30' 
                                  : 'hover:bg-gray-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-gray-200 dark:hover:border-slate-700/50'}`}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                    ${birim.birimId === selectedBirim?.birimId 
                                      ? 'bg-gradient-to-br from-purple-500 to-cyan-500' 
                                      : 'bg-gray-100 dark:bg-slate-800 group-hover:bg-gray-200 dark:group-hover:bg-slate-700'}`}>
                        <Building2 className={`w-5 h-5 ${birim.birimId === selectedBirim?.birimId ? 'text-white' : 'text-gray-600 dark:text-white'}`} />
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <span className={`block text-sm font-semibold truncate
                                       ${birim.birimId === selectedBirim?.birimId 
                                         ? 'text-purple-700 dark:text-white' 
                                         : 'text-gray-700 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                          {birim.birimAdi}
                        </span>
                        <span className="block text-xs text-gray-400 dark:text-slate-500 truncate">
                          {birim.roleName}
                        </span>
                      </div>
                      
                      {/* Check */}
                      {birim.birimId === selectedBirim?.birimId && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
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

        {/* Theme Toggler */}
        <AnimatedThemeToggler className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors" />

        {/* User menu */}
        <UserMenu user={user} selectedBirim={selectedBirim} handleLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
