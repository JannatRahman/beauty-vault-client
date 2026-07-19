'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe2, CreditCard, Truck } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: '100% Authentic',
    description: 'All our products are sourced directly from brands and authorized distributors.',
    iconBg: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: '#34D399',
  },
  {
    icon: Globe2,
    title: 'Worldwide Brands',
    description: 'Access the most sought-after global beauty brands all in one destination.',
    iconBg: 'from-[#C9A96E]/20 to-[#B8935A]/10',
    iconColor: '#C9A96E',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Experience safe and seamless checkout with our encrypted payment gateways.',
    iconBg: 'from-blue-400/20 to-blue-500/10',
    iconColor: '#60A5FA',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get your beauty essentials delivered to your doorstep swiftly and reliably.',
    iconBg: 'from-violet-400/20 to-violet-500/10',
    iconColor: '#A78BFA',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.13 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
};

export default function WhyChooseBeautyVault() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: '#0F0E17' }}>
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.15), transparent)' }}
        />
        <div
          className="absolute -top-60 right-0 w-[500px] h-[500px] rounded-full opacity-60"
          style={{ background: 'radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute -bottom-60 left-0 w-[500px] h-[500px] rounded-full opacity-60"
          style={{ background: 'radial-gradient(ellipse, rgba(194,24,91,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-18">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-[#C9A96E]/30 text-[#C9A96E] text-xs font-semibold
              px-5 py-2 rounded-full bg-[#C9A96E]/5 tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse-soft" />
            Why BeautyVault
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-white"
          >
            The Beauty Standard{' '}
            <span className="animate-gold-shimmer">Redefined</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/45 max-w-2xl mx-auto text-lg font-light"
          >
            We are committed to providing you with an unparalleled premium beauty shopping experience.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <div
                  className="relative rounded-3xl p-8 h-full text-center group hover:-translate-y-2 transition-all duration-300 cursor-default border border-white/5 hover:border-[#C9A96E]/20"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Top glow line */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${feature.iconColor}, transparent)` }}
                  />

                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.iconBg} group-hover:scale-110 transition-transform duration-300 border border-white/5`}>
                    <Icon className="w-7 h-7" style={{ color: feature.iconColor }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#C9A96E] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed text-sm font-light">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}