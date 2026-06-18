'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RoleGuard from '@/components/guards/RoleGuard';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import EmptyState from '@/components/ui/EmptyState';
import { Product } from '@/types';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWishlist(JSON.parse(localStorage.getItem('rolex_wishlist') || '[]'));
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('rolex_cart') || '[]');
      const idx = cart.findIndex((item: { product: Product }) => item.product._id === product._id);
      if (idx > -1) {
        cart[idx].quantity += 1;
      } else {
        cart.push({ product, quantity: 1 });
      }
      localStorage.setItem('rolex_cart', JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
    }
  };

  const handleRemoveFromWishlist = (id: string) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem('rolex_wishlist', JSON.stringify(updated));
  };

  return (
    <RoleGuard allowedRoles={['Customer']} redirect>
      <div className="space-y-6">
        {wishlist.length === 0 ? (
          <EmptyState
            type="wishlist"
            action={
              <GlassButton variant="primary" onClick={() => router.push('/dashboard')}>
                Explore Luxury Watches
              </GlassButton>
            }
          />
        ) : (
          <div className="space-y-4">
            <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500 animate-pulse" /> My Wishlist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((prod) => (
                <GlassCard
                  key={prod._id}
                  className="p-4 flex flex-col bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 transition-all relative group"
                >
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-white/5">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveFromWishlist(prod._id)}
                      className="absolute top-2 right-2 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-red-400 transition-colors cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-pink-400">{prod.category}</span>
                      <h4 className="text-sm font-bold text-slate-200 line-clamp-1 mt-0.5">{prod.name}</h4>
                      <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-extrabold text-slate-200">${prod.price.toLocaleString()}</span>
                      <GlassButton
                        onClick={() => handleAddToCart(prod)}
                        variant="primary"
                        className="text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1"
                        disabled={prod.stock === 0}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {prod.stock === 0 ? 'Sold Out' : 'Buy Now'}
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
