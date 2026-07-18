'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight,
  Eye,
  Star
} from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-display font-bold text-[#1F2937] flex items-center gap-2">
          My <span className="text-[#E91E63]">Wishlist</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Review the luxury items you've added to your custom wishlist.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass rounded-[2rem] p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-20 h-20 rounded-full bg-[#FFF9FB] border border-[#F8BBD0]/40 flex items-center justify-center mb-6 text-[#E91E63] shadow-inner">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
            Keep track of items you love by clicking the heart icon on product cards.
          </p>
          <Link href="/products" className="btn-primary px-8 py-3.5 rounded-2xl flex items-center gap-2 font-bold shadow-md">
            Find Products <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl p-4 flex flex-col h-full card-hover bg-white border border-[#F8BBD0]/30 hover:border-[#F8BBD0] group relative"
              >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-[#FFF9FB]">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300&h=300'} 
                    alt={product.title || product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Tag */}
                  {product.category && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                      <span className="text-[10px] font-semibold text-[#E91E63] uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                  )}

                  {/* Remove Button Overlay */}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      {product.brandName || product.brand || 'BeautyVault'}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                      <span className="text-xs font-semibold text-gray-700">{product.rating || '4.8'}</span>
                    </div>
                  </div>

                  <Link href={`/products/${product._id}`} className="mb-2 hover:text-[#E91E63] transition-colors block">
                    <h3 className="font-bold text-[#1F2937] line-clamp-2 leading-tight text-sm md:text-base">
                      {product.title || product.name}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <p className="font-extrabold text-[#1F2937] text-lg">
                      ${product.price}
                    </p>

                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/products/${product._id}`}
                        className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-[#E91E63] hover:text-white transition-colors flex items-center justify-center"
                        title="View Product"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </Link>
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E91E63] text-white text-xs font-bold hover:bg-[#C2185B] transition-colors shadow-sm"
                        title="Move to Cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
