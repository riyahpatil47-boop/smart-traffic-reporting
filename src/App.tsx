import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserLayout, AdminLayout } from '@/components/layouts/DashboardLayouts';

import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage, SignupPage } from '@/pages/auth/AuthPages';
import { NotFound } from '@/pages/NotFound';
import { LiveTraffic } from '@/pages/LiveTraffic';

import { UserOverview } from '@/pages/user/UserOverview';
import { ReportIncident } from '@/pages/user/ReportIncident';
import { MyReports } from '@/pages/user/MyReports';
import { NotificationsPage } from '@/pages/user/NotificationsPage';
import { UserProfile } from '@/pages/user/UserProfile';

import { AdminOverview } from '@/pages/admin/AdminOverview';
import { AdminIncidents } from '@/pages/admin/AdminIncidents';
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics';
import { AdminNotifications } from '@/pages/admin/AdminNotifications';
import { AdminProfile } from '@/pages/admin/AdminProfile';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/traffic" element={<LiveTraffic />} />

            {/* User */}
            <Route
              path="/user"
              element={
                <ProtectedRoute role="user">
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserOverview />} />
              <Route path="report" element={<ReportIncident />} />
              <Route path="reports" element={<MyReports />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminOverview />} />
              <Route path="incidents" element={<AdminIncidents />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
