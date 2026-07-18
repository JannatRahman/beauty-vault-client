'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { Package, Search, Edit2, Trash2, Loader2, AlertCircle, Plus, Eye, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyProductsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    if (isPending) return;
    
    if (!session?.user?.id) {
      setError('You must be logged in to view your products.');
      setLoading(false);
      return;
    }

    const fetchMyProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?createdBy=${session.user.id}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('Unable to load your products.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [session, isPending]);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setDeletingId(productToDelete._id);
      const res = await fetch(`/api/delete-product/${productToDelete._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      
      setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const name = (product.title || product.name || '').toLowerCase();
    const brand = (product.brandName || product.brand || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || brand.includes(q);
  });

  if (isPending || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-[#E91E63] animate-spin" />
        <p className="text-gray-500 font-medium">Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-[2rem] p-8 text-center max-w-lg mx-auto border border-red-100 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-gray-800">Authentication Required</h3>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-[#1F2937]">My Products</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage the products you've added to the vault.</p>
        </div>
        
        <Link 
          href="/dashboard/add-product"
          className="btn-primary py-3 px-6 rounded-xl shadow-md flex items-center gap-2 font-bold bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white shrink-0"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className="glass rounded-[1.5rem] p-4 flex items-center shadow-sm border border-[#F8BBD0]/30">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4.5 h-4.5 text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#FFF9FB] border border-[#F8BBD0]/40 rounded-xl focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all text-sm"
            placeholder="Search your products by name or brand..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-[2rem] overflow-hidden shadow-sm border border-[#F8BBD0]/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF9FB] border-b border-[#F8BBD0]/40 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-5 font-bold">Product</th>
                <th className="p-5 font-bold">Brand</th>
                <th className="p-5 font-bold">Price</th>
                <th className="p-5 font-bold">Rating</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Package className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-sm font-medium">No products found.</p>
                      {searchTerm && <p className="text-xs mt-1">Try adjusting your search.</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-[#FFF9FB]/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#F8BBD0]/30 overflow-hidden shrink-0 flex items-center justify-center relative">
                          {product.productImage || product.image ? (
                            <img 
                              src={product.productImage || product.image} 
                              alt={product.title || product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=100&h=100';
                              }}
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#1F2937] text-sm group-hover:text-[#E91E63] transition-colors line-clamp-1 max-w-[200px]">
                            {product.title || product.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {product.category || 'Beauty'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100">
                        {product.brandName || product.brand || 'N/A'}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="font-extrabold text-[#1F2937]">${parseFloat(product.price).toFixed(2)}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                        <span className="text-sm font-bold text-gray-700">{product.rating || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#E91E63] hover:bg-[#E91E63]/10 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </Link>
                        <Link
                          href={`/dashboard/edit-product/${product._id}`}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(product)}
                          disabled={deletingId === product._id}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          {deletingId === product._id ? (
                            <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-4.5 h-4.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl border border-red-100">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Product</h3>
            <p className="text-center text-gray-500 text-sm mb-8">
              Are you sure you want to delete <span className="font-bold text-gray-800">{productToDelete?.title || productToDelete?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                disabled={deletingId}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={deletingId}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-red-500/30 disabled:opacity-70"
              >
                {deletingId ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
