'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';

export default function ProductDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Gallery state
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotify, setAddedNotify] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/single-product/${id}`);
        if (!res.ok) throw new Error('Product not found in database');
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.productImage || data.image || '');
      } catch (err) {
        console.error('Error loading product details:', err);
        setError('Could not retrieve product information.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF9FB]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#E91E63] animate-spin" />
          <p className="text-gray-500 font-medium text-sm">Opening the beauty vault...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 bg-[#FFF9FB] flex items-center justify-center">
        <div className="glass rounded-[2rem] p-8 text-center max-w-md w-full border border-red-100 space-y-6 shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">Oops! Something went wrong</h2>
          <p className="text-gray-500 text-sm">{error || 'This product does not exist in our catalog.'}</p>
          <Link href="/products" className="btn-primary w-full justify-center py-3">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Use actual product images for gallery
  const extraImages = [
    product.productImage || product.image
  ].filter(Boolean);

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FFF9FB]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb & Back button */}
        <div className="flex items-center justify-between">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#E91E63] transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" /> Back to Products
          </Link>
          
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">
            Catalog &gt; {product.category || 'Beauty'} &gt; {product.brandName || product.brand || 'Item'}
          </span>
        </div>

        {/* Core Product Information Card */}
        <div className="glass rounded-[2.5rem] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 shadow-sm border border-[#F8BBD0]/30">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#FFF9FB] border border-[#F8BBD0]/20 shadow-inner group">
              <img 
                src={selectedImage || product.productImage || product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600&h=600'} 
                alt={product.productName || product.title || product.name} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              {product.category && (
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#E91E63] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                  {product.category}
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-3 overflow-x-auto py-1">
              {extraImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === imgUrl 
                      ? 'border-[#E91E63] scale-95 shadow-sm' 
                      : 'border-transparent hover:border-[#F8BBD0]/60'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info / Purchase Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#E91E63]/10 text-[#E91E63] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#F8BBD0]/30">
                  {product.brandName || product.brand || 'BeautyVault Exclusive'}
                </span>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  {product.availability || product.stock || 'In Stock'}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#1F2937] leading-tight">
                {product.productName || product.title || product.name}
              </h1>

              {/* Rating Section */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4.5) 
                          ? 'fill-[#FBBF24] text-[#FBBF24]' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="text-sm font-bold text-gray-700 ml-1.5">{product.rating || '4.5'}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Size: {product.size || '50ml / 1.7 oz'}
                </span>
              </div>

              {/* Pricing */}
              <div className="pt-2">
                <p className="text-3xl font-extrabold text-[#E91E63]">
                  ${product.price}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">VAT included. Shipping calculated at checkout.</p>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description || 'Pamper yourself with this exquisite formula. Restores luminosity, protects skin architecture, and leaves a premium satin touch finish.'}
                </p>
              </div>
            </div>

            {/* Interactive Add Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              
              {addedNotify && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-xs font-bold animate-pulse-soft">
                  <Check className="w-4 h-4" /> Added to your shopping cart!
                </div>
              )}

              <div className="flex gap-4">
                {/* Quantity picker */}
                <div className="flex items-center border border-gray-200 rounded-2xl bg-white p-1">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-gray-500 hover:text-black transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-gray-500 hover:text-black transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 font-bold bg-gradient-to-r from-[#E91E63] to-[#C2185B]"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>

                {/* Wishlist button */}
                <button
                  onClick={handleToggleWishlist}
                  className={`w-14 rounded-2xl border transition-all flex items-center justify-center ${
                    isWishlisted 
                      ? 'bg-[#E91E63] text-white border-transparent shadow-md' 
                      : 'border-gray-200 text-gray-500 hover:text-[#E91E63] hover:border-[#E91E63] bg-white'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-5 h-5 text-[#E91E63]" />
                <span className="text-[10px] font-bold text-gray-600">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-[#E91E63]" />
                <span className="text-[10px] font-bold text-gray-600">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RotateCcw className="w-5 h-5 text-[#E91E63]" />
                <span className="text-[10px] font-bold text-gray-600">Easy Returns</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Product Highlights, Ingredients, etc. */}
        <div className="glass rounded-[2rem] p-6 md:p-10 space-y-6">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E91E63]" /> Product Highlights & Ingredients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Suggested Usage</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                {product.suggestedUsage || product.usage || 'Apply a pea-sized amount onto freshly cleansed skin every morning and evening. Blend outwards in light upward strokes until fully absorbed. Suitable for base styling or daily glow routines.'}
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Ingredients</h3>
              <p className="text-gray-600 text-xs leading-relaxed italic">
                {product.highlight || product.ingredients || 'Water, Dimethicone, Butylene Glycol, Glycerin, Rosa Damascena Flower Water, Sodium Hyaluronate, Caprylyl Glycol, Phenoxyethanol, Fragrance.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
