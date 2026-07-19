'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Eye,
  Loader2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';

export default function BrandProductsPage({ params }) {
  const { brandName } = use(params);
  const decodedBrandName = decodeURIComponent(brandName);
  
  const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist, trackBehavior } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        
        // Filter products by brandName on the client since API doesn't have a specific brand endpoint
        const filtered = data.filter(p => 
          (p.brandName || p.brand)?.toLowerCase().replace(/-/g, ' ') === decodedBrandName.toLowerCase().replace(/-/g, ' ')
        );
        
        setProducts(filtered);
        trackBehavior('view_brand', { brand: decodedBrandName });
      } catch (err) {
        console.error('Error fetching brand products:', err);
        setError('Unable to load products for this brand.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrandProducts();
  }, [decodedBrandName]);

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some((item) => item._id === product._id);
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FFF9FB]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <Link 
            href="/brands" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#E91E63] transition-colors mb-4"
          >
            <ArrowLeft className="w-4.5 h-4.5" /> Back to Brands
          </Link>
          
          <div className="glass rounded-[2rem] p-8 flex items-center justify-between border border-[#F8BBD0]/30 shadow-sm bg-white/50">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#1F2937]">
                {decodedBrandName} Collection
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Explore all premium products available from {decodedBrandName}.
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-400 shrink-0 hidden sm:flex">
              {decodedBrandName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
              <Loader2 className="w-8 h-8 text-[#E91E63] animate-spin" />
              <p className="text-gray-500 font-medium text-sm">Loading {decodedBrandName} products...</p>
            </div>
          ) : error ? (
            <div className="glass rounded-[2rem] p-8 text-center text-red-500 font-medium max-w-lg mx-auto border border-red-100 bg-red-50/50">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="glass rounded-[2rem] p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[300px]">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-[#1F2937] mb-2">No Products Available</h3>
              <p className="text-sm text-gray-500">
                It looks like we don't have any products from {decodedBrandName} right now.
              </p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product) => {
                  const isWishlisted = wishlist.some((item) => item._id === product._id);
                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="glass rounded-3xl p-4 flex flex-col h-full card-hover bg-white border border-[#F8BBD0]/30 hover:border-[#F8BBD0] group relative"
                    >
                      {/* Image area */}
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-[#FFF9FB]">
                        {product.productImage || product.image ? (
                          <img 
                            src={product.productImage || product.image} 
                            alt={product.productName || product.title || product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300&h=300';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#F8BBD0]">
                            <ShoppingBag size={48} />
                          </div>
                        )}

                        {/* Wishlist toggle */}
                        <button
                          onClick={() => toggleWishlist(product)}
                          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all border ${
                            isWishlisted 
                              ? 'bg-[#E91E63] border-transparent text-white' 
                              : 'bg-white/80 backdrop-blur-md border-gray-100 text-gray-500 hover:text-[#E91E63] hover:bg-white'
                          }`}
                        >
                          <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Info section */}
                      <div className="flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider line-clamp-1">
                            {product.category || 'Beauty'}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                            <span className="text-xs font-semibold text-gray-700">{product.rating || '4.5'}</span>
                          </div>
                        </div>

                        <Link href={`/products/${product._id}`} className="mb-2 hover:text-[#E91E63] transition-colors">
                          <h3 className="font-bold text-[#1F2937] line-clamp-2 leading-tight text-sm">
                            {product.productName || product.title || product.name}
                          </h3>
                        </Link>

                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                          <p className="font-extrabold text-[#1F2937] text-lg">
                            ${product.price}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <Link 
                              href={`/products/${product._id}`}
                              className="w-9 h-9 rounded-full bg-[#E91E63]/10 text-[#E91E63] hover:bg-[#E91E63] hover:text-white transition-colors flex items-center justify-center"
                              title="View Details"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </Link>
                            <button
                              onClick={() => addToCart(product)}
                              className="w-9 h-9 rounded-full bg-[#1F2937] text-white hover:bg-[#E91E63] transition-colors flex items-center justify-center"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
