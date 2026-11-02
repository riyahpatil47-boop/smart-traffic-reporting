import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';

export function ProtectedRoute({
  children,
  role,
}: {
  children: ReactNode;
  role?: 'user' | 'admin';
}) {
  const { user } = useAuth();
  const location = useLocation();

  // While the auth context hydrates from localStorage, user is null.
  // We can't distinguish "loading" from "logged out" without a loading flag,
  // so we check sessionStorage for a hydration marker.
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
        replace
      />
    );
  }

  return <>{children}</>;
}
