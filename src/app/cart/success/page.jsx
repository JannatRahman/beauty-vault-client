'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import { motion } from 'framer-motion';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useStore();
  
  const [status, setStatus] = useState('processing'); // processing, success, error

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const completeOrder = async () => {
      try {
        const res = await fetch('/api/checkout-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        });

        if (res.ok) {
          setStatus('success');
          clearCart();
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    completeOrder();
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass max-w-lg w-full rounded-[2.5rem] p-10 text-center border border-[#F8BBD0]/40 shadow-xl bg-white/80"
      >
        {status === 'processing' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-16 h-16 text-[#E91E63] animate-spin" />
            <h1 className="text-2xl font-bold text-gray-800">Processing Payment...</h1>
            <p className="text-gray-500">Please wait while we confirm your order.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold text-gray-900">Payment Successful!</h1>
              <p className="text-gray-500 text-sm">
                Thank you for your purchase. Your order has been confirmed and the items are yours!
              </p>
            </div>

            <div className="pt-6 w-full flex flex-col gap-3">
              <Link 
                href="/products"
                className="w-full btn-primary py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 font-bold bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white"
              >
                <ShoppingBag className="w-5 h-5" /> Continue Shopping
              </Link>
              
              <Link 
                href="/dashboard/cart"
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <ArrowLeft className="w-5 h-5" /> Back to My Cart
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Something went wrong</h1>
            <p className="text-gray-500 text-sm">We couldn't verify your payment. Please contact support.</p>
            <Link 
              href="/dashboard/cart"
              className="mt-4 px-6 py-3 rounded-xl bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Return to Cart
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
