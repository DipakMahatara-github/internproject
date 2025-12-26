import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, requireAdmin = false, blockAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  if (blockAdmin && user.is_admin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
