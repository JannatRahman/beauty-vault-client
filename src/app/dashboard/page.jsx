'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Heart, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import DashboardStatCard from './DashboardStatCard';
import { useStore } from '@/providers/StoreProvider';
import { useSession } from '@/lib/auth-client';

export default function DashboardPage() {
  const { cart, wishlist } = useStore();
  const { data: session } = useSession();
  
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!session?.user?.id) {
        setLoadingProducts(false);
        return;
      }
      try {
        const res = await fetch(`/api/products?createdBy=${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setTotalProducts(data.length);
        }
      } catch (error) {
        console.error('Error fetching user products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    fetchUserProducts();
  }, [session]);

  const stats = [
    {
      title: 'Total Products Added',
      value: loadingProducts ? '...' : totalProducts.toString(),
      icon: Package,
      colorClass: 'bg-[#E91E63]',
      trend: { isUp: true, value: totalProducts > 0 ? 100 : 0 }
    },
    {
      title: 'My Cart Items',
      value: cart.length.toString(),
      icon: ShoppingBag,
      colorClass: 'bg-purple-500',
      trend: { isUp: cart.length > 0, value: cart.length > 0 ? 12 : 0 }
    },
    {
      title: 'Wishlist Items',
      value: wishlist.length.toString(),
      icon: Heart,
      colorClass: 'bg-rose-500',
      trend: { isUp: wishlist.length > 0, value: wishlist.length > 0 ? 25 : 0 }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <DashboardStatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-[#1F2937] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/dashboard/add-product"
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#FFF9FB] to-white border border-[#F8BBD0]/50 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E91E63]/10 flex items-center justify-center text-[#E91E63]">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-[#1F2937]">Add New Product</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E91E63] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/products"
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#FFF9FB] to-white border border-[#F8BBD0]/50 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E91E63]/10 flex items-center justify-center text-[#E91E63]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-[#1F2937]">Continue Shopping</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E91E63] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Empty State / Placeholder for Recent Activity */}
        <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-2">No Recent Activity</h3>
          <p className="text-sm text-gray-500 max-w-[200px]">
            Start shopping or adding products to see your activity here.
          </p>
        </div>

      </div>
    </div>
  );
}
