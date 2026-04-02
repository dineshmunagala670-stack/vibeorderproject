'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Search, 
  Loader2, 
  UserCircle2,
  Calendar
} from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    // Fetch profiles which contain the shipping/name data
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    
    if (profiles) setCustomers(profiles);
    setLoading(false);
  }

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#faf9f6] min-h-screen text-black">
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-20">
        
        {/* Right Aligned Header */}
        <div className="flex flex-col items-end mb-12 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Community</p>
          <h1 className="text-6xl font-serif italic tracking-tighter mb-6">Customer Base</h1>
        </div>

        {/* Search Toolbar */}
        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text"
            placeholder="Search by name or location..."
            className="w-full pl-16 pr-12 py-5 bg-white rounded-3xl border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-40 flex justify-center">
            <Loader2 className="animate-spin text-gray-200" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCustomers.map((customer) => (
              <div key={customer.user_id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-white transition-colors">
                    <UserCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{customer.full_name || 'Anonymous'}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-gray-50 pt-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-300" />
                    <span>{customer.city || 'No Location Set'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-300" />
                    <span>{customer.phone || 'No Phone Set'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 mt-4">
                    <Calendar size={14} />
                    <span>Joined: {new Date(customer.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <button className="w-full mt-8 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">
                  View Order History
                </button>
              </div>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-serif italic text-xl">No customers match your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}