'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RoleGuard from '@/components/guards/RoleGuard';
import PermissionGuard from '@/components/guards/PermissionGuard';
import GlassCard from '@/components/ui/GlassCard';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import {
  Check,
  Package,
  Truck,
  CheckCircle2,
  ChevronLeft,
  User,
  MapPin,
  Calendar,
  Clipboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetails = () => {
    setLoading(true);
    orderService
      .getOrderById(id)
      .then((data) => setOrder(data))
      .catch((err) => {
        alert('Order not found');
        router.push('/orders');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  // Update status handler
  const handleStatusChange = (newStatus: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') => {
    if (!order) return;
    setUpdating(true);
    orderService
      .updateOrder(order._id, { status: newStatus })
      .then((updated) => {
        setOrder(updated);
        alert(`Order status updated to ${newStatus}`);
      })
      .catch((err) => alert(err.message || 'Failed to update order status'))
      .finally(() => setUpdating(false));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 text-xs font-semibold tracking-wider">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) return null;

  // Timeline Steps Calculation
  const getTimelineStatus = (step: 'placed' | 'processing' | 'shipped' | 'completed') => {
    const statusMap = {
      Pending: { placed: 'current', processing: 'upcoming', shipped: 'upcoming', completed: 'upcoming' },
      Processing: { placed: 'complete', processing: 'current', shipped: 'upcoming', completed: 'upcoming' },
      Completed: { placed: 'complete', processing: 'complete', shipped: 'complete', completed: 'complete' },
      Cancelled: { placed: 'cancelled', processing: 'cancelled', shipped: 'cancelled', completed: 'cancelled' },
    };

    return statusMap[order.status][step] as 'complete' | 'current' | 'upcoming' | 'cancelled';
  };

  return (
    <RoleGuard allowedRoles={['SuperAdmin', 'Manager', 'Staff', 'Customer']} redirect>
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer select-none"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Listing
        </button>

        <PermissionGuard permission="update:orders-status">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Order Status:</span>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
              disabled={updating}
              className="glass-input px-3 py-1.5 rounded-xl text-xs bg-[#0d0816] text-slate-200 border border-white/8 outline-none cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </PermissionGuard>
      </div>

      {/* Main Order Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details & Summary (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline tracking panel */}
          <GlassCard className="p-6">
            <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6">Delivery Timeline</h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative">
              
              {/* Placed step */}
              <div className="flex items-center gap-3 sm:flex-col sm:text-center sm:flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300',
                    getTimelineStatus('placed') === 'complete' || getTimelineStatus('placed') === 'current'
                      ? 'bg-pink-500/10 border-pink-500 text-pink-400'
                      : getTimelineStatus('placed') === 'cancelled'
                      ? 'bg-red-500/10 border-red-500 text-red-400'
                      : 'bg-white/5 border-white/10 text-slate-500'
                  )}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Order Placed</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Confirmed</p>
                </div>
              </div>

              {/* Processing step */}
              <div className="flex items-center gap-3 sm:flex-col sm:text-center sm:flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300',
                    getTimelineStatus('processing') === 'complete'
                      ? 'bg-pink-500/10 border-pink-500 text-pink-400'
                      : getTimelineStatus('processing') === 'current'
                      ? 'bg-purple-500/10 border-purple-500 text-purple-400 animate-pulse'
                      : getTimelineStatus('processing') === 'cancelled'
                      ? 'bg-red-500/10 border-red-500 text-red-400'
                      : 'bg-white/5 border-white/10 text-slate-500'
                  )}
                >
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Processing</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Assembling package</p>
                </div>
              </div>

              {/* Shipped step */}
              <div className="flex items-center gap-3 sm:flex-col sm:text-center sm:flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300',
                    getTimelineStatus('shipped') === 'complete'
                      ? 'bg-pink-500/10 border-pink-500 text-pink-400'
                      : getTimelineStatus('shipped') === 'current'
                      ? 'bg-purple-500/10 border-purple-500 text-purple-400 animate-pulse'
                      : getTimelineStatus('shipped') === 'cancelled'
                      ? 'bg-red-500/10 border-red-500 text-red-400'
                      : 'bg-white/5 border-white/10 text-slate-500'
                  )}
                >
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Out For Delivery</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">In Transit</p>
                </div>
              </div>

              {/* Completed step */}
              <div className="flex items-center gap-3 sm:flex-col sm:text-center sm:flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300',
                    getTimelineStatus('completed') === 'complete'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                      : getTimelineStatus('completed') === 'cancelled'
                      ? 'bg-red-500/10 border-red-500 text-red-400'
                      : 'bg-white/5 border-white/10 text-slate-500'
                  )}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Delivered</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Received</p>
                </div>
              </div>

            </div>
          </GlassCard>

          {/* Items breakdown list */}
          <GlassCard className="p-6">
            <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6">Order Items</h3>
            <div className="space-y-4">
              {order.products.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                      <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.product?.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Price: ${item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300 font-bold block">Qty: {item.quantity}</span>
                    <span className="text-xs text-pink-400 font-black">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Grand Total:</span>
              <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">
                ${order.totalAmount.toLocaleString()}
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Shipping address & Customer Profile Details (Right Column) */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-pink-400" /> Customer Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400">Name</p>
                <p className="font-bold text-slate-200 mt-0.5">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-slate-400">Email Address</p>
                <p className="font-bold text-slate-300 mt-0.5">{order.customer.email}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-400" /> Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <p className="font-bold text-slate-200">{order.customer.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p className="font-semibold text-slate-400 mt-1">{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No shipping address provided</p>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clipboard className="w-4 h-4 text-pink-400" /> Order Notes
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-white/[0.02] p-3 rounded-xl border border-white/5">
              {order.notes || 'No notes added to this order.'}
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
    </RoleGuard>
  );
}
