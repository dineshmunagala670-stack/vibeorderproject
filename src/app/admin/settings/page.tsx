'use client';

import { useState } from 'react';
import { Settings, Shield, Bell, Globe, Save, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500); // Mock save
  };

  return (
    <div className="w-full bg-[#faf9f6] min-h-screen text-black">
      <main className="max-w-4xl mx-auto px-8 pt-16 pb-20">
        
        <div className="flex flex-col items-end mb-12 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Configurations</p>
          <h1 className="text-6xl font-serif italic tracking-tighter">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* General Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
              <Globe size={18} /> Store Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Store Name</label>
                <input className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black" defaultValue="Vibe Store" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Support Email</label>
                <input className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black" defaultValue="support@vibe.com" />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
              <Shield size={18} /> Admin Security
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-sm">Two-Factor Authentication</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Add an extra layer of security</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">
                Update Admin Password
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Save All Changes</>}
          </button>
        </div>
      </main>
    </div>
  );
}