'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const brands = [
  { name: 'Maybelline', id: 'maybelline', logo: 'https://images.unsplash.com/photo-1617220556209-6615b3c3c72b?auto=format&fit=crop&w=150&q=80' },
  { name: 'Rare Beauty', id: 'rare-beauty', logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=150&q=80' },
  { name: 'Huda Beauty', id: 'huda-beauty', logo: 'https://images.unsplash.com/photo-1512496015851-a1c8e47894f4?auto=format&fit=crop&w=150&q=80' },
  { name: 'Fenty Beauty', id: 'fenty-beauty', logo: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=150&q=80' },
  { name: 'Charlotte Tilbury', id: 'charlotte-tilbury', logo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=150&q=80' },
  { name: 'e.l.f.', id: 'elf', logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80' },
  { name: 'MAC', id: 'mac', logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=150&q=80' },
  { name: 'Beauty of Joseon', id: 'beauty-of-joseon', logo: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=150&q=80' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function FeaturedBrands() {
  return (
    <section className="py-20 bg-[#FFF9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Featured <span className="gradient-text">Brands</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] max-w-2xl mx-auto"
          >
            Discover our curated collection of the world&apos;s most loved beauty brands.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {brands.map((brand) => (
            <motion.div key={brand.id} variants={itemVariants}>
              <Link href={`/brands/${brand.id}`} className="block group">
                <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(233,30,99,0.15)] group-hover:border-[#F8BBD0]">
                  <div className="w-20 h-20 relative rounded-full overflow-hidden bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      sizes="80px"
                    />
                  </div>
                  <h3 className="font-semibold text-center text-[#1F2937] group-hover:text-[#E91E63] transition-colors">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}