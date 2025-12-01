import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoginPage from './features/auth/LoginPage';
import BirimSelection from './features/auth/BirimSelection';
import AdminLayout from './shared/layouts/AdminLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./features/admin/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const UserList = lazy(() => import('./features/admin/pages/UserList').then(module => ({ default: module.UserList })));
const UserCreate = lazy(() => import('./features/admin/pages/UserCreate').then(module => ({ default: module.UserCreate })));
const DepartmentList = lazy(() => import('./features/admin/pages/DepartmentList').then(module => ({ default: module.DepartmentList })));
const RolePermissions = lazy(() => import('./features/admin/pages/RolePermissions').then(module => ({ default: module.RolePermissions })));
const Reports = lazy(() => import('./features/admin/pages/Reports').then(module => ({ default: module.Reports })));
const Profile = lazy(() => import('./features/admin/pages/Profile').then(module => ({ default: module.Profile })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
  </div>
);

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
          <Route path="dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="users" element={
            <Suspense fallback={<PageLoader />}>
              <UserList />
            </Suspense>
          } />
          <Route path="users/create" element={
            <Suspense fallback={<PageLoader />}>
              <UserCreate />
            </Suspense>
          } />
          <Route path="departments" element={
            <Suspense fallback={<PageLoader />}>
              <DepartmentList />
            </Suspense>
          } />
          <Route path="roles" element={
            <Suspense fallback={<PageLoader />}>
              <RolePermissions />
            </Suspense>
          } />
          <Route path="reports" element={
            <Suspense fallback={<PageLoader />}>
              <Reports />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<PageLoader />}>
              <Profile />
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
