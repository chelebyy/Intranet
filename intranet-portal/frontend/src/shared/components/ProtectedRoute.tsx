import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermission } from '../../hooks/usePermission';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireBirimSelection?: boolean;
  /** Required permission to access this route */
  requiredPermission?: { resource: string; action: string };
  /** Multiple permissions - user needs ANY of these */
  requiredAnyPermission?: Array<{ resource: string; action: string }>;
  /** Fallback component when permission denied */
  fallback?: React.ReactNode;
}

/** Loading spinner component */
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary"></div>
  </div>
);

/** Hook to check if user has required permissions */
const usePermissionCheck = (
  requiredPermission?: { resource: string; action: string },
  requiredAnyPermission?: Array<{ resource: string; action: string }>
) => {
  const { currentRoleInfo } = useAuthStore();
  const { hasPermission, hasAnyPermission, isLoading } = usePermission();

  const isSuperAdmin = currentRoleInfo?.roleName === 'SuperAdmin';
  
  // SuperAdmin always has access
  if (isSuperAdmin) return { hasAccess: true, isLoading: false };
  
  // No requirements means access granted
  const noRequirements = !requiredPermission && (!requiredAnyPermission || requiredAnyPermission.length === 0);
  if (noRequirements) return { hasAccess: true, isLoading: false };
  
  if (isLoading) return { hasAccess: false, isLoading: true };

  // Check single permission
  if (requiredPermission) {
    const hasIt = hasPermission(requiredPermission.resource, requiredPermission.action);
    if (!hasIt) return { hasAccess: false, isLoading: false };
  }

  // Check any permission
  if (requiredAnyPermission && requiredAnyPermission.length > 0) {
    const hasAny = hasAnyPermission(requiredAnyPermission);
    if (!hasAny) return { hasAccess: false, isLoading: false };
  }

  return { hasAccess: true, isLoading: false };
};

/**
 * Protected Route component with authentication and permission checks
 * Reference: IMPLEMENTATION_ROADMAP.md - Faz 3
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireBirimSelection = false,
  requiredPermission,
  requiredAnyPermission,
  fallback
}) => {
  const { isAuthenticated, birimleri, selectedBirim } = useAuthStore();
  const { hasAccess, isLoading } = usePermissionCheck(requiredPermission, requiredAnyPermission);

  // Authentication check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Birim selection check
  if (requireBirimSelection && birimleri.length > 1 && !selectedBirim) {
    return <Navigate to="/select-birim" replace />;
  }

  // Permission loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Permission denied
  if (!hasAccess) {
    return fallback ? <>{fallback}</> : <AccessDenied />;
  }

  return <>{children}</>;
};

/**
 * Access Denied component shown when user lacks permission
 */
const AccessDenied: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full w-full min-h-[400px] p-8">
    <div className="text-6xl mb-4">🚫</div>
    <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
      Erişim Reddedildi
    </h2>
    <p className="text-text-secondary dark:text-dark-text-secondary text-center max-w-md">
      Bu sayfaya erişim yetkiniz bulunmamaktadır. 
      Yetki almak için sistem yöneticinize başvurun.
    </p>
  </div>
);

export default ProtectedRoute;
export { AccessDenied };
