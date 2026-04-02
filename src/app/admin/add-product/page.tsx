'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'shirts',
    image_url: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('products')
      .insert([
        { 
          name: formData.name, 
          price: Number(formData.price), 
          category: formData.category, 
          image_url: formData.image_url,
          description: formData.description 
        }
      ]);

    if (!error) {
      alert("Product added successfully!");
      router.push('/admin/products');
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-serif mb-8">New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
          <input 
            type="text" required 
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Price ($)</label>
            <input 
              type="number" required 
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
            <select 
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all cursor-pointer"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="shirts">Shirts</option>
              <option value="pants">Pants</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Image URL</label>
          <input 
            type="text" required 
            placeholder="https://..."
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
          />
        </div>

        <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
          Publish Product
        </button>
      </form>
    </div>
  );
}