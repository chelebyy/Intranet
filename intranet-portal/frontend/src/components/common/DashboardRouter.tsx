import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const DashboardRouter = () => {
  const { currentRoleInfo, currentBirimInfo } = useAuthStore();

  // 1. SuperAdmin Check
  const roleName = currentRoleInfo?.roleName;
  if (roleName === 'SuperAdmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 2. Unit Based Routing
  const birimAdi = currentBirimInfo?.birimAdi;

  if (birimAdi === 'Bilgi İşlem') {
    return <Navigate to="/it/dashboard" replace />;
  }

  if (birimAdi === 'Test Birimi') {
    return <Navigate to="/test-unit/dashboard" replace />;
  }

  // Add other units here as they are developed
  // if (birimAdi === 'İnsan Kaynakları') return <Navigate to="/hr/dashboard" replace />;

  // 3. Fallback: Generic Home Dashboard
  return <Navigate to="/home" replace />;
};
