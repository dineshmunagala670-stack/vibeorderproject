'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import VibePage from '@/components/VibePage';
import { Save, X, Search, Eye, Trash2, Edit3, ChevronDown } from 'lucide-react';

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Shirts', // Default to one of your main pages
    image_url: '',
    description: '',
    sizes: 'S, M, L, XL',
    gallery_urls: ''
  });

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  const handleSave = async () => {
    // Ensure category is exactly what the Shirts/Pants pages expect
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      category: formData.category, 
      image_url: formData.image_url,
      description: formData.description,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      gallery_images: formData.gallery_urls.split(',').map(u => u.trim()).filter(Boolean)
    };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
    } else {
      await supabase.from('products').insert([payload]);
    }

    resetForm();
    fetchProducts();
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: p.price.toString(),
      category: p.category || 'Shirts',
      image_url: p.image_url,
      description: p.description || '',
      sizes: p.sizes?.join(', ') || 'S, M, L, XL',
      gallery_urls: p.gallery_images?.join(', ') || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: 'Shirts', image_url: '', description: '', sizes: 'S, M, L, XL', gallery_urls: '' });
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <VibePage>
      <div className="max-w-7xl mx-auto px-6 py-10 pb-32">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <h1 className="text-6xl font-serif italic tracking-tighter uppercase">Inventory</h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black tracking-widest outline-none shadow-sm focus:border-black transition-all" 
              placeholder="SEARCH CATALOG..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FORM */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input className="v-input" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input className="v-input" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                
                {/* CATEGORY DROPDOWN - This fixes your page filtering */}
                <div className="relative">
                  <select 
                    className="v-input appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Shirts">Shirts</option>
                    <option value="Pants">Pants</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>

                <input className="v-input" placeholder="Main Image URL" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
              </div>

              <div className="space-y-6">
                <input className="v-input" placeholder="Sizes (S, M, L...)" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} />
                <textarea className="v-input h-24" placeholder="Gallery Links (comma separated)" value={formData.gallery_urls} onChange={e => setFormData({...formData, gallery_urls: e.target.value})} />
                <textarea className="v-input h-24 italic" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <button onClick={handleSave} className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] mt-8 hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
                <Save size={16}/> {editingId ? 'Update Product' : 'Save to Vault'}
              </button>
            </div>

            {/* LIST */}
            <div className="space-y-4">
              {filtered.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-[2rem] border border-gray-50 flex items-center gap-6 group hover:shadow-xl transition-all">
                  <img src={p.image_url} className="w-16 h-20 rounded-xl object-cover bg-gray-50" />
                  <div className="flex-1">
                    <h3 className="font-bold">{p.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.category} — ${p.price}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => startEdit(p)} className="p-4 bg-black text-white rounded-xl"><Edit3 size={16}/></button>
                    <button onClick={async () => { if(confirm('Delete?')) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }} className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PREVIEW */}
          <div className="lg:col-span-4">
            <div className="sticky top-10 p-6 bg-white rounded-[3rem] shadow-2xl border border-gray-100">
              <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 mb-6 shadow-inner">
                <img src={formData.image_url || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">{formData.category}</p>
              <h3 className="text-2xl font-bold">{formData.name || 'Product Preview'}</h3>
              <p className="text-2xl font-black mt-4">${formData.price || '0'}</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`.v-input { width: 100%; background: #f9f9f9; border-radius: 1.25rem; padding: 1.25rem; outline: none; font-size: 14px; font-weight: 700; border: 2px solid transparent; transition: all 0.2s; } .v-input:focus { border-color: #000; background: #fff; }`}</style>
    </VibePage>
  );
}