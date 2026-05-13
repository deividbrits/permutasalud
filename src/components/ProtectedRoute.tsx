import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('userToken');
  const userStr = localStorage.getItem('userData');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    try {
      const user = JSON.parse(userStr);
      if (!user?.isAdmin) {
        return <Navigate to="/dashboard" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
