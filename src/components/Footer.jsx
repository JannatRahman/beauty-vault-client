'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-gray-300 pt-20 pb-10 border-t border-[#F8BBD0]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div>
            <Link href="/" className="flex items-center gap-2 group shrink-0 mb-6 inline-flex">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center shadow-[0_4px_14px_rgba(233,30,99,0.35)]">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Beauty<span className="text-[#E91E63]">Vault</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Your premium destination for luxury beauty, skincare, and cosmetics. Discover the world&apos;s most sought-after brands all in one place.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-colors duration-300">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-colors duration-300">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-colors duration-300">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-colors duration-300">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-wide">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-[#E91E63] transition-colors text-sm">Home</Link></li>
              <li><Link href="/brands" className="hover:text-[#E91E63] transition-colors text-sm">All Brands</Link></li>
              <li><Link href="/products" className="hover:text-[#E91E63] transition-colors text-sm">Shop Products</Link></li>
              <li><Link href="/about" className="hover:text-[#E91E63] transition-colors text-sm">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-[#E91E63] transition-colors text-sm">Beauty Blog</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-wide">Customer Service</h3>
            <ul className="space-y-4">
              <li><Link href="/contact" className="hover:text-[#E91E63] transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-[#E91E63] transition-colors text-sm">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-[#E91E63] transition-colors text-sm">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-[#E91E63] transition-colors text-sm">Returns & Exchanges</Link></li>
              <li><Link href="/track" className="hover:text-[#E91E63] transition-colors text-sm">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-wide">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E91E63] shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">123 Beauty Boulevard, Fashion District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#E91E63] shrink-0" />
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#E91E63] shrink-0" />
                <span className="text-sm text-gray-400">support@beautyvault.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BeautyVault. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}