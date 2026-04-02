'use client';

import React, { useState } from 'react';
import VibePage from '@/components/VibePage';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      alert("Check your email for the confirmation link!");
      router.push('/login');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <VibePage>
      <div className="max-w-[450px] mx-auto mb-20 px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-serif italic tracking-tighter text-black uppercase">Join Us</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 italic">
            Become part of the aesthetic
          </p>
        </div>

        {/* The Sign Up Box */}
        <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.12)] border border-gray-100 p-10 relative z-30">
          
          {/* Google Sign Up Button */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-gray-100 text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 mb-8 active:scale-95 shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Join with Google
          </button>

          {/* Separator */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest">
              <span className="bg-white px-4 text-gray-300">Or use email</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Full Name Input */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  required 
                  placeholder="Vibe Member"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 text-black placeholder:text-gray-300 focus:bg-white focus:border-black outline-none transition-all shadow-inner"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  required 
                  placeholder="vibe@example.com"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 text-black placeholder:text-gray-300 focus:bg-white focus:border-black outline-none transition-all shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 text-black placeholder:text-gray-300 focus:bg-white focus:border-black outline-none transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.5em] hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-10 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Already a member? 
              <Link href="/login" className="text-black ml-2 hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </VibePage>
  );
}