'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, User, LogOut, LayoutDashboard, Package, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/utils/supabase/client';


const ADMIN_EMAIL = 'your-admin@gmail.com';

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  const syncSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    setIsAdmin(currentUser?.email === ADMIN_EMAIL);
  }, [supabase]);

  useEffect(() => {
    syncSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    });

    const handleFocus = () => { if (document.visibilityState === 'visible') syncSession(); };
    window.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', syncSession);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', syncSession);
    };
  }, [syncSession, supabase]);

  useEffect(() => { syncSession(); }, [pathname, syncSession]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/store';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none text-black">
      <nav className="pointer-events-auto w-full max-w-6xl bg-white/70 backdrop-blur-2xl border border-white/40 shadow-xl rounded-full px-8 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/">
          <div className="text-2xl font-serif italic tracking-tighter text-black cursor-pointer hover:opacity-70 transition-opacity">
            vibe.
          </div>
        </Link>

        {/* Center Nav - SHIRTS & PANTS ARE BACK */}
        <ul className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
          <li><Link href="/store" className="hover:text-black transition-colors text-black">Shop All</Link></li>
          <li><Link href="/shirts" className="hover:text-black transition-colors">Shirts</Link></li>
          <li><Link href="/pants" className="hover:text-black transition-colors">Pants</Link></li>
        </ul>

        {/* Right Side Icons */}
        <div className="flex items-center gap-5">
          <button className="text-gray-400 hover:text-black transition-colors">
            <Search size={18} />
          </button>
          
          {/* ORDERS ICON */}
          <Link href="/orders" className="text-gray-400 hover:text-black transition-colors" title="My Orders">
            <Package size={18} />
          </Link>

          {/* ADDRESSES ICON */}
          <Link href="/addresses" className="text-gray-400 hover:text-black transition-colors" title="My Addresses">
            <MapPin size={18} />
          </Link>

          {/* CART ICON */}
          <Link href="/cart" className="relative group">
            <ShoppingBag size={18} className="text-gray-400 group-hover:text-black transition-all" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="h-4 w-[1px] bg-gray-200 mx-1" />

          {/* DYNAMIC AUTH SECTION */}
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link href="/admin" className="text-blue-600 hover:scale-110 transition-transform" title="Admin">
                  <LayoutDashboard size={18} />
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-black text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2">
                <User size={14} />
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}