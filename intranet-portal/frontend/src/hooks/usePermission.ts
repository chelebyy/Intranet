import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/apiClient';

interface PermissionInfo {
  permissionId: number;
  resource: string;
  action: string;
  permissionName: string;
}

interface UsePermissionResult {
  permissions: PermissionInfo[];
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (checks: Array<{ resource: string; action: string }>) => boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to check user permissions in the current birim
 * Reference: IMPLEMENTATION_ROADMAP.md - Faz 3
 */
export const usePermission = (): UsePermissionResult => {
  const { currentRoleInfo, isAuthenticated } = useAuthStore();
  const [permissions, setPermissions] = useState<PermissionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    // Check if we have valid role info with a roleId
    if (!isAuthenticated || !currentRoleInfo?.roleId) {
      setPermissions([]);
      return;
    }

    // SuperAdmin bypass - no need to fetch permissions
    if (currentRoleInfo.roleName === 'SuperAdmin') {
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch permissions for current role
      const response = await apiClient.get<{ success: boolean; data: PermissionInfo[] }>(
        `/roles/${currentRoleInfo.roleId}/permissions`
      );

      if (response.data.success && response.data.data) {
        setPermissions(response.data.data);
      } else {
        setPermissions([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch permissions:', err);
      setError(err.message || 'Permission bilgisi alınamadı');
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentRoleInfo]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  /**
   * Check if user has a specific permission
   * @param resource - Resource name (e.g., 'user', 'role', 'birim')
   * @param action - Action name (e.g., 'read', 'create', 'update', 'delete')
   */
  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      // SuperAdmin has all permissions
      if (currentRoleInfo?.roleName === 'SuperAdmin') {
        return true;
      }

      return permissions.some(
        (p) => p.resource.toLowerCase() === resource.toLowerCase() &&
               p.action.toLowerCase() === action.toLowerCase()
      );
    },
    [permissions, currentRoleInfo]
  );

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (checks: Array<{ resource: string; action: string }>): boolean => {
      return checks.some(({ resource, action }) => hasPermission(resource, action));
    },
    [hasPermission]
  );

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    isLoading,
    error,
    refetch: fetchPermissions,
  };
};

// Permission constants for easy access
export const Permissions = {
  User: {
    Read: { resource: 'user', action: 'read' },
    Create: { resource: 'user', action: 'create' },
    Update: { resource: 'user', action: 'update' },
    Delete: { resource: 'user', action: 'delete' },
  },
  Role: {
    Read: { resource: 'role', action: 'read' },
    Create: { resource: 'role', action: 'create' },
    Update: { resource: 'role', action: 'update' },
    Delete: { resource: 'role', action: 'delete' },
  },
  Birim: {
    Read: { resource: 'birim', action: 'read' },
    Create: { resource: 'birim', action: 'create' },
    Update: { resource: 'birim', action: 'update' },
    Delete: { resource: 'birim', action: 'delete' },
  },
  AuditLog: {
    Read: { resource: 'auditlog', action: 'read' },
  },
  File: {
    Upload: { resource: 'file', action: 'upload' },
    Download: { resource: 'file', action: 'download' },
    Delete: { resource: 'file', action: 'delete' },
  },
  System: {
    Read: { resource: 'system', action: 'read' },
    Manage: { resource: 'maintenance', action: 'manage' },
  },
} as const;

export default usePermission;
