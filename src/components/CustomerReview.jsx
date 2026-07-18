'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Beauty Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'BeautyVault is absolutely amazing! The shipping was incredibly fast, and the products were packaged beautifully. I loved finding all my favorite brands in one place.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Emily Chen',
    role: 'Makeup Artist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    content: 'As a professional, I need authentic products quickly. BeautyVault never disappoints. Their collection of high-end brands is unmatched, and customer service is stellar.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Jessica Taylor',
    role: 'Skincare Lover',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    content: 'I was hesitant to buy luxury skincare online, but BeautyVault guarantees authenticity. Everything I ordered was perfect. This is my new go-to beauty store!',
    rating: 5,
  },
];

export default function CustomerReview() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextReview = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Heading */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF9FB] text-[#E91E63] text-sm font-semibold mb-6 border border-[#F8BBD0]">
                <Star className="w-4 h-4 fill-current" />
                Trusted by 50,000+ Customers
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6 text-[#1F2937]">
                Real <span className="gradient-text">Stories</span> from<br/>Real Customers
              </h2>
              <p className="text-lg text-[#6B7280] mb-10 max-w-md">
                Don&apos;t just take our word for it. See what our community has to say about their BeautyVault experience.
              </p>
              
              {/* Custom Controls */}
              <div className="flex gap-4">
                <button 
                  onClick={prevReview}
                  className="w-12 h-12 rounded-full border-2 border-[#F8BBD0] flex items-center justify-center text-[#E91E63] hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63] transition-all duration-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextReview}
                  className="w-12 h-12 rounded-full border-2 border-[#F8BBD0] flex items-center justify-center text-[#E91E63] hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63] transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right: Slider */}
          <div className="relative">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[400px] max-h-[400px] bg-[#FFF9FB] rounded-full blur-[80px]" />
            
            <div className="relative z-10 glass rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(233,30,99,0.08)]">
              <Quote className="absolute top-8 right-8 w-16 h-16 text-[#F8BBD0] opacity-30" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FBBF24] text-[#FBBF24]" />
                    ))}
                  </div>
                  
                  <p className="text-xl md:text-2xl text-[#1F2937] leading-relaxed font-medium mb-10">
                    &quot;{reviews[currentIndex].content}&quot;
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden relative">
                      <Image
                        src={reviews[currentIndex].avatar}
                        alt={reviews[currentIndex].name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F2937]">{reviews[currentIndex].name}</h4>
                      <p className="text-sm text-[#E91E63] font-medium">{reviews[currentIndex].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="absolute bottom-8 right-8 flex gap-2">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'bg-[#E91E63] w-6' : 'bg-[#F8BBD0]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}