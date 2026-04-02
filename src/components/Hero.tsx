import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    /* Removed bg-[#faf9f6] to make it transparent */
    <section className="relative min-h-[90vh] flex items-center justify-center bg-transparent overflow-hidden px-6">
      
      {/* Removed the solid black/dark radial gradient div that was 
         blocking the shader background entirely.
      */}

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="animate-in fade-in slide-in-from-left duration-1000">
          <span className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase">Spring Collection 2026</span>
          <h1 className="text-7xl font-light leading-tight text-gray-900 mt-4 mb-6">
            Wear the <br /> 
            <span className="font-serif italic text-purple-600">Future</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-sm leading-relaxed">
            Sustainable, transparent, and designed for the modern silhouette. No compromises.
          </p>
          <div className="flex gap-4">
            <Link href="/shirts">
              <button className="bg-black text-white px-10 py-4 rounded-full font-medium shadow-xl hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2">
                <ShoppingBag size={18} /> Shop Now
              </button>
            </Link>
            <Link href="/store">
              <button className="bg-white/50 backdrop-blur-md text-black border border-gray-200 px-10 py-4 rounded-full font-medium hover:bg-white transition-all">
                View Lookbook
              </button>
            </Link>
          </div>
        </div>
        

        {/* Floating Product Image with Glass Effect */}
        <div className="relative flex justify-center items-center">
           {/* The "Antigravity" Orb - Kept this as it is transparent and adds to the vibe */}
           <div className="absolute w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
           
           {/* Product Card */}
           <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 bg-white/20 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-2xl z-0" />
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
                alt="Model in streetwear"
                className="relative z-10 w-[400px] h-[550px] object-cover rounded-[1.5rem] shadow-2xl transition-transform duration-1000 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-8 left-8 z-20 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white">
                <p className="text-xs uppercase tracking-widest opacity-70">Oversized Hoodie</p>
                <p className="text-xl font-semibold">$89.00</p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}