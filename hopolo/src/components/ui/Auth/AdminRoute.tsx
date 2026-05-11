import React from 'react';
import { Navigate, useLocation, useRouteLoaderData } from 'react-router';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const rootData = useRouteLoaderData('root') as { serverUser: any, role: string } | undefined;

  // We rely on the AdminLayout loader for security redirects.
  // This component simply ensures we don't render children if data is still loading
  // or if the user is not an admin (as a fallback).
  
  if (!rootData) return null;

  const isAdmin = rootData.role === 'admin';
  if (!isAdmin) return null;

  return <>{children}</>;
};

export default AdminRoute;
