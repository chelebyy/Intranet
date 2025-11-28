import React, { useEffect, useState } from 'react';
import { rolesApi, permissionsApi } from '../../../api/rolesApi';
import type { Role, Permission } from '../../../types/api/roles';
import { toast } from 'react-hot-toast';

export const RolePermissions: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissionIds, setRolePermissionIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolesData, permissionsData] = await Promise.all([
          rolesApi.getAll(),
          permissionsApi.getAll()
        ]);
        setRoles(rolesData);
        setAllPermissions(permissionsData);
        
        // Select first role by default if available
        if (rolesData.length > 0) {
          setSelectedRoleId(rolesData[0].roleID);
        }
      } catch (error) {
        console.error('Failed to load data', error);
        toast.error('Veriler yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load role permissions when selection changes
  useEffect(() => {
    if (!selectedRoleId) return;

    const loadRolePermissions = async () => {
      setPermissionsLoading(true);
      try {
        const permissions = await rolesApi.getPermissions(selectedRoleId);
        setRolePermissionIds(permissions.map(p => p.permissionID));
      } catch (error) {
        console.error('Failed to load role permissions', error);
        toast.error('Rol izinleri yüklenemedi.');
      } finally {
        setPermissionsLoading(false);
      }
    };

    loadRolePermissions();
  }, [selectedRoleId]);

  const handleSave = async () => {
    if (!selectedRoleId) return;

    setSaving(true);
    try {
      await rolesApi.updatePermissions(selectedRoleId, {
        permissionIds: rolePermissionIds
      });
      toast.success('İzinler başarıyla güncellendi.');
    } catch (error) {
      console.error('Failed to save permissions', error);
      toast.error('İzinler kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permissionId: number) => {
    setRolePermissionIds(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSelectAll = (resource: string, checked: boolean) => {
    const permissionsInResource = groupedPermissions[resource].map(p => p.permissionID);
    
    setRolePermissionIds(prev => {
      if (checked) {
        // Add all permissions for this resource that aren't already selected
        const toAdd = permissionsInResource.filter(id => !prev.includes(id));
        return [...prev, ...toAdd];
      } else {
        // Remove all permissions for this resource
        return prev.filter(id => !permissionsInResource.includes(id));
      }
    });
  };

  // Group permissions by resource
  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="p-6 md:p-8 flex flex-col h-full w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-6">Rol ve İzin Yönetimi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Left Column: Roles List */}
        <div className="lg:col-span-1 bg-white dark:bg-dark-surface rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h2 className="font-semibold text-text-primary dark:text-dark-text-primary">Roller</h2>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {roles.map(role => (
              <button
                key={role.roleID}
                onClick={() => setSelectedRoleId(role.roleID)}
                className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                  ${selectedRoleId === role.roleID ? 'bg-brand-primary/10 border-l-4 border-l-brand-primary' : 'border-l-4 border-l-transparent'}
                `}
              >
                <div className="font-medium text-text-primary dark:text-dark-text-primary">{role.roleName}</div>
                {role.description && (
                  <div className="text-xs text-text-secondary dark:text-dark-text-secondary truncate mt-1">{role.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Permissions Matrix */}
        <div className="lg:col-span-3 bg-white dark:bg-dark-surface rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h2 className="font-semibold text-text-primary dark:text-dark-text-primary">
                {roles.find(r => r.roleID === selectedRoleId)?.roleName} İzinleri
              </h2>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                Bu rol için yetkileri aşağıdan düzenleyebilirsiniz.
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || permissionsLoading}
              className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[600px]">
            {permissionsLoading ? (
              <div className="text-center py-8 text-text-secondary">İzinler yükleniyor...</div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedPermissions).map(([resource, permissions]) => {
                  const allSelected = permissions.every(p => rolePermissionIds.includes(p.permissionID));
                  const someSelected = permissions.some(p => rolePermissionIds.includes(p.permissionID));
                  
                  return (
                    <div key={resource} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-text-primary dark:text-dark-text-primary capitalize">
                          {resource} Yönetimi
                        </h3>
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={input => {
                              if (input) {
                                input.indeterminate = someSelected && !allSelected;
                              }
                            }}
                            onChange={(e) => handleSelectAll(resource, e.target.checked)}
                            className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                          />
                          <span className="text-text-secondary dark:text-dark-text-secondary">Tümünü Seç</span>
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {permissions.map(permission => (
                          <label
                            key={permission.permissionID}
                            className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-all select-none
                              ${rolePermissionIds.includes(permission.permissionID) 
                                ? 'bg-brand-primary/5 border-brand-primary/30' 
                                : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                              }
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={rolePermissionIds.includes(permission.permissionID)}
                              onChange={() => togglePermission(permission.permissionID)}
                              className="mt-1 w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                            />
                            <div>
                              <div className="font-medium text-sm text-text-primary dark:text-dark-text-primary">
                                {permission.action}
                              </div>
                              {permission.description && (
                                <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-0.5">
                                  {permission.description}
                                </div>
                              )}
                              <div className="text-[10px] text-gray-400 mt-1 font-mono">
                                {permission.fullPermission}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};