'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  LayoutDashboard, 
  PlusCircle, 
  Heart, 
  ShoppingBag, 
  User, 
  Home,
  Menu,
  X,
  Package
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Add Product', href: '/dashboard/add-product', icon: PlusCircle },
    { name: 'My Products', href: '/dashboard/my-products', icon: Package },
    { name: 'My Wishlist', href: '/dashboard/my-wishlist', icon: Heart },
    { name: 'My Cart Items', href: '/dashboard/cart', icon: ShoppingBag },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg">BeautyVault</span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-500">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-[#F8BBD0]/50 shadow-[4px_0_24px_rgba(233,30,99,0.02)] flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-[#F8BBD0]/30 hidden md:flex">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center shadow-[0_4px_14px_rgba(233,30,99,0.35)] group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-[#1F2937]">
              Beauty<span className="text-[#E91E63]">Vault</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
            Menu
          </div>
          
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group
                  ${isActive 
                    ? 'text-[#E91E63] bg-[#FFF9FB] border border-[#F8BBD0]/50 shadow-sm' 
                    : 'text-gray-500 hover:text-[#E91E63] hover:bg-gray-50'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#E91E63]' : 'text-gray-400 group-hover:text-[#E91E63]'}`} />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-8">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
              Store
            </div>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-[#E91E63] hover:bg-gray-50 transition-all duration-200"
            >
              <Home className="w-5 h-5 text-gray-400" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#F8BBD0]/30 bg-gray-50/50 mt-auto">
          <LogoutButton className="w-full justify-center" />
        </div>
      </aside>
    </>
  );
}