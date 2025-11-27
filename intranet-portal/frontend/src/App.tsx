import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import BirimSelection from './features/auth/BirimSelection';
import AdminLayout from './shared/layouts/AdminLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { Dashboard } from './features/admin/pages/Dashboard';
import { UserList } from './features/admin/pages/UserList';
import { DepartmentList } from './features/admin/pages/DepartmentList';
import { RolePermissions } from './features/admin/pages/RolePermissions';
import { Reports } from './features/admin/pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/select-birim" element={<BirimSelection />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute requireBirimSelection>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="roles" element={<RolePermissions />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
