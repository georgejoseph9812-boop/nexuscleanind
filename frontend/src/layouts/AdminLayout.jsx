import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { ToastContainer } from '../components/common/Toast';
import { useApp } from '../context/AppContext';

export const AdminLayout = () => {
  const { currentUser, loading } = useApp();
  const location = useLocation();

  if (!currentUser && !loading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser && currentUser.role !== 'admin') {
    return <Navigate to="/citizen" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar role="admin" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
