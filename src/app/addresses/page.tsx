'use client';

import React, { useEffect, useState } from 'react';
import VibePage from '@/components/VibePage';
import { createClient } from '@/utils/supabase/client';
import { MapPin, Trash2, Home, Briefcase, Loader2, Phone } from 'lucide-react';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line: '',
    city: '',
    postal_code: '',
    type: 'Home'
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setAddresses(data);
    }
    setLoading(false);
  }

  const handleManualSave = async () => {
    if (!formData.full_name || !formData.address_line || !formData.phone) {
      alert("Full Name, Phone, and Address are required.");
      return;
    }

    setIsActionLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Session expired. Please log in.");
      setIsActionLoading(false);
      return;
    }

    const { error } = await supabase.from('addresses').insert([{ 
      ...formData, 
      user_id: user.id 
    }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setFormData({ full_name: '', phone: '', address_line: '', city: '', postal_code: '', type: 'Home' });
      setActiveTab('list');
      await fetchAddresses();
    }
    setIsActionLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    setIsActionLoading(true);
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      await fetchAddresses();
    }
    setIsActionLoading(false);
  };

  return (
    <VibePage>
      <div className="max-w-4xl mx-auto mb-20 px-4">
        <div className="flex items-baseline gap-4 mb-12">
          <h1 className="text-6xl font-serif italic tracking-tighter text-black uppercase">Location</h1>
          <span className="text-sm font-black text-gray-500 uppercase tracking-widest italic">Management</span>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden relative z-30">
          
          <div className="flex border-b border-gray-100 bg-gray-50/30">
            <button onClick={() => setActiveTab('list')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'list' ? 'text-black bg-white' : 'text-gray-300'}`}>Saved Places</button>
            <button onClick={() => setActiveTab('add')} className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'add' ? 'text-black bg-white' : 'text-gray-300'}`}>+ Add New</button>
          </div>

          <div className="p-10">
            {activeTab === 'list' ? (
              <div className="space-y-4">
                {loading ? (
                   <div className="py-20 text-center animate-pulse text-gray-300 font-black uppercase text-[10px]">Syncing...</div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-20">
                    <MapPin className="mx-auto mb-6 text-gray-100" size={60} />
                    <p className="text-gray-400 font-medium italic">Address book is empty.</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="p-8 rounded-[2.5rem] border border-gray-100 bg-white flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                      <div className="flex gap-6 items-center text-left">
                        <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center">
                          {addr.type === 'Work' ? <Briefcase size={22}/> : <Home size={22}/>}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-black leading-tight">{addr.full_name}</p>
                          <p className="text-sm text-gray-500 mt-1">{addr.address_line}, {addr.city}</p>
                          {addr.phone && <p className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1"><Phone size={10}/> {addr.phone}</p>}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(addr.id)} 
                        disabled={isActionLoading}
                        className="text-gray-300 hover:text-red-500 transition-colors p-3 bg-gray-50 rounded-full disabled:opacity-30"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-10 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black italic">Full Name</label>
                    <input className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] p-6 text-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" placeholder="John Doe" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black italic">Phone Number</label>
                    <input className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] p-6 text-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" placeholder="+1 234 567 890" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black italic">Street Address</label>
                    <input className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] p-6 text-black focus:bg-white focus:border-black outline-none transition-all shadow-inner" placeholder="101 Vibe Way" value={formData.address_line} onChange={(e) => setFormData({...formData, address_line: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black italic">Location Type</label>
                    <select className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] p-6 text-black outline-none appearance-none cursor-pointer focus:bg-white focus:border-black shadow-inner" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option value="Home">Home Residency</option>
                      <option value="Work">Office / Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black italic">City</label>
                    <input placeholder="City" className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] p-6 text-black outline-none focus:bg-white focus:border-black shadow-inner" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black italic">Postal Code</label>
                    <input placeholder="000000" className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] p-6 text-black outline-none focus:bg-white focus:border-black shadow-inner" value={formData.postal_code} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} />
                  </div>
                </div>

                <button onClick={handleManualSave} disabled={isActionLoading} className="w-full bg-black text-white py-8 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.5em] hover:bg-zinc-800 transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
                  {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : "Save New Address"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </VibePage>
  );
}