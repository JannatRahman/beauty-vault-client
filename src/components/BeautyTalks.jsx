'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Eye, Heart, Star, Loader2, RefreshCw, SlidersHorizontal, UserCircle2 } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import { useSession } from '@/lib/auth-client';

export default function BeautyTalks() {
  const { data: session } = useSession();
  const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } = useStore();
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchRecommendations = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(false);
    try {
      // First, get user behavior
      const behaviorRes = await fetch('/api/user/behavior');
      const behaviorData = behaviorRes.ok ? await behaviorRes.json() : {};

      // Next, ask AI
      const aiRes = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart.map(c => c._id),
          wishlist: wishlist.map(w => w._id),
          recentlyViewed: behaviorData.recentlyViewed || [],
          favoriteBrands: behaviorData.viewedBrands || {},
          mostViewedCategories: behaviorData.viewedCategories || {}
        })
      });

      if (!aiRes.ok) {
        throw new Error('AI API Error');
      }

      const data = await aiRes.json();
      if (data.isFallback) setIsFallback(true);
      else setIsFallback(false);

      if (data.recommendations) {
        // Hydrate recommendations with full product data if possible or just use what AI gave
        // The AI gives productId, let's fetch full products if needed, but for now we'll use a fast /api/products fetch
        // Or we can just render the AI data
        const prodRes = await fetch('/api/products');
        const allProducts = prodRes.ok ? await prodRes.json() : [];
        
        const hydrated = data.recommendations.map(rec => {
          const fullProduct = allProducts.find(p => p._id === rec.productId) || {};
          return { ...fullProduct, ...rec };
        }).filter(p => p.price); // Filter out any that didn't match
        
        setRecommendations(hydrated);
      }
    } catch (err) {
      console.error('Failed to get recommendations', err);
      setError(true);
      
      // Fallback local fetch
      try {
        const prodRes = await fetch('/api/products');
        const allProducts = prodRes.ok ? await prodRes.json() : [];
        const sorted = allProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
        setRecommendations(sorted.map(p => ({ ...p, reason: "A community favorite.", confidence: 85 })));
        setIsFallback(true);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some((item) => item._id === (product.productId || product._id));
    if (isInWishlist) {
      removeFromWishlist(product.productId || product._id);
    } else {
      addToWishlist(product);
    }
  };

  if (!session?.user) {
    return (
      <section className="py-20 relative overflow-hidden" style={{ background: '#0F0E17' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(201,169,110,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.08))', border: '1px solid rgba(201,169,110,0.3)' }}>
            <Sparkles className="w-9 h-9 text-[#C9A96E]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Recommended For You
          </h2>
          <p className="text-white/40 max-w-md mx-auto font-light">
            Login to receive personalized AI beauty recommendations tailored to your unique preferences and shopping behavior.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 btn-gold py-3 px-8 rounded-full">
            <UserCircle2 className="w-5 h-5" /> Sign In
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: '#0F0E17' }}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(201,169,110,0.07) 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translate(50%, -50%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(194,24,91,0.07) 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translate(-50%, 50%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#C9A96E] font-bold text-xs tracking-widest uppercase mb-3 border border-[#C9A96E]/30 bg-[#C9A96E]/5 rounded-full px-4 py-2 w-fit">
              <Sparkles className="w-3.5 h-3.5" /> BeautyTalks AI
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Recommended For You
            </h2>
            {isFallback && !loading && (
              <p className="text-sm text-white/35 mt-2">
                Start exploring products to receive more personalized recommendations.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              className="btn-outline-gold text-sm px-4 py-2 flex items-center gap-2"
              onClick={fetchRecommendations}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 
              Refresh
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-outline-gold text-sm px-4 py-2 flex items-center gap-2 transition-colors ${showFilters ? 'text-[#C9A96E] border-[#C9A96E]/50' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {showFilters && !loading && recommendations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setFilterCategory('')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filterCategory === '' 
                  ? 'bg-[#E91E63] text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#F8BBD0]'
              }`}
            >
              All Categories
            </button>
            {[...new Set(recommendations.map(r => r.category).filter(Boolean))].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  filterCategory === cat 
                    ? 'bg-[#E91E63] text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#F8BBD0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl p-6 border border-white/5 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="w-full aspect-square rounded-2xl mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-4 rounded w-1/3 mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-6 rounded w-3/4 mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-16 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="flex justify-between items-center mt-4">
                  <div className="h-6 rounded w-1/4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="h-10 rounded-full w-20" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </div>
            ))}
            <div className="col-span-full text-center py-8 text-white/30 text-sm font-medium animate-pulse">
              Beauty AI is analyzing your preferences...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filterCategory ? recommendations.filter(r => r.category === filterCategory) : recommendations).map(product => {
              const isWishlisted = wishlist.some((item) => item._id === (product.productId || product._id));
              return (
                <motion.div 
                  key={product.productId || product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl p-5 border border-white/6 flex flex-col group hover:border-[#C9A96E]/25 transition-all card-hover"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50">
                    <img 
                      src={product.productImage || product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'} 
                      alt={product.productName || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'; }}
                    />
                    <div className="absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(201,169,110,0.9)', border: '1px solid rgba(201,169,110,0.5)' }}>
                      <Sparkles className="w-3 h-3 text-[#1A1825]" />
                      <span className="text-[10px] font-bold text-[#1A1825]">{product.confidence}% Match</span>
                    </div>
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
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{product.brand}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#C9A96E] text-[#C9A96E]" />
                        <span className="text-xs font-semibold text-white/60">{product.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-white text-lg mb-3 line-clamp-1">
                      {product.productName || product.name}
                    </h3>
                    
                    <div className="rounded-xl p-3 mb-4 flex-1" style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.12)' }}>
                      <p className="text-xs text-white/45 italic">&ldquo;{product.reason}&rdquo;</p>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/6">
                      <span className="font-extrabold text-white text-xl">${product.price}</span>
                      <div className="flex gap-2">
                        <Link 
                          href={`/products/${product.productId || product._id}`}
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#1A1825]"
                          style={{ background: 'rgba(201,169,110,0.1)' }}
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors hover:opacity-80"
                          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
