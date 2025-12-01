import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

/**
 * Header component with birim switcher dropdown
 * Reference: IMPLEMENTATION_ROADMAP.md - Faz 3
 */
const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, birimleri, selectedBirim, selectBirim, setSelectedBirimRole, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

        toast.success(`${birim.birimAdi} birimine geçildi`);
        setIsDropdownOpen(false);
        
        // Refresh the page to reload data for new birim
        window.location.reload();
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
    <header className="h-16 border-b border-border dark:border-dark-border bg-surface dark:bg-dark-surface flex items-center justify-between px-6">
      {/* Left side - Page title can go here */}
      <div className="flex items-center gap-4">
        {/* Placeholder for breadcrumb or page title */}
      </div>

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
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface dark:bg-dark-surface border border-border 
                            dark:border-dark-border rounded-lg shadow-lg z-50 py-2">
                <div className="px-3 py-2 border-b border-border dark:border-dark-border">
                  <p className="text-xs text-text-secondary dark:text-dark-text-secondary font-medium uppercase">
                    Birim Değiştir
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {birimleri.map((birim) => (
                    <button
                      key={birim.birimId}
                      onClick={() => handleSwitchBirim(birim)}
                      disabled={isSwitching}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left
                                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                                ${birim.birimId === selectedBirim?.birimId ? 'bg-primary/10' : ''}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                          {birim.birimAdi}
                        </span>
                        <span className="text-xs text-text-secondary dark:text-dark-text-secondary">
                          {birim.roleName}
                        </span>
                      </div>
                      {birim.birimId === selectedBirim?.birimId && (
                        <Check className="w-4 h-4 text-primary" />
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
