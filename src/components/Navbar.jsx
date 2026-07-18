'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, Menu, X, Sparkles, User, LogOut } from 'lucide-react';
import { authClient, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/providers/StoreProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const { data: session } = useSession();
  const { cart, wishlist } = useStore();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Brands', href: '/brands' },
    { name: 'Products', href: '/products' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [menuOpen]);

  // Don't render Navbar on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(233,30,99,0.10)] border-b border-[#F8BBD0]/40 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center shadow-[0_4px_14px_rgba(233,30,99,0.35)] group-hover:shadow-[0_6px_20px_rgba(233,30,99,0.45)] transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 text-white animate-pulse-soft" strokeWidth={2.5} />
            </motion.div>
            <span className="font-display font-bold text-2xl tracking-tight text-[#1F2937]">
              Beauty<span className="text-[#E91E63]">Vault</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-200 py-2 group
                    ${isActive ? 'text-[#E91E63]' : 'text-[#4B5563] hover:text-[#E91E63]'}`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-[#E91E63] to-[#C2185B]
                      transition-all duration-300 ease-out
                      ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF9FB] text-[#4B5563] hover:bg-[#F8BBD0]/30 hover:text-[#E91E63] transition-colors shadow-sm">
              <Search className="w-5 h-5" />
            </button>

            <Link href="/dashboard/my-wishlist" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF9FB] text-[#4B5563] hover:bg-[#F8BBD0]/30 hover:text-[#E91E63] transition-colors relative shadow-sm">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#E91E63] rounded-full border-2 border-white animate-pulse" />
              )}
            </Link>

            <Link href="/dashboard/cart" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF9FB] text-[#4B5563] hover:bg-[#F8BBD0]/30 hover:text-[#E91E63] transition-colors relative shadow-sm">
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1F2937] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce-soft">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            <div className="hidden md:block pl-4 border-l border-gray-200 ml-2">
              {session ? (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF9FB] text-[#E91E63] font-medium hover:bg-[#F8BBD0]/30 transition-colors border border-[#F8BBD0]/50"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="btn-primary py-2.5 px-6 rounded-full text-sm shadow-[0_4px_14px_rgba(233,30,99,0.35)]"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 text-[#1F2937] hover:bg-gray-100 rounded-full"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 top-[72px] bg-white z-40 transition-transform duration-300 ease-in-out md:hidden shadow-xl ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-lg font-medium text-[#1F2937] py-3 border-b border-gray-100 flex justify-between items-center group"
              >
                {link.name}
                <span className="text-[#E91E63] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
            {session ? (
              <>
                <Link 
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FFF9FB] text-[#E91E63] font-medium rounded-xl border border-[#F8BBD0]/50 shadow-sm"
                >
                  <User className="w-5 h-5" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors border border-red-100"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-primary justify-center py-4 text-base w-full shadow-[0_4px_14px_rgba(233,30,99,0.35)]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}