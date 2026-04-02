'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MoreVertical,
  Search,
  Loader2
} from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shipping_address?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#faf9f6] min-h-screen">
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-20">
        
        <div className="flex flex-col items-end mb-12 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Logistics</p>
          <h1 className="text-6xl font-serif italic tracking-tighter text-black mb-6">Order Registry</h1>
        </div>

        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            className="w-full pl-16 pr-12 py-5 bg-white rounded-3xl border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden text-black">
          {loading ? (
            <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-gray-200" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-8 py-6">Order ID</th>
                  <th className="px-8 py-6">Customer</th>
                  <th className="px-8 py-6">Items</th>
                  <th className="px-8 py-6">Total</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 font-mono text-[10px] text-gray-400">#{order.id.slice(0, 8)}</td>
                    <td className="px-8 py-6 font-bold text-sm">{order.shipping_address?.full_name}</td>
                    <td className="px-8 py-6 text-xs text-gray-500">{order.items?.length} items</td>
                    <td className="px-8 py-6 font-black text-sm">${order.total_amount}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <select 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-[10px] font-black uppercase tracking-widest bg-gray-50 border-none rounded-xl p-2 outline-none"
                        value={order.status}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}