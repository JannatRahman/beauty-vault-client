'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FFF9FB] flex">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto mt-16 md:mt-0">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
