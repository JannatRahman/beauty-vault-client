'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Star, ShoppingBag, ChevronDown } from 'lucide-react';

// ─── Floating Badge (dark glass style) ──────────────────────
function FloatingBadge({ text, icon: Icon, iconBg, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200 }}
      className={`absolute bg-white/[0.07] backdrop-blur-xl rounded-2xl px-3.5 py-2.5
        shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/[0.1]
        flex items-center gap-2 whitespace-nowrap ${className}`}
    >
      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${iconBg || 'bg-[#C9A96E]'}`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <span className="text-xs font-semibold text-white/90">{text}</span>
    </motion.div>
  );
}

// ─── Hero Section ────────────────────────────────────────────
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
      style={{ background: 'linear-gradient(135deg, #0F0D1B 0%, #1A1625 40%, #0F0D1B 100%)' }}
    >

      {/* ── Background Decorative Elements ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        {/* Warm gold glow — top right */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }}
        />
        {/* Subtle rose glow — bottom left */}
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #E91E63 0%, transparent 70%)' }}
        />
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Sparkle dots — neutral white */}
        {[
          { top: '15%', left: '8%', size: 4 },
          { top: '70%', left: '5%', size: 3 },
          { top: '25%', right: '10%', size: 4 },
          { top: '80%', right: '15%', size: 5 },
          { top: '50%', left: '18%', size: 3 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ top: dot.top, left: dot.left, right: dot.right, width: dot.size, height: dot.size, opacity: 0.15 }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.15, 0.4, 0.15] }}
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
              <span className="inline-flex items-center gap-1.5 bg-white/[0.07] text-[#C9A96E] text-xs font-semibold
                px-4 py-2 rounded-full border border-white/[0.1] backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 animate-pulse-soft" />
                Premium Beauty Marketplace
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 text-white"
            >
              Discover{' '}
              <span className="relative inline-block">
                <span
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF, #C9A96E)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >Beauty</span>
                {/* Underline decoration */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full origin-left"
                  style={{ background: 'linear-gradient(90deg, #C9A96E, #E91E63)' }}
                />
              </span>
              <br />
              Without{' '}
              <span className="text-[#C9A96E]">Limits</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-[#9CA3AF] text-lg sm:text-xl leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Shop your favorite{' '}
              <span className="text-white/90 font-medium">makeup</span>,{' '}
              <span className="text-white/90 font-medium">skincare</span> and beauty essentials
              from the world&apos;s top brands — all in one place.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-10"
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 bg-white text-[#0F0D1B] font-semibold text-base
                  px-7 py-3.5 rounded-full hover:bg-[#C9A96E] hover:text-white transition-all duration-300
                  shadow-[0_4px_24px_rgba(255,255,255,0.12)] hover:shadow-[0_8px_30px_rgba(201,169,110,0.35)]
                  w-full sm:w-auto justify-center"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/brands"
                className="inline-flex items-center gap-2 text-white/80 font-semibold text-base
                  px-7 py-3.5 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40
                  transition-all duration-300 w-full sm:w-auto justify-center"
              >
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
                  <p className="font-display font-bold text-2xl text-white">{stat.value}</p>
                  <p className="text-xs text-[#9CA3AF] font-medium">{stat.label}</p>
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
                  <Star key={i} className="w-4 h-4 fill-[#C9A96E] text-[#C9A96E]" />
                ))}
              </div>
              <span className="text-sm text-[#9CA3AF]">
                <span className="font-semibold text-white">4.9</span> from 12,000+ reviews
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
              {/* Subtle glow behind image */}
              <div
                className="absolute inset-[-20px] rounded-full opacity-[0.15]"
                style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }}
              />

              {/* Primary image card */}
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] animate-float-slow">
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
                  background: 'linear-gradient(135deg, rgba(15,13,27,0.15) 0%, rgba(201,169,110,0.08) 100%)'
                }} />
              </div>

              {/* ── Floating Badges ── */}
              <FloatingBadge
                text="New Arrivals ✨"
                icon={Sparkles}
                iconBg="bg-[#C9A96E]"
                className="top-6 -left-8 animate-float"
                delay={0.9}
              />
              <FloatingBadge
                text="Free Shipping"
                icon={ShoppingBag}
                iconBg="bg-white/20"
                className="-bottom-4 -left-6 animate-float-reverse"
                delay={1.1}
              />
              <FloatingBadge
                text="Top Rated ⭐"
                icon={Star}
                iconBg="bg-white/20"
                className="top-16 -right-10 animate-float"
                delay={1.0}
              />

              {/* ── Brand Logos Row ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/[0.07] backdrop-blur-xl rounded-2xl px-6 py-3
                  shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/[0.1] whitespace-nowrap"
              >
                <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-widest mb-1.5 text-center">
                  Trusted Brands
                </p>
                <div className="flex items-center gap-3">
                  {['Dior', 'Fenty', 'MAC', 'NARS', 'NYX'].map((brand) => (
                    <span key={brand} className="text-[11px] font-bold text-[#C9A96E] opacity-80">
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
          className="object-cover object-top opacity-20"
          sizes="100vw"
        />
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
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