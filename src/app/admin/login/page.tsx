'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      // Hard redirect to break the loop and sync cookies
      window.location.href = '/admin';
    } else {
      setError("Session could not be initialized.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Internal Access</p>
          <h1 className="text-4xl font-serif italic tracking-tighter text-black">vibe.admin</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-none text-sm focus:ring-2 focus:ring-black transition-all outline-none text-black"
                placeholder="admin@vibe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="password" 
                required
                className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-none text-sm focus:ring-2 focus:ring-black transition-all outline-none text-black"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl disabled:bg-gray-200"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Enter Terminal <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}