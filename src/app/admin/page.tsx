'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Package, DollarSign, ShoppingCart, Users, 
  TrendingUp, Plus, List 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const chartData = [
    { name: 'Mon', revenue: 4000, orders: 24 },
    { name: 'Tue', revenue: 3000, orders: 13 },
    { name: 'Wed', revenue: 9800, orders: 98 },
    { name: 'Thu', revenue: 3908, orders: 39 },
    { name: 'Fri', revenue: 4800, orders: 48 },
    { name: 'Sat', revenue: 3800, orders: 38 },
    { name: 'Sun', revenue: 4300, orders: 43 },
  ];

  useEffect(() => {
    async function fetchAdminData() {
      const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { data: orders } = await supabase.from('orders').select('total_amount');
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const totalRevenue = orders?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

      setStats({
        products: prodCount || 0,
        orders: orders?.length || 0,
        revenue: totalRevenue,
        customers: userCount || 0
      });
      setLoading(false);
    }
    fetchAdminData();
  }, [supabase]);

  return (
    <div className="w-full">
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-20">
        {/* RIGHT ALIGNED HEADER SECTION */}
        <div className="flex flex-col items-end mb-16 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">System Overview</p>
          <h1 className="text-6xl font-serif italic tracking-tighter text-black mb-6">Command Center</h1>
          
          <div className="flex gap-3">
            <Link href="/admin/inventory">
              <button className="bg-white border border-gray-200 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:border-black transition-all">
                <List size={14} /> Inventory
              </button>
            </Link>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Revenue', val: `$${stats.revenue}`, icon: DollarSign, col: 'text-green-600' },
            { label: 'Orders', val: stats.orders, icon: ShoppingCart, col: 'text-blue-600' },
            { label: 'Products', val: stats.products, icon: Package, col: 'text-purple-600' },
            { label: 'Customers', val: stats.customers, icon: Users, col: 'text-orange-600' }
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
              <s.icon className={`${s.col} mb-4`} size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
              <h3 className="text-3xl font-black mt-1 tracking-tighter">{s.val}</h3>
            </div>
          ))}
        </div>

        {/* GRAPHS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 text-gray-400">Revenue Flow</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={4} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 text-gray-400">Order Volume</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Bar dataKey="orders" fill="#000" radius={[10, 10, 10, 10]} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '20px'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}