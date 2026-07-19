'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Just take the first 8 for the featured section
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#0F0E17' }}>
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.25), transparent)' }}
        />
        <div
          className="absolute -top-40 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(194,24,91,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-end mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-[#C9A96E]/30 text-[#C9A96E] text-xs font-semibold
              px-5 py-2 rounded-full bg-[#C9A96E]/5 tracking-widest uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse-soft" />
              Community Favorites
            </div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white"
            >
              Trending <span className="animate-gold-shimmer">Favorites</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/40 font-light"
            >
              Shop our most sought-after products, loved by the BeautyVault community.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden md:block"
          >
            <Link href="/products" className="btn-outline-gold text-sm">
              View All Products
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl p-4 h-[400px] flex flex-col animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-full h-48 rounded-2xl mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="w-2/3 h-4 rounded mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="w-full h-6 rounded mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="w-1/3 h-4 rounded mb-auto" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="w-full h-10 rounded-full mt-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7"
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <div
                  className="rounded-3xl p-4 group relative flex flex-col h-full card-hover border border-white/5 hover:border-[#C9A96E]/20 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {(product.productImage || product.image) ? (
                      <img
                        src={product.productImage || product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'}
                        alt={product.productName || product.title || product.name || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <ShoppingBag size={48} />
                      </div>
                    )}

                    {/* Category tag */}
                    {product.category && (
                      <div
                        className="absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(15,14,23,0.75)', border: '1px solid rgba(201,169,110,0.25)' }}
                      >
                        <span className="text-[10px] font-semibold text-[#C9A96E] uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs text-white/35 font-medium uppercase tracking-wider">
                        {product.brandName || product.brand || 'BeautyVault'}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#C9A96E] text-[#C9A96E]" />
                        <span className="text-xs font-medium text-white/55">{product.rating || '4.8'}</span>
                      </div>
                    </div>

                    <Link href={`/products/${product._id}`} className="mb-2">
                      <h3 className="font-semibold text-white/85 group-hover:text-[#C9A96E] transition-colors line-clamp-2 leading-tight">
                        {product.productName || product.title || product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/6">
                      <p className="font-bold text-lg text-white">
                        ${product.price}
                      </p>
                      <button
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 text-[#C9A96E] hover:text-[#1A1825]"
                        style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.2)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #C9A96E, #B8935A)';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(201,169,110,0.12)';
                          e.currentTarget.style.borderColor = 'rgba(201,169,110,0.2)';
                        }}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link href="/products" className="btn-outline-gold w-full justify-center">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}