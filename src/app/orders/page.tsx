'use client';

import React, { useEffect, useState } from 'react';
import VibePage from '@/components/VibePage';
import { createClient } from '@/utils/supabase/client';
import { Package, Calendar, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (data) setOrders(data);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [supabase]);

  return (
    <VibePage>
      <div className="max-w-4xl mx-auto mb-20 px-4">
        {/* Page Header */}
        <div className="flex items-baseline gap-4 mb-12">
          <h1 className="text-6xl font-serif italic tracking-tighter text-black">Orders</h1>
          <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
            History
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-black uppercase tracking-widest animate-pulse">Loading History...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State Box */
          <div className="bg-white p-20 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-center">
            <Package className="mx-auto mb-6 text-gray-200" size={48} />
            <p className="text-gray-500 font-medium mb-8">No orders found yet.</p>
            <Link href="/store">
              <button className="bg-black text-white px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-gray-800 transition-all">
                Shop Collection
              </button>
            </Link>
          </div>
        ) : (
          /* Orders List Box */
          <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="p-8 hover:bg-gray-50/50 transition-all group">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Calendar size={12} />
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <h3 className="text-xl font-bold text-black">Order #{order.id.slice(0, 8)}</h3>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-black tracking-tighter text-black">
                        ${Number(order.total_amount || 0).toFixed(2)}
                      </p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {order.status || 'Processing'}
                      </span>
                    </div>
                  </div>

                  {/* Preview of items in order */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex -space-x-4">
                      {order.order_items?.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="w-12 h-16 rounded-lg border-2 border-white overflow-hidden shadow-sm bg-gray-100">
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.order_items?.length > 3 && (
                        <div className="w-12 h-16 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                          +{order.order_items.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <Link href={`/orders/${order.id}`}>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                        View Details <ChevronRight size={14} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VibePage>
  );
}