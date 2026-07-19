'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  ShoppingBag as CartIcon
} from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import { useSession } from '@/lib/auth-client';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, showToast } = useStore();
  const { data: session } = useSession();

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% sales tax
  const shipping = subtotal > 100 ? 0 : 15; // free shipping over $100
  const total = subtotal + tax + shipping;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-display font-bold text-[#1F2937] flex items-center gap-2">
          My Shopping <span className="text-[#E91E63]">Cart</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage the items you have saved in your cart.</p>
      </div>

      {cart.length === 0 ? (
        <div className="glass rounded-[2rem] p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-20 h-20 rounded-full bg-[#FFF9FB] border border-[#F8BBD0]/40 flex items-center justify-center mb-6 text-[#E91E63] shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
            Looks like you haven't added anything to your beauty vault yet.
          </p>
          <Link href="/products" className="btn-primary px-8 py-3.5 rounded-2xl flex items-center gap-2 font-bold shadow-md">
            Go Shopping <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-3xl p-4 flex flex-col sm:flex-row items-center gap-4 bg-white border border-[#F8BBD0]/30 hover:border-[#F8BBD0]/60 transition-all shadow-sm"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#FFF9FB] border border-gray-100 flex-shrink-0">
                    <img 
                      src={item.image || item.productImage || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=150&h=150'} 
                      alt={item.title || item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=150&h=150'; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#E91E63] uppercase tracking-wider">
                      {item.brandName || item.brand || 'BeautyVault'}
                    </span>
                    <Link href={`/products/${item._id}`} className="hover:text-[#E91E63] transition-colors block">
                      <h3 className="font-bold text-gray-800 truncate text-base">
                        {item.title || item.name}
                      </h3>
                    </Link>
                    <p className="text-sm font-extrabold text-[#E91E63]">${item.price}</p>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex sm:flex-col items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-white p-1">
                      <button 
                        onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center font-extrabold text-gray-500 hover:text-black transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center font-extrabold text-gray-500 hover:text-black transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-xl transition-colors hover:bg-red-50/50"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={clearCart}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest pl-2"
              >
                Clear Entire Cart
              </button>
              
              <Link href="/products" className="text-xs font-bold text-[#E91E63] hover:text-[#C2185B] transition-all uppercase tracking-widest flex items-center gap-1.5 hover:translate-x-0.5">
                Continue Shopping &rarr;
              </Link>
            </div>
          </div>

          {/* Checkout Summary Box */}
          <div className="glass rounded-[2rem] p-6 space-y-6 border border-[#F8BBD0]/30 shadow-md">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E91E63]" /> Order Summary
              </h2>
              <p className="text-xs text-gray-400 mt-1">Review fees, taxes, and shipping rates before checkouts.</p>
            </div>

            <div className="space-y-3.5 border-b border-gray-100 pb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Est. Sales Tax (8%)</span>
                <span className="font-semibold text-gray-800">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-gray-800">
                  {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-pink-500 font-semibold bg-pink-50 p-2 rounded-lg">
                  💡 Add ${(100 - subtotal).toFixed(2)} more for Free Shipping!
                </p>
              )}
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="text-base font-bold text-gray-800">Grand Total</span>
              <span className="text-2xl font-extrabold text-[#E91E63]">${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={async () => {
                try {
                  const res = await fetch('/api/checkout_sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart, email: session?.user?.email })
                  });
                  if (!res.ok) throw new Error('Checkout failed');
                  const { url } = await res.json();
                  window.location.href = url;
                } catch (err) {
                  console.error(err);
                  showToast('Error during checkout.', 'error');
                }
              }}
              className="w-full btn-primary py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 font-bold bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
