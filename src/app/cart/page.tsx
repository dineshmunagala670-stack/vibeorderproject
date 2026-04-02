'use client';

import React, { useEffect, useState } from 'react';
import VibePage from '@/components/VibePage';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const context = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Prevent Server-Side Rendering (SSR) crashes
  if (!mounted || !context) {
    return (
      <VibePage>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-400 font-black uppercase tracking-widest animate-pulse">
            Loading Bag...
          </p>
        </div>
      </VibePage>
    );
  }

  /** * 2. SAFE DESTRUCTURING 
   * We pull these out individually with fallbacks so TypeScript 
   * and the Browser don't see "undefined".
   */
  const cartItems = context.cartItems || [];
  const removeFromCart = context.removeFromCart || (() => {});
  const updateQuantity = (context as any).updateQuantity || (() => {});

  // 3. MANUAL TOTAL CALCULATION (Bypasses any Context errors)
  const manualTotal = cartItems.reduce((acc: number, item: any) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + (price * qty);
  }, 0);

  return (
    <VibePage>
      <div className="max-w-4xl mx-auto mb-20 px-4">
        {/* Header Section */}
        <div className="flex items-baseline gap-4 mb-12">
          <h1 className="text-6xl font-serif italic tracking-tighter text-black">Bag</h1>
          <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
            {cartItems.length} Items
          </span>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State - Solid White Box */
          <div className="bg-white p-20 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-center">
            <ShoppingBag className="mx-auto mb-6 text-gray-200" size={48} />
            <p className="text-gray-500 font-medium mb-8">Your bag is empty.</p>
            <Link href="/store">
              <button className="bg-black text-white px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-gray-800 transition-all">
                Explore Shop
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Items List - Solid White Box */}
            <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="p-8 flex items-center gap-8 hover:bg-gray-50/50 transition-colors">
                    <div className="w-24 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                        {item.category}
                      </p>
                      
                      <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center border border-gray-100 rounded-full px-4 py-2 gap-5 bg-gray-50">
                          <button 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} 
                            className="text-gray-400 hover:text-black transition-colors"
                          >
                            <Minus size={14}/>
                          </button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} 
                            className="text-gray-400 hover:text-black transition-colors"
                          >
                            <Plus size={14}/>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-black tracking-tighter text-black">
                        ${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary Box - Solid White Box */}
            <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Total Amount</p>
                  <p className="text-sm text-gray-400 mt-1">Shipping calculated at checkout</p>
                </div>
                <span className="text-5xl font-black tracking-tighter text-black">
                  ${manualTotal.toFixed(2)}
                </span>
              </div>
              <Link href="/checkout" className="block w-full">
                <button className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
                  Checkout <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </VibePage>
  );
}