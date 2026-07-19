'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Loader2,
  X
} from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const { cart, wishlist, addToCart, addToWishlist, removeFromWishlist } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products from backend');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Unable to load products. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Reset to page 1 when search/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrand, selectedCategory, sortOption]);

  // Derived filter/search options list
  const brands = ['All', ...new Set(products.map(p => p.brandName || p.brand).filter(Boolean))];
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filtered and Searched list
  const filteredProducts = products.filter((product) => {
    const productName = (product.productName || product.title || product.name || '').toLowerCase();
    const brandName = (product.brandName || product.brand || '').toLowerCase();
    const matchesSearch = productName.includes(searchTerm.toLowerCase()) || brandName.includes(searchTerm.toLowerCase());
    
    const matchesBrand = selectedBrand === 'All' || (product.brandName || product.brand) === selectedBrand;
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  // Sorted list
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') {
      return Number(a.price) - Number(b.price);
    }
    if (sortOption === 'price-desc') {
      return Number(b.price) - Number(a.price);
    }
    if (sortOption === 'rating') {
      return Number(b.rating || 4.5) - Number(a.rating || 4.5);
    }
    // 'latest'
    return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
  });

  // Paginated list
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        
        {/* Banner Area */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-[#E91E63] to-[#C2185B] p-10 md:p-14 text-white shadow-[0_20px_50px_rgba(233,30,99,0.15)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-pink-100">
              Curated Collection
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Flawless Beauty, <br />Just for You
            </h1>
            <p className="text-pink-100/90 text-sm md:text-base font-medium">
              Explore professional cosmetics, skin-nurturing solutions, and luxurious fragrances carefully chosen to highlight your natural glow.
            </p>
          </div>
        </div>

        {/* Search, Filter, Sort Controls */}
        <div className="glass rounded-[2rem] p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-white border border-[#F8BBD0]/40 rounded-2xl text-[#1F2937] placeholder-gray-400 focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all shadow-sm"
              placeholder="Search by name, brand..."
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline">Sort</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-[#F8BBD0]/40 px-4 py-3 rounded-2xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#E91E63] transition-all shadow-sm"
              >
                <option value="latest">Latest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 bg-[#E91E63]/10 text-[#E91E63] px-4 py-3 rounded-2xl text-sm font-bold border border-[#F8BBD0]/50"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
              Filters
            </button>
          </div>
        </div>

        {/* Main Grid: Filters + Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block glass rounded-[2rem] p-6 space-y-8 sticky top-28 border border-[#F8BBD0]/30">
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider border-b border-gray-100 pb-2">
                Categories
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#E91E63] text-white font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-[#E91E63]/5 hover:text-[#E91E63]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider border-b border-gray-100 pb-2">
                Brands
              </h3>
              <div className="flex flex-col gap-2">
                {brands.map((br) => (
                  <button
                    key={br}
                    onClick={() => setSelectedBrand(br)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedBrand === br
                        ? 'bg-[#E91E63] text-white font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-[#E91E63]/5 hover:text-[#E91E63]'
                    }`}
                  >
                    {br}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Listing Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-8 h-8 text-[#E91E63] animate-spin" />
                <p className="text-gray-500 font-medium text-sm">Gathering the vault's items...</p>
              </div>
            ) : error ? (
              <div className="glass rounded-[2rem] p-8 text-center text-red-500 font-medium max-w-lg mx-auto border border-red-100 bg-red-50/50">
                {error}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="glass rounded-[2rem] p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[300px]">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">No Products Found</h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your search terms or filters to locate items in the inventory.
                </p>
              </div>
            ) : (
              <>
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product) => {
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
                                src={product.productImage || product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300&h=300'} 
                                alt={product.productName || product.title || product.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300&h=300';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#F8BBD0]">
                                <ShoppingBag size={48} />
                              </div>
                            )}

                            {/* Wishlist toggle overlay */}
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

                            {/* Category Tag */}
                            {product.category && (
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                                <span className="text-[10px] font-semibold text-[#E91E63] uppercase tracking-wider">
                                  {product.category}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Info section */}
                          <div className="flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                {product.brandName || product.brand || 'BeautyVault'}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                                <span className="text-xs font-semibold text-gray-700">{product.rating || '4.5'}</span>
                              </div>
                            </div>

                            <Link href={`/products/${product._id}`} className="mb-2 hover:text-[#E91E63] transition-colors">
                              <h3 className="font-bold text-[#1F2937] line-clamp-2 leading-tight text-sm md:text-base">
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="p-2 border border-[#F8BBD0]/40 rounded-xl bg-white hover:bg-[#FFF9FB] text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold border transition-all ${
                          currentPage === i + 1
                            ? 'bg-[#E91E63] border-transparent text-white shadow-sm'
                            : 'bg-white border-[#F8BBD0]/40 text-gray-600 hover:border-[#E91E63] hover:text-[#E91E63]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="p-2 border border-[#F8BBD0]/40 rounded-xl bg-white hover:bg-[#FFF9FB] text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filter Sidebar Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white z-50 p-6 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-[#1F2937]">Filters</h2>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {/* Categories */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowMobileFilters(false);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          selectedCategory === cat
                            ? 'bg-[#E91E63] border-transparent text-white'
                            : 'bg-white border-[#F8BBD0]/40 text-gray-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Brands</h3>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((br) => (
                      <button
                        key={br}
                        onClick={() => {
                          setSelectedBrand(br);
                          setShowMobileFilters(false);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          selectedBrand === br
                            ? 'bg-[#E91E63] border-transparent text-white'
                            : 'bg-white border-[#F8BBD0]/40 text-gray-600'
                        }`}
                      >
                        {br}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}