import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Page Components
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MembersListPage from './pages/admin/MembersListPage';
import MemberDetailPage from './pages/admin/MemberDetailPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

// Layout Components
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Loading Component
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicLayout>
          <RegisterPage />
        </PublicLayout>
      } />

      <Route path="/home" element={
        <PublicLayout>
          <HomePage />
        </PublicLayout>
      } />

      <Route path="/register" element={
        <PublicLayout>
          <RegisterPage />
        </PublicLayout>
      } />
      
      <Route path="/registration-success" element={
        <RegistrationSuccessPage />
      } />
      
      {/* Auth Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/members" element={
        <ProtectedRoute>
          <AdminLayout>
            <MembersListPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/members/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <MemberDetailPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/analytics" element={
        <ProtectedRoute>
          <AdminLayout>
            <AnalyticsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-8">Page not found</p>
            <a
              href="/"
              className="bgp-btn-primary inline-block"
            >
              Go Home
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;