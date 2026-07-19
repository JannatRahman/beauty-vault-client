'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { useStore } from '@/providers/StoreProvider';
import { Package, Image as ImageIcon, Tag, AlignLeft, Sparkles, Loader2, DollarSign, Star, Boxes, Ruler, Info } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    brandName: '',
    category: '',
    productImage: '',
    price: '',
    rating: '',
    stock: '',
    size: '',
    description: '',
    usage: '',
    ingredients: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!session?.user?.id) {
      setError('You must be logged in to add a product.');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        rating: parseFloat(formData.rating) || 0,
        stock: parseInt(formData.stock) || 0,
        createdBy: session.user.id
      };

      const res = await fetch('/api/upload-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to add product');
      }

      showToast('Product added successfully!', 'success');
      router.push('/dashboard/my-products');
    } catch (err) {
      console.error(err);
      setError('An error occurred while adding the product.');
      showToast('Failed to add product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-extrabold text-[#1F2937]">Add New Product</h1>
        <p className="text-gray-500 mt-2">Enrich the beauty vault with new exciting cosmetics and skincare items.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-medium text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info Section */}
        <div className="glass rounded-[2rem] p-8 shadow-sm border border-[#F8BBD0]/30 space-y-6">
          <h2 className="text-lg font-bold text-[#1F2937] border-b border-gray-100 pb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#E91E63]" /> Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Product Name *</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all"
                  placeholder="e.g. Luminous Silk Foundation"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Brand Name *</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="brandName"
                  required
                  value={formData.brandName}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-3 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all"
                  placeholder="e.g. Giorgio Armani"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Tag className="w-4.5 h-4.5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all"
                  placeholder="e.g. Skincare, Makeup"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Image URL *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <ImageIcon className="w-4.5 h-4.5 text-gray-400" />
                </div>
                <input 
                  type="url" 
                  name="productImage"
                  required
                  value={formData.productImage}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="glass rounded-[2rem] p-8 shadow-sm border border-[#F8BBD0]/30 space-y-6">
          <h2 className="text-lg font-bold text-[#1F2937] border-b border-gray-100 pb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#E91E63]" /> Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Price ($) *</label>
              <input 
                type="number" 
                name="price"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63]"
                placeholder="45.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Rating (1-5)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Star className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="number" 
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63]"
                  placeholder="4.8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Stock Status *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Boxes className="w-4 h-4 text-gray-400" />
                </div>
                <select 
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63] appearance-none"
                >
                  <option value="" disabled>Select</option>
                  <option value="100">In Stock</option>
                  <option value="0">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Size/Weight</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63]"
                  placeholder="50ml"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="glass rounded-[2rem] p-8 shadow-sm border border-[#F8BBD0]/30 space-y-6">
          <h2 className="text-lg font-bold text-[#1F2937] border-b border-gray-100 pb-4 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-[#E91E63]" /> Description & Highlights
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Product Description *</label>
              <textarea 
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all resize-none"
                placeholder="Detailed description of the product..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Suggested Usage</label>
                <textarea 
                  name="usage"
                  rows={3}
                  value={formData.usage}
                  onChange={handleChange}
                  className="w-full p-4 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63] resize-none"
                  placeholder="How to use this product..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  Product Highlights <Sparkles className="w-3.5 h-3.5 text-[#E91E63]" />
                </label>
                <textarea 
                  name="ingredients"
                  rows={3}
                  value={formData.ingredients}
                  onChange={handleChange}
                  className="w-full p-4 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63] resize-none"
                  placeholder="Key ingredients or highlights..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-4 px-10 rounded-2xl shadow-lg flex items-center gap-2 font-bold bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Adding to Vault...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" /> Publish Product
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}