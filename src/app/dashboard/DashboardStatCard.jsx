'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardStatCard({ title, value, icon: Icon, trend, colorClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-3xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300"
    >
      {/* Background Decor */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${colorClass}`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[#1F2937]">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-semibold ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isUp ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} bg-opacity-10 text-[#E91E63]`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}