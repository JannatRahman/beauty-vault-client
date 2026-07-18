'use client';

import React from 'react';
import { useSession } from '@/lib/auth-client';
import { Bell } from 'lucide-react';

export default function DashboardTopbar() {
  const { data: session } = useSession();

  return (
    <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-[#F8BBD0]/30 items-center justify-between px-8 sticky top-0 z-30">
      
      <div>
        <h1 className="text-2xl font-display font-bold text-[#1F2937]">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Beautiful'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here is what&apos;s happening with your store today.</p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-[#E91E63] transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#E91E63] rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-[#1F2937] leading-none mb-1">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 leading-none">
              {session?.user?.email || 'user@example.com'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F8BBD0] to-[#E91E63] flex items-center justify-center text-white font-bold shadow-sm border-2 border-white">
            {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}