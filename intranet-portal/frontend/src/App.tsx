import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoginPage from './features/auth/LoginPage';
import BirimSelection from './features/auth/BirimSelection';
import AdminLayout from './shared/layouts/AdminLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { Permissions } from './hooks/usePermission';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./features/admin/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const UserList = lazy(() => import('./features/admin/pages/UserList').then(module => ({ default: module.UserList })));
const UserCreate = lazy(() => import('./features/admin/pages/UserCreate').then(module => ({ default: module.UserCreate })));
const UserEdit = lazy(() => import('./features/admin/pages/UserEdit').then(module => ({ default: module.UserEdit })));
const DepartmentList = lazy(() => import('./features/admin/pages/DepartmentList').then(module => ({ default: module.DepartmentList })));
const RolePermissions = lazy(() => import('./features/admin/pages/RolePermissions').then(module => ({ default: module.RolePermissions })));
const Reports = lazy(() => import('./features/admin/pages/Reports').then(module => ({ default: module.Reports })));
const Profile = lazy(() => import('./features/admin/pages/Profile').then(module => ({ default: module.Profile })));
const AuditLogList = lazy(() => import('./features/admin/pages/AuditLogList').then(module => ({ default: module.AuditLogList })));
const IPRestrictions = lazy(() => import('./features/admin/pages/IPRestrictions').then(module => ({ default: module.IPRestrictions })));
const UnvanList = lazy(() => import('./features/admin/pages/UnvanList').then(module => ({ default: module.UnvanList })));
const ITDashboard = lazy(() => import('./features/it/pages/ITDashboard').then(module => ({ default: module.ITDashboard })));
const ArizaList = lazy(() => import('./features/it/pages/ArizaList').then(module => ({ default: module.ArizaList })));
const TestUnitDashboard = lazy(() => import('./features/test-unit/pages/TestUnitDashboard').then(module => ({ default: module.TestUnitDashboard })));
const TestCases = lazy(() => import('./features/test-unit/pages/TestCases').then(module => ({ default: module.TestCases })));
const GenelButceDashboard = lazy(() => import('./features/genelButce/pages/GenelButceDashboard').then(module => ({ default: module.GenelButceDashboard })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
  </div>
);

/**
 * Main App component with route-level permission protection
 * Reference: IMPLEMENTATION_ROADMAP.md - Faz 3
 */
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
          {/* Dashboard - accessible to all authenticated users */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          } />

          {/* User Management - requires user.read permission */}
          <Route path="users" element={
            <ProtectedRoute requiredPermission={Permissions.User.Read}>
              <Suspense fallback={<PageLoader />}>
                <UserList />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="users/create" element={
            <ProtectedRoute requiredPermission={Permissions.User.Create}>
              <Suspense fallback={<PageLoader />}>
                <UserCreate />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="users/:id/edit" element={
            <ProtectedRoute requiredPermission={Permissions.User.Update}>
              <Suspense fallback={<PageLoader />}>
                <UserEdit />
              </Suspense>
            </ProtectedRoute>
          } />


          {/* Role & Permissions - requires role.read permission */}
          <Route path="roles" element={
            <ProtectedRoute requiredPermission={Permissions.Role.Read}>
              <Suspense fallback={<PageLoader />}>
                <RolePermissions />
              </Suspense>
            </ProtectedRoute>
          } />

          {/* Reports - requires auditlog.read permission */}
          <Route path="reports" element={
            <ProtectedRoute requiredPermission={Permissions.AuditLog.Read}>
              <Suspense fallback={<PageLoader />}>
                <Reports />
              </Suspense>
            </ProtectedRoute>
          } />

          {/* Audit Log - requires auditlog.read permission */}
          <Route path="audit-log" element={
            <ProtectedRoute requiredPermission={Permissions.AuditLog.Read}>
              <Suspense fallback={<PageLoader />}>
                <AuditLogList />
              </Suspense>
            </ProtectedRoute>
          } />

          {/* IP Restrictions - requires system.read permission */}
          <Route path="ip-restrictions" element={
            <ProtectedRoute requiredPermission={Permissions.System.Read}>
              <Suspense fallback={<PageLoader />}>
                <IPRestrictions />
              </Suspense>
            </ProtectedRoute>
          } />

          {/* Profile - accessible to all authenticated users */}
          <Route path="profile" element={
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          } />

          {/* Definitions - Tanımlamalar */}
          <Route path="definitions/unvanlar" element={
            <ProtectedRoute requiredPermission={Permissions.Unvan.Read}>
              <Suspense fallback={<PageLoader />}>
                <UnvanList />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="definitions/departments" element={
            <ProtectedRoute requiredPermission={Permissions.Birim.Read}>
              <Suspense fallback={<PageLoader />}>
                <DepartmentList />
              </Suspense>
            </ProtectedRoute>
          } />

          {/* IT Module Routes */}
          <Route path="it/dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <ITDashboard />
            </Suspense>
          } />
          <Route path="it/ariza" element={
            <Suspense fallback={<PageLoader />}>
              <ArizaList />
            </Suspense>
          } />

          {/* Test Unit Module Routes */}
          <Route path="test-unit/dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <TestUnitDashboard />
            </Suspense>
          } />
          <Route path="test-unit/cases" element={
            <Suspense fallback={<PageLoader />}>
              <TestCases />
            </Suspense>
          } />

          {/* Genel Butce Module Routes */}
          <Route path="genel-butce/dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <GenelButceDashboard />
            </Suspense>
          } />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
