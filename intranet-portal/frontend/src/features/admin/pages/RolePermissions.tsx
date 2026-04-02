import React, { useEffect, useState } from 'react';
import { rolesApi, permissionsApi } from '../../../api/rolesApi';
import type { Role, Permission } from '../../../types/api/roles';
import { toast } from 'react-hot-toast';
import { Shield, Check, Save, Loader2, Search, Filter } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { usePermission, Permissions } from '@/hooks/usePermission';

// Permission Item Component
interface PermissionItemProps {
  permission: Permission;
  isSelected: boolean;
  onToggle: (id: number) => void;
  disabled: boolean;
}

function PermissionItem({ permission, isSelected, onToggle, disabled }: Readonly<PermissionItemProps>) {
  const handleClick = () => onToggle(permission.permissionID);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(permission.permissionID);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none
        ${isSelected
          ? 'bg-primary/5 border-primary/40 shadow-sm'
          : 'bg-background hover:bg-muted/60 hover:border-muted-foreground/30'
        }
      `}
    >
      <Checkbox
        id={`perm-${permission.permissionID}`}
        checked={isSelected}
        onCheckedChange={() => onToggle(permission.permissionID)}
        disabled={disabled}
        className="mt-1"
      />
      <div className="grid gap-1 leading-tight flex-1">
        <label
          htmlFor={`perm-${permission.permissionID}`}
          className="text-sm font-medium leading-none cursor-pointer"
        >
          {permission.action}
        </label>
        {permission.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {permission.description}
          </p>
        )}
        <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded w-fit font-mono mt-1">
          {permission.fullPermission}
        </code>
      </div>
    </div>
  );
}

// Permissions Content Component
interface PermissionsContentProps {
  permissionsLoading: boolean;
  groupedPermissions: Record<string, Permission[]>;
  rolePermissionIds: number[];
  togglePermission: (id: number) => void;
  handleSelectAll: (resource: string, checked: boolean) => void;
  canManagePermissions: boolean;
}

function PermissionsContent({
  permissionsLoading,
  groupedPermissions,
  rolePermissionIds,
  togglePermission,
  handleSelectAll,
  canManagePermissions
}: Readonly<PermissionsContentProps>) {
  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (Object.keys(groupedPermissions).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Filter className="h-8 w-8 mb-2 opacity-50" />
        <p>Görüntülenecek izin bulunamadı.</p>
      </div>
    );
  }

  return (
    <>
      {Object.entries(groupedPermissions).map(([resource, permissions]) => {
        const allSelected = permissions.every(p => rolePermissionIds.includes(p.permissionID));
        const someSelected = permissions.some(p => rolePermissionIds.includes(p.permissionID));

        return (
          <Card key={resource} className="overflow-hidden border shadow-sm bg-card transition-all hover:shadow-md">
            <div className="bg-muted/30 px-4 py-3 border-b flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize bg-background px-3 py-1 text-sm font-semibold">
                  {resource}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <Checkbox
                  id={`select-all-${resource}`}
                  checked={allSelected || (someSelected && "indeterminate")}
                  onCheckedChange={(checked) => handleSelectAll(resource, checked as boolean)}
                  disabled={!canManagePermissions}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor={`select-all-${resource}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                >
                  Grubu Seç
                </label>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {permissions.map(permission => (
                <PermissionItem
                  key={permission.permissionID}
                  permission={permission}
                  isSelected={rolePermissionIds.includes(permission.permissionID)}
                  onToggle={togglePermission}
                  disabled={!canManagePermissions}
                />
              ))}
            </div>
          </Card>
        );
      })}
    </>
  );
}

