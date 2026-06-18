'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import RoleGuard from '@/components/guards/RoleGuard';
import PermissionGuard from '@/components/guards/PermissionGuard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';
import Drawer from '@/components/ui/Drawer';
import { useDashboard } from '@/contexts/DashboardContext';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Search, Plus, Edit3, Trash2, Package } from 'lucide-react';
import Link from 'next/link';

const productSchema = zod.object({
  name: zod.string().min(3, 'Min 3 characters'),
  description: zod.string().min(10, 'Min 10 characters'),
  category: zod.string().min(1, 'Required'),
  price: zod.coerce.number().min(0, 'Cannot be negative'),
  stock: zod.coerce.number().min(0, 'Cannot be negative'),
  image: zod.string().optional(),
});

type ProductFormFields = zod.infer<typeof productSchema>;

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

// Comprehensive product categories for e-commerce
const PRODUCT_CATEGORIES = [
  // Electronics
  'Smartphones',
  'Laptops',
  'Smart Watches',
  'Electronics Accessories',
  
  // Fashion
  "Men's Clothing",
  "Women's Clothing",
  'Footwear',
  'Bags',
  
  // Watches
  'Luxury Watches',
  'Sports Watches',
  'Smart Watches',
  'Chronograph Watches',
  'Watches',
  
  // Jewelry & Accessories
  'Rings',
  'Necklaces',
  'Bracelets',
  'Sunglasses',
  'Jewelry',
  'Accessories',
  
  // Home & Living
  'Furniture',
  'Kitchen Appliances',
  'Home Decor',
  
  // Beauty & Personal Care
  'Skincare',
  'Makeup',
  'Perfumes',
  
  // Sports & Fitness
  'Gym Equipment',
  'Sportswear',
  'Outdoor Gear',
  
  // Books & Stationery
  'Books',
  'Notebooks',
  'Office Supplies',
  
  // Toys & Games
  'Educational Toys',
  'Video Games',
  'Board Games',
  
  // Automotive
  'Car Accessories',
  'Bike Accessories',
  
  // Services
  'Services',
];

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/25">Out</span>;
  if (stock <= 5) return <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/25">{stock}</span>;
  return <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">{stock}</span>;
}

