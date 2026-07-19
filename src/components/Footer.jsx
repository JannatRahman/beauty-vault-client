'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Don't render Footer on dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

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
              <a href="https://amila-s-portfolio-swart.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-colors duration-300">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M20 6h-4v-2c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v2h-4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-10c0-1.103-.897-2-2-2zm-10-2h4v2h-4v-2zm10 14h-16v-10h16v10z"/></svg>
              </a>
              <a href="https://github.com/JannatRahman" target="_blank" rel="noopener noreferrer" aria-label="Github" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-colors duration-300">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
             
              <a href="https://www.linkedin.com/in/jannat-amila-rahman/" target="_blank" rel="noopener noreferrer" aria-label="Linkedin" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E91E63] hover:text-white transition-colors duration-300">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
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