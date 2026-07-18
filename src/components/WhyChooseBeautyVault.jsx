'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe2, CreditCard, Truck } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: '100% Authentic',
    description: 'All our products are sourced directly from brands and authorized distributors.',
  },
  {
    icon: Globe2,
    title: 'Worldwide Brands',
    description: 'Access the most sought-after global beauty brands all in one destination.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Experience safe and seamless checkout with our encrypted payment gateways.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get your beauty essentials delivered to your doorstep swiftly and reliably.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function WhyChooseBeautyVault() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF9FB 0%, #FDE8F0 100%)' }}>
      {/* Decorative Blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#E91E63] opacity-5 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#C2185B] opacity-5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Why Choose <span className="gradient-text">BeautyVault</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] max-w-2xl mx-auto text-lg"
          >
            We are committed to providing you with an unparalleled premium beauty shopping experience.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <div className="glass rounded-3xl p-8 h-full text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E91E63]/10 to-[#C2185B]/10 flex items-center justify-center text-[#E91E63]">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 group-hover:text-[#E91E63] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed">
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