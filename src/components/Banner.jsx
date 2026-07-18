'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Star, ShoppingBag, ChevronDown } from 'lucide-react';

// ─── Floating Badge ───────────────────────────────────────────────
function FloatingBadge({ text, icon: Icon, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200 }}
      className={`absolute glass rounded-2xl px-3.5 py-2.5 shadow-[0_8px_32px_rgba(233,30,99,0.15)]
        flex items-center gap-2 whitespace-nowrap ${className}`}
    >
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#C2185B] flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <span className="text-xs font-semibold text-[#1F2937]">{text}</span>
    </motion.div>
  );
}

// ─── Floating Product Image ───────────────────────────────────────
function FloatingProduct({ src, alt, className, animClass, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute rounded-3xl overflow-hidden shadow-2xl ${animClass} ${className}`}
      style={{ boxShadow: '0 20px 60px rgba(233, 30, 99, 0.18), 0 4px 20px rgba(0,0,0,0.08)' }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 160px, 240px"
        priority
      />
    </motion.div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────
export default function Banner() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Staggered text animation variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFF9FB 0%, #FDE8F0 40%, #FFF9FB 100%)' }}
    >

      {/* ── Background Decorative Blobs ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        {/* Large blob top-right */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-30 animate-blob"
          style={{ background: 'radial-gradient(circle, #F8BBD0 0%, #E91E6310 70%)' }}
        />
        {/* Medium blob bottom-left */}
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-20 animate-blob"
          style={{
            background: 'radial-gradient(circle, #C2185B 0%, #E91E6305 70%)',
            animationDelay: '3s',
          }}
        />
        {/* Subtle center glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #E91E63 0%, transparent 70%)' }}
        />
        {/* Sparkle dots */}
        {[
          { top: '15%', left: '8%', size: 6 },
          { top: '70%', left: '5%', size: 4 },
          { top: '25%', right: '10%', size: 5 },
          { top: '80%', right: '15%', size: 7 },
          { top: '50%', left: '18%', size: 3 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#E91E63]"
            style={{ top: dot.top, left: dot.left, right: dot.right, width: dot.size, height: dot.size, opacity: 0.4 }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </motion.div>

      {/* ── Main Content Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left: Text Content ── */}
          <motion.div
            style={{ y: textY }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#E91E63]/10 text-[#E91E63] text-xs font-semibold
                px-4 py-2 rounded-full border border-[#E91E63]/20">
                <Sparkles className="w-3.5 h-3.5 animate-pulse-soft" />
                Premium Beauty Marketplace
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              Discover{' '}
              <span className="relative inline-block">
                <span className="gradient-text">Beauty</span>
                {/* Underline decoration */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full origin-left"
                  style={{ background: 'linear-gradient(90deg, #E91E63, #F8BBD0)' }}
                />
              </span>
              <br />
              Without{' '}
              <span className="text-[#E91E63]">Limits</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-[#4B5563] text-lg sm:text-xl leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Shop your favorite{' '}
              <span className="text-[#E91E63] font-medium">makeup</span>,{' '}
              <span className="text-[#E91E63] font-medium">skincare</span> and beauty essentials
              from the world&apos;s top brands — all in one place.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-10"
            >
              <Link href="/products" className="btn-primary text-base w-full sm:w-auto justify-center">
                <ShoppingBag className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/brands" className="btn-outline text-base w-full sm:w-auto justify-center">
                <Sparkles className="w-4 h-4" />
                Explore Brands
              </Link>
            </motion.div>

            {/* Social Proof Stats */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8"
            >
              {[
                { value: '200+', label: 'Brands' },
                { value: '10K+', label: 'Products' },
                { value: '50K+', label: 'Happy Customers' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display font-bold text-2xl text-[#E91E63]">{stat.value}</p>
                  <p className="text-xs text-[#6B7280] font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Star rating row */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-2 mt-5"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#E91E63] text-[#E91E63]" />
                ))}
              </div>
              <span className="text-sm text-[#4B5563]">
                <span className="font-semibold text-[#1F2937]">4.9</span> from 12,000+ reviews
              </span>
            </motion.div>
          </motion.div>

          {/* ── Right: Image Collage ── */}
          <div className="relative hidden lg:block">
            {/* Main hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-square max-w-xl mx-auto"
            >
              {/* Outer glow ring */}
              <div
                className="absolute inset-[-12px] rounded-full opacity-20 animate-spin-slow"
                style={{
                  background: 'conic-gradient(from 0deg, #E91E63, #F8BBD0, #C2185B, #E91E63)',
                  filter: 'blur(20px)',
                }}
              />

              {/* Primary image card */}
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(233,30,99,0.25)] animate-float-slow">
                <Image
                  src="/hero-beauty.jpg"
                  alt="Luxury beauty products flat lay"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 50vw, 560px"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(135deg, rgba(233,30,99,0.05) 0%, rgba(255,255,255,0.1) 100%)'
                }} />
              </div>

              {/* ── Floating Badges ── */}
              <FloatingBadge
                text="New Arrivals ✨"
                icon={Sparkles}
                className="top-6 -left-8 animate-float"
                delay={0.9}
              />
              <FloatingBadge
                text="Free Shipping"
                icon={ShoppingBag}
                className="-bottom-4 -left-6 animate-float-reverse"
                delay={1.1}
              />
              <FloatingBadge
                text="Top Rated ⭐"
                icon={Star}
                className="top-16 -right-10 animate-float"
                delay={1.0}
              />

              {/* ── Brand Logos Row (Glassmorphism pill) ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 glass rounded-2xl px-6 py-3
                  shadow-[0_8px_32px_rgba(233,30,99,0.15)] whitespace-nowrap"
              >
                <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-widest mb-1.5 text-center">
                  Trusted Brands
                </p>
                <div className="flex items-center gap-3">
                  {['Dior', 'Fenty', 'MAC', 'NARS', 'NYX'].map((brand) => (
                    <span key={brand} className="text-[11px] font-bold text-[#C2185B] opacity-80">
                      {brand}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── Mobile: Hero image shown below text ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="lg:hidden absolute bottom-0 left-0 right-0 h-48 overflow-hidden"
        style={{ maskImage: 'linear-gradient(to top, black 60%, transparent 100%)' }}
      >
        <Image
          src="/hero-beauty.jpg"
          alt="Luxury beauty products"
          fill
          className="object-cover object-top opacity-30"
          sizes="100vw"
        />
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#E91E63]/60"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

    </section>
  );
}