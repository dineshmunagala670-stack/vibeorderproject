'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';
import Header from '@/components/header';
import Hero from '@/components/Hero';
import Link from 'next/link';

// Load Shader only on client to avoid WebGL errors
const ShaderBackground = dynamic(() => import('@/components/ShaderBackground'), {
  ssr: false,
});

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    async function getFeatured() {
      const { data } = await supabase.from('products').select('*').limit(4);
      if (data) setFeaturedProducts(data);
    }
    getFeatured();
  }, [supabase]);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen selection:bg-purple-100">
      {/* 1. Shader Layer */}
      <ShaderBackground />

      {/* 2. Texture Layer */}
      <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <Header />
      
      <main className="relative z-10 bg-transparent">
        <div className="pt-24"> 
          <Hero />
        </div>

        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="flex justify-between items-end mb-16 px-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Curated</p>
              <h2 className="text-5xl font-serif italic tracking-tighter text-black">The Essentials</h2>
            </div>
            <Link href="/store" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-40 transition-all">
              Discover All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group">
                <div className="glass-card relative aspect-[4/5] overflow-hidden rounded-[3.5rem]">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-2xl">
                      View Piece
                    </span>
                  </div>
                </div>
                
                <div className="mt-8 px-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-gray-900">{product.name}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1.5">{product.category}</p>
                  </div>
                  <p className="text-base font-black tracking-tighter text-black">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}