'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag } from 'lucide-react';

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
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Trending <span className="gradient-text">Favorites</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#6B7280]"
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
            <Link href="/products" className="btn-outline text-sm">
              View All Products
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-3xl p-4 h-[400px] flex flex-col">
                <div className="w-full h-48 skeleton rounded-2xl mb-4"></div>
                <div className="w-2/3 h-4 skeleton rounded mb-2"></div>
                <div className="w-full h-6 skeleton rounded mb-4"></div>
                <div className="w-1/3 h-4 skeleton rounded mb-auto"></div>
                <div className="w-full h-10 skeleton rounded-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <div className="glass rounded-3xl p-4 group relative flex flex-col h-full card-hover bg-white border border-[#F8BBD0]/30 hover:border-[#F8BBD0]">
                  {/* Image Container */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-[#FFF9FB]">
                    {(product.productImage || product.image) ? (
                      <Image
                        src={product.productImage || product.image}
                        alt={product.productName || product.title || product.name || 'Product'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#F8BBD0]">
                        <ShoppingBag size={48} />
                      </div>
                    )}
                    
                    {/* Tag Overlay */}
                    {product.category && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                        <span className="text-[10px] font-semibold text-[#E91E63] uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">
                        {product.brandName || product.brand || 'BeautyVault'}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                        <span className="text-xs font-medium text-[#1F2937]">{product.rating || '4.8'}</span>
                      </div>
                    </div>
                    
                    <Link href={`/products/${product._id}`} className="mb-2 group-hover:text-[#E91E63] transition-colors">
                      <h3 className="font-semibold text-[#1F2937] line-clamp-2 leading-tight">
                        {product.productName || product.title || product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <p className="font-bold text-lg text-[#1F2937]">
                        ${product.price}
                      </p>
                      <button className="w-9 h-9 bg-[#FFF9FB] rounded-full flex items-center justify-center text-[#E91E63] hover:bg-[#E91E63] hover:text-white transition-colors duration-300">
                        <ShoppingBag className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link href="/products" className="btn-outline w-full justify-center">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}