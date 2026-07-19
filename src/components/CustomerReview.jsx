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
    <section className="py-28 relative overflow-hidden" style={{ background: '#FAFAF9' }}>
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }}
        />
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(ellipse, #F5EDD8 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #FAE8F0 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left: Heading */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-7 border border-[#C9A96E]/40 text-[#B8935A] bg-[#C9A96E]/6 tracking-widest uppercase">
                <Star className="w-3.5 h-3.5 fill-current" />
                Trusted by 50,000+ Customers
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6 text-[#1A1825]">
                Real{' '}
                <span className="gradient-text-rose">Stories</span>
                {' '}from<br />Real Customers
              </h2>
              <p className="text-lg text-[#1A1825]/50 mb-12 max-w-md font-light leading-relaxed">
                Don&apos;t just take our word for it. See what our community has to say about their BeautyVault experience.
              </p>

              {/* Custom Controls */}
              <div className="flex gap-3">
                <button
                  onClick={prevReview}
                  className="w-12 h-12 rounded-full border border-[#1A1825]/15 flex items-center justify-center text-[#1A1825]/50 hover:bg-[#1A1825] hover:text-white hover:border-[#1A1825] transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextReview}
                  className="w-12 h-12 rounded-full border border-[#1A1825]/15 flex items-center justify-center text-[#1A1825]/50 hover:bg-[#1A1825] hover:text-white hover:border-[#1A1825] transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right: Review Card */}
          <div className="relative">
            {/* Decorative quote mark background */}
            <div
              className="absolute -top-8 -right-8 font-display text-[200px] leading-none text-[#C9A96E]/6 pointer-events-none select-none font-bold"
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <div
              className="relative z-10 rounded-[2.5rem] p-10 md:p-12"
              style={{
                background: 'rgba(26,24,37,0.04)',
                border: '1px solid rgba(201,169,110,0.15)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-7">
                    {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#C9A96E] text-[#C9A96E]" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-xl md:text-2xl text-[#1A1825] leading-relaxed font-medium mb-10 italic">
                    &ldquo;{reviews[currentIndex].content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full overflow-hidden relative ring-2 ring-[#C9A96E]/30"
                    >
                      <Image
                        src={reviews[currentIndex].avatar}
                        alt={reviews[currentIndex].name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A1825] text-base">{reviews[currentIndex].name}</h4>
                      <p className="text-sm text-[#C9A96E] font-medium">{reviews[currentIndex].role}</p>
                    </div>
                    <div className="ml-auto">
                      <Quote className="w-8 h-8 text-[#C9A96E]/20" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex gap-2 mt-8">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-400 ${
                      idx === currentIndex
                        ? 'w-8 bg-[#C9A96E]'
                        : 'w-2 bg-[#1A1825]/15 hover:bg-[#C9A96E]/40'
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