'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with session persistence off to avoid the "Refresh Token" error
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
}

export default function ProductGrid({ category }: { category: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        // DEBUG: This will show in your browser console (F12)
        console.log(`Searching Supabase for category: ${category}`);

        const { data, error } = await supabase
          .from('products') // Ensure your table is named 'products' in Supabase
          .select('*')
          // This ilike filter makes it ignore Capital Letters (e.g., 'Shirts' vs 'shirts')
          .ilike('category', category); 

        if (error) {
          console.error("Supabase Error:", error.message);
        } else {
          console.log(`Found ${data?.length || 0} items for ${category}`);
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Unexpected Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-100 aspect-[3/4] rounded-2xl mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (products.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-gray-200 rounded-3xl bg-white/50">
        <p className="text-gray-400 font-serif italic text-lg">
          No {category} found in the collection.
        </p>
        <p className="text-xs text-gray-300 mt-2 uppercase tracking-widest">
          Check Supabase Table "category" column
        </p>
      </div>
    );
  }

  // 3. Product Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {products.map((product) => (
        <div key={product.id} className="group flex flex-col cursor-pointer">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#f3f3f1]">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <button className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white py-3 rounded-xl text-sm font-medium shadow-xl">
              Add to Bag
            </button>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
            <p className="text-sm font-bold text-gray-900">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}