'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Heart,
  Search,
} from 'lucide-react';

// ─── Nav Link Data ────────────────────────────────────────────────
const publicLinks = [
  { label: 'Home', href: '/' },
  { label: 'Brands', href: '/brands' },
  { label: 'Products', href: '/products' },
];

// ─── NavLink Component ────────────────────────────────────────────
function NavLink({ href, label, pathname, onClick }) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative group text-sm font-medium tracking-wide transition-colors duration-200
        ${isActive ? 'text-[#E91E63]' : 'text-[#1F2937] hover:text-[#E91E63]'}`}
    >
      {label}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-[#E91E63] to-[#C2185B]
          transition-all duration-300 ease-out
          ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
      />
    </Link>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [cartCount]               = useState(3); // placeholder
  const pathname                  = usePathname();

  // Scroll handler
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main Nav Bar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(233,30,99,0.10)] border-b border-[#F8BBD0]/40'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center shadow-[0_4px_14px_rgba(233,30,99,0.35)]"
              >
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              </motion.div>
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-[#E91E63]">Beauty</span>
                <span className="text-[#1F2937]">Vault</span>
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-8">
              {publicLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  pathname={pathname}
                />
              ))}
            </nav>

            {/* ── Desktop Actions ── */}
            <div className="hidden md:flex items-center gap-3">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl text-[#1F2937] hover:text-[#E91E63] hover:bg-[#FFF9FB] transition-all duration-200 group"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 text-[10px] font-bold
                      bg-gradient-to-br from-[#E91E63] to-[#C2185B] text-white rounded-full
                      flex items-center justify-center leading-none"
                    style={{ width: '18px', height: '18px' }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Login / Profile */}
              <Link
                href="/login"
                className="btn-primary text-sm py-2.5 px-5"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            </div>

            {/* ── Mobile: Cart + Hamburger ── */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl text-[#1F2937] hover:text-[#E91E63] transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-[9px] font-bold
                      bg-[#E91E63] text-white rounded-full flex items-center justify-center"
                    style={{ width: '16px', height: '16px' }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-2.5 rounded-xl text-[#1F2937] hover:bg-[#F8BBD0]/30 transition-colors"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden
                bg-white/98 backdrop-blur-2xl
                shadow-[-20px_0_60px_rgba(233,30,99,0.12)]
                flex flex-col"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#F8BBD0]/50">
                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-display font-bold text-lg">
                    <span className="text-[#E91E63]">Beauty</span>
                    <span className="text-[#1F2937]">Vault</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-[#F8BBD0]/30 text-[#1F2937] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <p className="text-[11px] font-semibold tracking-widest text-[#E91E63]/60 uppercase px-3 mb-3">
                  Navigate
                </p>
                {publicLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200
                        ${pathname === link.href
                          ? 'bg-gradient-to-r from-[#E91E63]/10 to-[#F8BBD0]/20 text-[#E91E63]'
                          : 'text-[#1F2937] hover:bg-[#FFF9FB] hover:text-[#E91E63]'
                        }`}
                    >
                      <span>{link.label}</span>
                      {pathname === link.href && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E91E63]" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom CTA */}
              <div className="px-6 py-6 border-t border-[#F8BBD0]/40 space-y-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn-outline w-full justify-center"
                >
                  Create Account
                </Link>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}