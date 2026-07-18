'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ className = '' }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600 ${className}`}
    >
      <LogOut className="w-5 h-5" />
      <span>Sign Out</span>
    </button>
  );
}
