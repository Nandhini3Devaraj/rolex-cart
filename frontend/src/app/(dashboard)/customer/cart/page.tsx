'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import RoleGuard from '@/components/guards/RoleGuard';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';
import EmptyState from '@/components/ui/EmptyState';
import { orderService } from '@/services/orderService';
import { CartItem } from '@/types';
import { Trash2, Plus, Minus, CreditCard, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const items = JSON.parse(localStorage.getItem('rolex_cart') || '[]');
      setCartItems(items);
    }
  }, []);

  const updateQuantity = (productId: string, val: number) => {
    const updated = cartItems.map((item) => {
      if (item.product._id === productId) {
        const newQty = item.quantity + val;
        return { ...item, quantity: Math.max(newQty, 1) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('rolex_cart', JSON.stringify(updated));
  };

  const removeItem = (productId: string) => {
    const filtered = cartItems.filter((item) => item.product._id !== productId);
    setCartItems(filtered);
    localStorage.setItem('rolex_cart', JSON.stringify(filtered));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (cartItems.length === 0) return;

    if (!street || !city || !state || !postalCode || !country) {
      alert('Please fill out all shipping address fields');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: { street, city, state, postalCode, country },
        notes,
      };

      await orderService.createOrder(orderPayload, {
        _id: user._id,
        name: user.name,
        email: user.email,
      });

      localStorage.setItem('rolex_cart', '[]');
      setCartItems([]);
      alert('Order placed successfully! Thank you for purchasing.');
      router.push('/customer/my-orders');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['Customer']} redirect>
      <div className="space-y-6">
        {cartItems.length === 0 ? (
          <EmptyState
            type="cart"
            action={
              <GlassButton variant="primary" onClick={() => router.push('/dashboard')}>
                Explore Timepieces
              </GlassButton>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-2">Shopping Bag</h3>
              {cartItems.map((item) => (
                <GlassCard
                  key={item.product._id}
                  className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.01]"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.product.name}</h4>
                      <p className="text-[10px] text-pink-400 font-extrabold mt-1">
                        ${item.product.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, -1)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold px-2 text-slate-300">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, 1)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-extrabold text-slate-200">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.product._id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-2">Order Checkout</h3>
              <GlassCard glow="pink" className="p-6">
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="border-b border-white/5 pb-3 mb-3">
                    <span className="text-slate-400 text-xs font-medium">Subtotal</span>
                    <h4 className="text-xl font-black text-slate-200 mt-1">${totalAmount.toLocaleString()}</h4>
                  </div>

                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-pink-400">Shipping Details</h4>

                  <GlassInput
                    label="Street Address"
                    type="text"
                    placeholder="123 Luxury St"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <GlassInput
                      label="City"
                      type="text"
                      placeholder="London"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                    <GlassInput
                      label="State/Region"
                      type="text"
                      placeholder="Greater London"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <GlassInput
                      label="Postal Code"
                      type="text"
                      placeholder="EC1A"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                    <GlassInput
                      label="Country"
                      type="text"
                      placeholder="UK"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-300/80 text-xs font-semibold uppercase tracking-wider">Order Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="glass-input w-full px-4 py-2.5 rounded-xl text-xs placeholder-slate-500 bg-transparent min-h-[60px] outline-none border border-white/8"
                      placeholder="e.g. Please wrap as a gift"
                    />
                  </div>

                  <div className="pt-2">
                    <GlassButton type="submit" variant="primary" className="w-full text-xs font-bold gap-2" isLoading={loading}>
                      <CreditCard className="w-4 h-4" /> Place Luxury Order
                    </GlassButton>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Checkout Guaranteed
                  </div>
                </form>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
