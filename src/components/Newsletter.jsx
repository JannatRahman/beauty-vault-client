'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="glass-dark !bg-[#1F2937] rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#E91E63] to-[#C2185B] rounded-full blur-[80px] opacity-40" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#F8BBD0] to-[#E91E63] rounded-full blur-[80px] opacity-20" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
              <Mail className="w-8 h-8 text-[#F8BBD0]" />
            </div>
            
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8BBD0] to-[#E91E63]">BeautyVault</span> Community
            </h2>
            
            <p className="text-gray-300 mb-10 text-lg">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-grow relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full h-14 pl-6 pr-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#F8BBD0] focus:ring-1 focus:ring-[#F8BBD0] transition-all backdrop-blur-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-14 px-8 rounded-full bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(233,30,99,0.4)] transition-all duration-300 shrink-0 group"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            
            <p className="text-gray-400 text-xs mt-6">
              By subscribing you agree to our Terms & Conditions and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
