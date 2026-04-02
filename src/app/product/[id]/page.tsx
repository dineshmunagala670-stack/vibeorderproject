'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';
import VibePage from '@/components/VibePage';
import { ArrowLeft, ShoppingBag, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const { addToCart } = useCart() as any;
  const supabase = createClient();

  useEffect(() => {
    async function getProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) {
        setProduct(data);
        setActiveImage(data.image_url);
      }
    }
    getProduct();
  }, [id]);

  if (!product) return <div className="min-h-screen bg-white" />;

  const allImages = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);

  return (
    <VibePage>
      {/* Container constrained to prevent full-screen stretching */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        
        <Link href="/store" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black mb-10 transition-all">
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Main Grid: Set to items-start so it doesn't stretch vertically */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          
          {/* LEFT: GALLERY TRACK */}
          <div className="flex gap-4 w-full lg:w-auto shrink-0">
            <div className="flex flex-col gap-3 w-16 shrink-0">
               {allImages.map((img, idx) => (
                 <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-black' : 'border-transparent opacity-50'}`}
                 >
                   <img src={img} className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>

            {/* MAIN IMAGE: Constrained height and width */}
            <div className="relative w-full lg:w-[500px] max-h-[650px] aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest z-10">
                Seasonal Drop
              </div>
              <img 
                src={activeImage} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* RIGHT: CONTENT PANEL */}
          <div className="flex-1 max-w-sm py-4 space-y-10">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Premium Basics</p>
              <h1 className="text-5xl font-serif italic tracking-tighter text-black leading-none">{product.name}</h1>
              <p className="text-3xl font-black tracking-tighter text-black">${Number(product.price).toFixed(2)}</p>
            </div>

            {/* SIZE SELECTOR */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">Select Size</span>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes?.map((s: string) => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSize(s)} 
                    className={`py-3 rounded-xl font-black text-[10px] transition-all border-2 ${selectedSize === s ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-transparent'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-gray-500 text-[13px] leading-relaxed italic font-medium">
                {product.description || "Detailed craftsmanship meets aesthetic purity. Designed for a modern silhouette."}
              </p>
            </div>

            {/* BUTTON */}
            <button 
              onClick={() => addToCart({ ...product, quantity: 1, size: selectedSize })}
              className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.5em] hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95"
            >
              Add to Bag — <ShoppingBag size={18} />
            </button>
          </div>

        </div>
      </div>
    </VibePage>
  );
}