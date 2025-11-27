import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireBirimSelection?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireBirimSelection = false }) => {
  const { isAuthenticated, birimleri, selectedBirim } = useAuthStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If birim selection is required and user has multiple birimler but none selected, redirect to birim selection
  if (requireBirimSelection && birimleri.length > 1 && !selectedBirim) {
    return <Navigate to="/select-birim" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
