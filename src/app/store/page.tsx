'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import VibePage from '@/components/VibePage';
import Link from 'next/link';

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Shop All');
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  // Make sure these match the categories you type in your Inventory Admin
  const categories = ['Shop All', 'Shirts', 'Pants', 'Hoodies'];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      // We fetch everything first to ensure the connection is live
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Supabase Error:", error.message);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Filter Logic: Case-insensitive and trimmed to prevent "Pants " vs "Pants" bugs
  const filteredProducts = activeCategory === 'Shop All' 
    ? products 
    : products.filter(p => 
        p.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
      );

  return (
    <VibePage>
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* TOP NAVIGATION TABS */}
        <div className="flex justify-center gap-10 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[11px] font-black uppercase tracking-[0.5em] transition-all relative pb-2 ${
                activeCategory === cat ? 'text-black' : 'text-gray-300 hover:text-gray-400'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black animate-in fade-in slide-in-from-left-2" />
              )}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center py-40">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* GRID VIEW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} className="group">
                  {/* Image Container - Using the 3:4 Aspect Ratio from your reference */}
                  <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 mb-6 relative border border-gray-50 shadow-sm">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="px-4 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">
                      {product.category || 'Collection'}
                    </p>
                    <h3 className="text-2xl font-serif italic tracking-tighter text-black mb-1">
                      {product.name}
                    </h3>
                    <p className="font-black text-lg tracking-tighter text-black">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* EMPTY STATE */}
            {filteredProducts.length === 0 && (
              <div className="py-40 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 italic">
                  No items found in {activeCategory}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </VibePage>
  );
}