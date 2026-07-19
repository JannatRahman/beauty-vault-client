'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, Eye, Component } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 8;

const fallbackImages = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
  'https://images.unsplash.com/photo-1512496015851-a1cbf39db79a',
  'https://images.unsplash.com/photo-1617897903246-719242758050',
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
  'https://images.unsplash.com/photo-1571781926291-c477eb31f822',
  'https://images.unsplash.com/photo-1580870059800-410a56209bb4',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
  'https://images.unsplash.com/photo-1599305090598-fe179d501227',
];

const getFallbackImage = (brandName, index) => {
  const hash = brandName ? brandName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : index;
  const img = fallbackImages[hash % fallbackImages.length];
  return `${img}?auto=format&fit=crop&q=80&w=200&h=200`;
};

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/brands');
        if (!res.ok) throw new Error('Failed to fetch brands');
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Unable to load brands at this time.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredBrands = brands.filter((brand) =>
    (brand.brandName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBrands.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBrands = filteredBrands.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FFF9FB]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header / Banner */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-purple-600 to-[#E91E63] p-10 md:p-14 text-white shadow-[0_20px_50px_rgba(233,30,99,0.15)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-pink-100">
              Curated Brands
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Discover Top Beauty Brands
            </h1>
            <p className="text-pink-100/90 text-sm md:text-base font-medium">
              Explore our wide range of premium makeup and skincare collections from the world's best beauty houses.
            </p>
          </div>
          <div className="relative z-10 shrink-0 hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full blur-2xl absolute inset-0"></div>
            <Component className="w-24 h-24 text-white/80 relative z-10" />
          </div>
        </div>

        {/* Search */}
        <div className="glass rounded-[2rem] p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm border border-[#F8BBD0]/30">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-white border border-[#F8BBD0]/40 rounded-2xl text-[#1F2937] placeholder-gray-400 focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all shadow-sm"
              placeholder="Search for a brand..."
            />
          </div>
          <div className="text-sm font-semibold text-gray-500">
            Showing {filteredBrands.length} Brands
          </div>
        </div>

        {/* Loading & Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <Loader2 className="w-8 h-8 text-[#E91E63] animate-spin" />
            <p className="text-gray-500 font-medium text-sm">Loading premium brands...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-[2rem] p-8 text-center text-red-500 font-medium max-w-lg mx-auto border border-red-100 bg-red-50/50">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            {error}
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="glass rounded-[2rem] p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[300px]">
            <Component className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">No Brands Found</h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search to find the brand you're looking for.
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedBrands.map((brand, idx) => {
                  const fallbackSrc = getFallbackImage(brand.brandName, idx);
                  return (
                  <motion.div
                    key={brand.brandName || idx}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="glass rounded-3xl p-5 flex flex-col h-full card-hover bg-white border border-[#F8BBD0]/30 hover:border-[#F8BBD0] group text-center"
                  >
                    <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full border-4 border-[#FFF9FB] shadow-sm mb-4 overflow-hidden relative group-hover:shadow-md transition-shadow flex items-center justify-center">
                      <img 
                        src={brand.brandLogo || fallbackSrc} 
                        alt={brand.brandName} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        onError={(e) => { e.target.onerror = null; e.target.src = fallbackSrc; }}
                      />
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
                  </motion.div>
                )})}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
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
  );
}