export default function ProductsPage() {
  const { products: allProducts, refreshProducts, addProduct, updateProduct, deleteProduct } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormFields>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormFields>,
  });

  // No need for fetchProducts function - using context data

  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];
    if (category) list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [allProducts, category, search, sort]);

  useEffect(() => { setCurrentPage(1); }, [search, category, sort]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const onSubmit = async (data: ProductFormFields) => {
    const payload = { ...data, image: data.image || FALLBACK_IMG };
    setLoading(true);
    try {
      if (drawerMode === 'create') {
        const newProduct = await productService.createProduct(payload);
        addProduct(newProduct); // Update context immediately
        setIsDrawerOpen(false);
        reset();
      } else {
        if (!selectedProduct) return;
        const updated = await productService.updateProduct(selectedProduct._id, payload);
        updateProduct(selectedProduct._id, updated); // Update context immediately
        setIsDrawerOpen(false);
        setSelectedProduct(null);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDrawer = () => {
    setDrawerMode('create');
    setSelectedProduct(null);
    reset({ name: '', description: '', category: PRODUCT_CATEGORIES[0] || 'Watches', price: 0, stock: 5, image: '' }); // Use first category from predefined list
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product: Product) => {
    setDrawerMode('edit');
    setSelectedProduct(product);
    reset({ name: product.name, description: product.description, category: product.category, price: product.price, stock: product.stock, image: product.image || '' });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete? Cannot undo.')) return;
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      deleteProduct(id); // Update context immediately
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Merge predefined categories with dynamic categories from database
  const allCategories = useMemo(() => {
    const dbCategories = categories.filter((c) => !PRODUCT_CATEGORIES.includes(c)); // Get categories not in predefined list
    return [...PRODUCT_CATEGORIES, ...dbCategories].sort(); // Combine and sort alphabetically
  }, [categories]);

  return (
    <RoleGuard allowedRoles={['SuperAdmin', 'Manager', 'Staff']} redirect>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs w-full placeholder-slate-500" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="glass-select px-4 py-2.5 rounded-xl text-xs">
              <option value="">All ({allProducts.length})</option>
              {categories.map((c) => <option key={c} value={c}>{c} ({allProducts.filter((p) => p.category === c).length})</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="glass-select px-4 py-2.5 rounded-xl text-xs">
              <option value="newest">Newest</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
            </select>
          </div>
          <PermissionGuard permission="create:products">
            <GlassButton onClick={openCreateDrawer} variant="primary" className="text-xs py-2.5 px-5 flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add
            </GlassButton>
          </PermissionGuard>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse">
                <div className="w-full h-44 bg-white/5" />
                <div className="p-4 space-y-3"><div className="h-3 w-1/3 bg-white/5 rounded" /><div className="h-4 w-2/3 bg-white/5 rounded" /></div>
              </div>
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="glass-panel rounded-2xl flex flex-col items-center justify-center py-20 gap-3">
            <Package className="w-10 h-10 text-slate-600" />
            <p className="text-slate-400 text-sm">No products. {search || category ? 'Clear filters.' : 'Add first.'}</p>
            <PermissionGuard permission="create:products">
              <GlassButton onClick={openCreateDrawer} variant="primary" className="text-xs">Add Product</GlassButton>
            </PermissionGuard>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {paginatedProducts.map((prod) => (
                <div key={prod._id} className="glass-panel rounded-2xl overflow-hidden flex flex-col border border-white/8 hover:border-pink-500/20 transition-colors">
                  <div className="relative w-full h-44 bg-[#0f0820] flex-shrink-0">
                    <img src={prod.image || FALLBACK_IMG} alt={prod.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                  </div>
                  <div className="flex flex-col flex-1 p-4 gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-pink-400">{prod.category}</span>
                      <StockBadge stock={prod.stock} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{prod.name}</h4>
                    <p className="text-slate-400 text-[11px] line-clamp-2 flex-1">{prod.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-base font-black text-white">${prod.price.toLocaleString()}</span>
                      <div className="flex gap-1.5">
                        <Link href={`/products/${prod._id}`}><button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/8 transition-all cursor-pointer" title="View">👁</button></Link>
                        <PermissionGuard permission="edit:products">
                          <button onClick={() => openEditDrawer(prod)} className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all cursor-pointer" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                        </PermissionGuard>
                        <PermissionGuard permission="delete:products">
                          <button onClick={() => handleDelete(prod._id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                        </PermissionGuard>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/5 pt-5">
                <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                  <GlassButton onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} variant="secondary" className="text-xs py-1.5 px-3">Prev</GlassButton>
                  <GlassButton onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} variant="secondary" className="text-xs py-1.5 px-3">Next</GlassButton>
                </div>
              </div>
            )}
          </div>
        )}

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerMode === 'create' ? 'Add Product' : 'Edit Product'}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <GlassInput label="Product Name" type="text" placeholder="Rolex Submariner" error={errors.name?.message} {...register('name')} />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Description</label>
              <textarea 
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder-slate-500 min-h-[90px] resize-none" 
                placeholder="Product description..." 
                {...register('description')} 
              />
              {errors.description?.message && <p className="text-red-400 text-xs">{errors.description.message}</p>}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Category</label>
              <select className="glass-select w-full px-4 py-2.5 rounded-xl text-sm" {...register('category')}>
                {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category?.message && <p className="text-red-400 text-xs">{errors.category.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <GlassInput label="Price ($)" type="number" placeholder="1500" error={errors.price?.message} {...register('price')} />
              <GlassInput label="Stock Quantity" type="number" placeholder="10" error={errors.stock?.message} {...register('stock')} />
            </div>
            
            {/* Image URL field - More visible and prominent */}
            <div className="flex flex-col gap-2 p-4 rounded-xl border-2 border-purple-500/30 bg-purple-500/5">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-lg">🖼️</span>
                <label className="text-purple-300 text-xs font-bold uppercase tracking-widest">Product Image URL</label>
              </div>
              <input 
                type="text" 
                placeholder="https://example.com/product-image.jpg" 
                className="glass-input w-full px-4 py-3 rounded-lg text-sm placeholder-slate-500 border border-purple-500/20 focus:border-purple-500/50 transition-colors" 
                {...register('image')} 
              />
              <p className="text-slate-500 text-[10px] leading-relaxed">
                💡 Paste an image URL from the web (right-click image → Copy Image Address). Leave empty to use default image.
              </p>
              {errors.image?.message && <p className="text-red-400 text-xs">{errors.image.message}</p>}
            </div>
            
            <GlassButton type="submit" variant="primary" className="w-full text-sm py-3">
              {drawerMode === 'create' ? '✨ Create Product' : '💾 Save Changes'}
            </GlassButton>
          </form>
        </Drawer>
      </div>
    </RoleGuard>
  );
}
