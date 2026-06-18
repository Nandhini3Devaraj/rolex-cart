'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import RoleGuard from '@/components/guards/RoleGuard';
import GlassCard from '@/components/ui/GlassCard';
import GlassTable from '@/components/ui/GlassTable';
import GlassButton from '@/components/ui/GlassButton';
import EmptyState from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import { Eye, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      orderService
        .getOrdersByCustomer(user._id)
        .then((data) => setOrders(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <RoleGuard allowedRoles={['Customer']} redirect>
      <div className="space-y-6">
        {loading ? (
          <GlassCard className="p-6">
            <TableSkeleton rows={4} cols={6} />
          </GlassCard>
        ) : orders.length === 0 ? (
          <EmptyState
            type="orders"
            action={
              <GlassButton variant="primary" onClick={() => router.push('/dashboard')}>
                Start Shopping
              </GlassButton>
            }
          />
        ) : (
          <div className="space-y-4">
            <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-pink-500" /> My Purchases
            </h3>
            <GlassCard className="p-6">
              <GlassTable headers={['Order ID', 'Item Details', 'Total Paid', 'Status', 'Date Placed', 'Actions']}>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.01]">
                    <td className="py-4 font-bold text-pink-400">{order._id}</td>
                    <td className="py-4 text-slate-300">
                      <div className="max-w-[200px] truncate font-medium">
                        {order.products.map((p) => `${p.product.name} (x${p.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td className="py-4 font-bold text-slate-200">${order.totalAmount.toLocaleString()}</td>
                    <td className="py-4">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border',
                          order.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : order.status === 'Processing'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : order.status === 'Cancelled'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <Link href={`/orders/${order._id}`}>
                        <button
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
                          title="Track Delivery Timeline"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </GlassTable>
            </GlassCard>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
