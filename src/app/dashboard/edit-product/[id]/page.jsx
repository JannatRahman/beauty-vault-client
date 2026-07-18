'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Package, Image as ImageIcon, Tag, AlignLeft, Sparkles, Loader2, DollarSign, Star, Boxes, Ruler, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = use(params);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/single-product/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        
        // Ensure user is the creator
        if (session?.user?.id && data.createdBy && data.createdBy !== session.user.id) {
          setError('You are not authorized to edit this product.');
          setInitialLoading(false);
          return;
        }

        setFormData({
          title: data.title || data.name || '',
          brandName: data.brandName || data.brand || '',
          category: data.category || '',
          productImage: data.productImage || data.image || '',
          price: data.price || '',
          rating: data.rating || '',
          stock: data.stock !== undefined ? data.stock : '',
          size: data.size || '',
          description: data.description || '',
          usage: data.usage || '',
          ingredients: data.ingredients || ''
        });
      } catch (err) {
        console.error(err);
        setError('Could not load product details.');
      } finally {
        setInitialLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchProduct();
    } else if (session === null) {
        setInitialLoading(false);
        setError('You must be logged in to edit a product.');
    }
  }, [id, session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        rating: parseFloat(formData.rating) || 0,
        stock: parseInt(formData.stock) || 0,
      };

      const res = await fetch(`/api/edit-product/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to update product');
      }

      router.push('/dashboard/my-products');
    } catch (err) {
      console.error(err);
      setError('An error occurred while updating the product.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-[#E91E63] animate-spin" />
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-[2rem] p-8 text-center max-w-lg mx-auto border border-red-100 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Access Denied</h3>
        <p className="text-gray-500 text-sm">{error}</p>
        <Link href="/dashboard/my-products" className="btn-primary inline-flex justify-center py-2 px-6">
           Back to My Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-[#1F2937]">Edit Product</h1>
          <p className="text-gray-500 mt-2">Update the details of your beauty vault item.</p>
        </div>
        <Link href="/dashboard/my-products" className="text-sm font-semibold text-gray-500 hover:text-[#E91E63] flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Cancel
        </Link>
      </div>

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
                <Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" /> Save Changes
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
