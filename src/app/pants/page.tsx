'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import VibePage from '@/components/VibePage';
import Link from 'next/link';

export default function PantsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPants() {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');

      if (!error && data) {
        const onlyPants = data.filter(p => 
          p.category?.trim().toLowerCase() === 'pants'
        );
        setProducts(onlyPants);
      }
      setLoading(false);
    }
    fetchPants();
  }, []);

  return (
    <VibePage>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif italic tracking-tighter uppercase text-black">Pants</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2 italic">Lower Body Architecture</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-black rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {products.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} className="group">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 mb-6 border border-gray-50 shadow-sm">
                  <img 
                    src={p.image_url} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                </div>
                <div className="px-4 text-center">
                  <h3 className="text-2xl font-serif italic tracking-tighter text-black">{p.name}</h3>
                  <p className="font-black text-lg tracking-tighter text-black">${Number(p.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-300 uppercase text-[10px] tracking-widest py-20 italic">
            The pants vault is currently empty.
          </p>
        )}
      </div>
    </VibePage>
  );
}