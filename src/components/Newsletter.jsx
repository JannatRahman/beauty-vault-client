'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#FAFAF9' }}>
      {/* Subtle top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.25), transparent)' }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[3rem] overflow-hidden p-10 md:p-16 text-center"
          style={{
            background: '#0F0E17',
            border: '1px solid rgba(201,169,110,0.12)',
            boxShadow: '0 40px 100px rgba(15,14,23,0.15)',
          }}
        >
          {/* Aurora blobs */}
          <div
            className="absolute -top-32 -right-32 w-72 h-72 rounded-full opacity-50 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(201,169,110,0.25) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full opacity-40 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(194,24,91,0.2) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />

          {/* Top decorative line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-8"
              style={{
                background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.08))',
                border: '1px solid rgba(201,169,110,0.25)',
              }}
            >
              <Mail className="w-7 h-7 text-[#C9A96E]" />
            </motion.div>

            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              Join{' '}
              <span className="animate-gold-shimmer">BeautyVault</span>
              {' '}Community
            </h2>

            <p className="text-white/40 mb-10 text-lg font-light">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-grow relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full h-14 pl-6 pr-4 rounded-full text-white placeholder-white/25 focus:outline-none transition-all text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(201,169,110,0.2)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(201,169,110,0.5)';
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(201,169,110,0.2)';
                    e.target.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-gold h-14 px-8 rounded-full shrink-0 group"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="text-white/25 text-xs mt-6">
              By subscribing you agree to our Terms &amp; Conditions and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
