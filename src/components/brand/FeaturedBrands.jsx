'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Loader2, AlertCircle, Component } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

export default function FeaturedBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        if (!res.ok) throw new Error('Failed to fetch brands');
        const data = await res.json();
        // Just take the first 8 for the featured section
        setBrands(data.slice(0, 8));
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Unable to load featured brands at this time.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#FAFAF9' }}>
      {/* Subtle background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(ellipse, #F5EDD8 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-[#C9A96E]/35 text-[#B8935A] text-xs font-semibold
              px-5 py-2 rounded-full bg-[#C9A96E]/6 tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
            Curated Collection
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#1A1825]"
          >
            Featured <span className="animate-gold-shimmer">Brands</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#1A1825]/45 max-w-2xl mx-auto text-lg font-light"
          >
            Discover our curated collection of the world&apos;s most loved beauty brands.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
            <Loader2 className="w-8 h-8 text-[#C9A96E] animate-spin" />
            <p className="text-[#1A1825]/40 font-medium text-sm">Loading featured brands...</p>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] p-8 text-center max-w-lg mx-auto border"
            style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="rounded-[2rem] p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[200px]"
            style={{ background: 'rgba(26,24,37,0.04)', border: '1px solid rgba(201,169,110,0.12)' }}>
            <Component className="w-16 h-16 text-[#1A1825]/20 mb-4" />
            <h3 className="text-lg font-bold text-[#1A1825] mb-2">No Brands Found</h3>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {brands.map((brand, idx) => (
              <motion.div key={brand.brandName || idx} variants={itemVariants}>
                <div
                  className="rounded-3xl p-6 flex flex-col h-full card-hover group text-center border border-transparent hover:border-[#C9A96E]/20 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}
                >
                  {/* Logo circle */}
                  <div
                    className="w-24 h-24 mx-auto rounded-full mb-5 overflow-hidden relative group-hover:shadow-lg transition-shadow flex items-center justify-center"
                    style={{
                      background: '#F5F0EA',
                      border: '2px solid rgba(201,169,110,0.15)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    }}
                  >
                    {brand.brandLogo ? (
                      <img
                        src={brand.brandLogo}
                        alt={brand.brandName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1522337788-75e7a9f7e8ba?auto=format&fit=crop&q=80&w=200&h=200'; }}
                      />
                    ) : (
                      <span className="text-3xl font-bold text-[#C9A96E]/60">{brand.brandName?.charAt(0)}</span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-[#1A1825] mb-1 line-clamp-1">
                    {brand.brandName || 'Unknown Brand'}
                  </h3>
                  <p className="text-xs font-semibold text-[#1A1825]/35 uppercase tracking-widest mb-6">
                    {brand.totalProducts || 0} Products
                  </p>

                  <div className="mt-auto pt-4 border-t border-[#1A1825]/6">
                    <Link
                      href={`/brands/${encodeURIComponent(brand.brandName)}`}
                      className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 text-[#B8935A] hover:text-[#1A1825]"
                      style={{
                        background: 'rgba(201,169,110,0.08)',
                        border: '1px solid rgba(201,169,110,0.2)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #C9A96E, #B8935A)';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.color = '#1A1825';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(201,169,110,0.08)';
                        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.2)';
                        e.currentTarget.style.color = '#B8935A';
                      }}
                    >
                      <Eye className="w-4 h-4" /> View All Products
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}