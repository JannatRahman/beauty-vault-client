'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Loader2, AlertCircle, Component } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
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
    <section className="py-20 bg-[#FFF9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Featured <span className="gradient-text">Brands</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] max-w-2xl mx-auto"
          >
            Discover our curated collection of the world&apos;s most loved beauty brands.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
            <Loader2 className="w-8 h-8 text-[#E91E63] animate-spin" />
            <p className="text-gray-500 font-medium text-sm">Loading featured brands...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-[2rem] p-8 text-center text-red-500 font-medium max-w-lg mx-auto border border-red-100 bg-red-50/50">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            {error}
          </div>
        ) : brands.length === 0 ? (
          <div className="glass rounded-[2rem] p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[200px]">
            <Component className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">No Brands Found</h3>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {brands.map((brand, idx) => (
              <motion.div key={brand.brandName || idx} variants={itemVariants}>
                <div className="glass rounded-3xl p-5 flex flex-col h-full card-hover bg-white border border-[#F8BBD0]/30 hover:border-[#F8BBD0] group text-center">
                  <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full border-4 border-[#FFF9FB] shadow-sm mb-4 overflow-hidden relative group-hover:shadow-md transition-shadow flex items-center justify-center">
                    {brand.brandLogo ? (
                      <img 
                        src={brand.brandLogo} 
                        alt={brand.brandName} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522337788-75e7a9f7e8ba?auto=format&fit=crop&q=80&w=200&h=200'; }}
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-300">{brand.brandName?.charAt(0)}</span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-[#1F2937] mb-1 line-clamp-1">
                    {brand.brandName || 'Unknown Brand'}
                  </h3>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
                    {brand.totalProducts || 0} Products
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <Link 
                      href={`/brands/${encodeURIComponent(brand.brandName)}`}
                      className="w-full btn-primary py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm font-bold bg-[#FFF9FB] border border-[#E91E63]/20 text-[#E91E63] hover:bg-[#E91E63] hover:text-white transition-all"
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