'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { Banknote, ChevronRight, Loader2, MapPin, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  // We pull EVERYTHING from context to ensure we catch the right variables
  const cartContext: any = useCart();
  
  // Logic to find your items and total regardless of naming
  const items = cartContext?.cartItems || cartContext?.cart || [];
  const total = cartContext?.subtotal || cartContext?.cartTotal || cartContext?.total || 0;
  const clearCart = cartContext?.clearCart || (() => {});

  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getAddress() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
        setAddress(data);
      }
      setCheckingSession(false);
    }
    getAddress();
  }, [supabase]);

  const placeOrder = async () => {
    if (!address) {
      alert("Please save a shipping address first!");
      router.push('/addresses');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to place an order.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      items: items, // Using the synced 'items' variable
      total_amount: total, // Using the synced 'total' variable
      status: 'Processing',
      payment_method: 'COD',
      shipping_address: address
    });

    if (!error) {
      clearCart();
      router.push('/orders');
    } else {
      alert("Order failed. Check console.");
      setLoading(false);
    }
  };

  if (checkingSession) return <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-black">
      <Header />
      <main className="max-w-6xl mx-auto px-6 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="space-y-8">
            <h1 className="text-4xl font-serif italic tracking-tighter">Finalize Order</h1>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={20} className="text-gray-400" />
                <h2 className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Shipping To</h2>
              </div>
              
              {address ? (
                <div className="space-y-1 text-sm font-medium">
                  <p className="text-lg font-bold">{address.full_name}</p>
                  <p className="text-gray-500">{address.address_line}</p>
                  <p className="text-gray-500">{address.city}</p>
                  <p className="text-gray-500">{address.phone}</p>
                </div>
              ) : (
                <button onClick={() => router.push('/addresses')} className="text-blue-600 text-xs font-bold underline italic">Add Shipping Address +</button>
              )}
            </div>

            <div className="bg-black text-white p-8 rounded-[2.5rem] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Banknote size={24} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Payment</p>
                  <p className="text-sm font-bold">Cash on Delivery</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-50">
            <h2 className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-8">Your Items</h2>
            
            <div className="space-y-6 mb-10">
              {items.length > 0 ? (
                items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold">{item.name} <span className="text-gray-300 ml-1">x{item.quantity || 1}</span></span>
                    </div>
                    <span className="font-black">${item.price * (item.quantity || 1)}</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center py-4 text-gray-300">
                   <ShoppingBag size={24} />
                   <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">Bag is empty</p>
                </div>
              )}
              
              <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                <span className="text-2xl font-serif italic">Total Amount</span>
                <span className="text-4xl font-black tracking-tighter">${total}</span>
              </div>
            </div>

            <button 
              onClick={placeOrder}
              disabled={loading || items.length === 0}
              className="w-full bg-black text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:bg-gray-100"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>Complete Order <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}