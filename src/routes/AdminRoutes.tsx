import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminLayout from '../components/AdminLayout';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ContentManagementPage from '../pages/admin/ContentManagementPage';
import SettingsPage from '../pages/admin/SettingsPage';

// Simplified AdminRoutes component
const AdminRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/content" element={<ContentManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes; 