export const RolePermissions: React.FC = () => {
  const { hasPermission } = usePermission();
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissionIds, setRolePermissionIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Search states
  const [roleSearch, setRoleSearch] = useState('');
  const [permissionSearch, setPermissionSearch] = useState('');

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
    if (!canManagePermissions) {
      toast.error('Rol izinlerini değiştirme yetkiniz bulunmamaktadır.');
      return;
    }

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
    if (!canManagePermissions) return;

    setRolePermissionIds(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSelectAll = (resource: string, checked: boolean) => {
    if (!canManagePermissions) return;

    const permissionsInResource = groupedPermissions[resource].map(p => p.permissionID);

    setRolePermissionIds(prev => {
      if (checked) {
        const toAdd = permissionsInResource.filter(id => !prev.includes(id));
        return [...prev, ...toAdd];
      } else {
        return prev.filter(id => !permissionsInResource.includes(id));
      }
    });
  };

  // Filter roles based on search
  const filteredRoles = roles.filter(role =>
    role.roleName.toLowerCase().includes(roleSearch.toLowerCase())
  );

  // Filter permissions based on search
  const filteredPermissions = allPermissions.filter(p =>
    permissionSearch === '' ||
    p.action.toLowerCase().includes(permissionSearch.toLowerCase()) ||
    p.description?.toLowerCase().includes(permissionSearch.toLowerCase()) ||
    p.resource.toLowerCase().includes(permissionSearch.toLowerCase())
  );

  // Group filtered permissions by resource
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const canManagePermissions = hasPermission(
    Permissions.Permission.Manage.resource,
    Permissions.Permission.Manage.action
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rol ve İzin Yönetimi</h2>
          <p className="text-muted-foreground">
            Sistemdeki rolleri ve yetkilerini yönetin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Left Column: Roles List */}
        <Card className="lg:col-span-1 flex flex-col overflow-hidden shadow-md border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-lg flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              Roller
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rol ara..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                className="pl-8 h-9 bg-background/50"
              />
            </div>
          </CardHeader>
          <Separator className="opacity-50" />
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {filteredRoles.map(role => (
                <button
                  key={role.roleID}
                  onClick={() => setSelectedRoleId(role.roleID)}
                  className={`w-full text-left p-3 rounded-lg transition-all flex flex-col gap-1 border group relative overflow-hidden
                    ${selectedRoleId === role.roleID
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'hover:bg-muted/80 border-transparent text-card-foreground'
                    }
                  `}
                >
                  <div className="flex items-center justify-between z-10 relative">
                    <span className="font-medium text-sm">{role.roleName}</span>
                    {selectedRoleId === role.roleID && <Check className="h-3 w-3" />}
                  </div>
                  {role.description && (
                    <span className={`text-xs line-clamp-1 z-10 relative ${selectedRoleId === role.roleID ? 'text-primary-foreground/80' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {role.description}
                    </span>
                  )}
                </button>
              ))}
              {filteredRoles.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Rol bulunamadı.
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Column: Permissions Matrix */}
        <Card className="lg:col-span-3 flex flex-col overflow-hidden border-0 shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/30 py-3 px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg truncate">
                    {roles.find(r => r.roleID === selectedRoleId)?.roleName} <span className="text-muted-foreground font-normal">İzinleri</span>
                  </CardTitle>
                  <Badge variant="secondary" className="hidden sm:inline-flex">{rolePermissionIds.length} seçili</Badge>
                </div>
                <CardDescription className="truncate">
                  {canManagePermissions
                    ? 'Yetkileri düzenlemek için kutucukları işaretleyin.'
                    : 'Bu ekranda izinleri görüntüleyebilirsiniz ancak değiştiremezsiniz.'}
                </CardDescription>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="İzinlerde ara..."
                    value={permissionSearch}
                    onChange={(e) => setPermissionSearch(e.target.value)}
                    className="pl-8 h-9 bg-background"
                  />
                </div>
                <Button onClick={handleSave} disabled={!canManagePermissions || saving || permissionsLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Kaydet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 bg-muted/5">
            <div className="p-6 space-y-6">
              <PermissionsContent
                permissionsLoading={permissionsLoading}
                groupedPermissions={groupedPermissions}
                rolePermissionIds={rolePermissionIds}
                togglePermission={togglePermission}
                handleSelectAll={handleSelectAll}
                canManagePermissions={canManagePermissions}
              />
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};
