'use client';

import React, { useState, useEffect } from 'react';
import RoleGuard from '@/components/guards/RoleGuard';
import PermissionGuard from '@/components/guards/PermissionGuard';
import GlassCard from '@/components/ui/GlassCard';
import GlassTable from '@/components/ui/GlassTable';
import GlassButton from '@/components/ui/GlassButton';
import { useDashboard } from '@/contexts/DashboardContext';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import { cn } from '@/lib/utils';
import { Search, Eye, Trash2, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { orders, deleteOrder: deleteOrderContext } = useDashboard();
  const [loading, setLoading] = useState(false);
  
  // Filtering states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Apply filtering and sorting to context orders
  const filteredOrders = React.useMemo(() => {
    let filtered = [...orders];

    // Filter by status
    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }

    // Apply search
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sort === 'price-low') {
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    return filtered;
  }, [orders, search, status, sort]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Delete handler
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this order? Stock quantities will be restored.')) {
      setLoading(true);
      try {
        await orderService.deleteOrder(id);
        deleteOrderContext(id);
      } catch (err: any) {
        alert(err.message || 'Failed to delete order');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <RoleGuard allowedRoles={['SuperAdmin', 'Manager', 'Staff']} redirect>
    <div className="space-y-6">
      {/* Filtering Header bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Left Side: Filter inputs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs w-full placeholder-slate-500"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="glass-input px-4 py-2.5 rounded-xl text-xs bg-[#0d0816] text-slate-200 border border-white/8 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="glass-input px-4 py-2.5 rounded-xl text-xs bg-[#0d0816] text-slate-200 border border-white/8 outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Value: High to Low</option>
            <option value="price-low">Value: Low to High</option>
          </select>
        </div>
      </div>

      {/* Orders List Table */}
      <GlassCard className="p-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-12 bg-white/5 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="space-y-4">
            <GlassTable headers={['Order ID', 'Customer', 'Products Count', 'Total Amount', 'Status', 'Date', 'Actions']}>
              {paginatedOrders.map((order) => (
                <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.01]">
                  <td className="py-4 font-bold text-pink-400">{order._id}</td>
                  <td className="py-4 text-slate-200 font-semibold">
                    <div>
                      <p>{order.customer.name}</p>
                      <span className="text-[10px] text-slate-500 font-normal">{order.customer.email}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-400 font-medium">
                    {order.products.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </td>
                  <td className="py-4 font-bold text-slate-200">
                    ${order.totalAmount.toLocaleString()}
                  </td>
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
                    <div className="flex gap-2">
                      <Link href={`/orders/${order._id}`}>
                        <button
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </Link>

                      <PermissionGuard permission="delete:orders">
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </PermissionGuard>
                    </div>
                  </td>
                </tr>
              ))}
            </GlassTable>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xs text-slate-400">
                  Showing Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <GlassButton
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    variant="secondary"
                    className="text-xs py-1.5 px-3"
                  >
                    Previous
                  </GlassButton>
                  <GlassButton
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="secondary"
                    className="text-xs py-1.5 px-3"
                  >
                    Next
                  </GlassButton>
                </div>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
    </RoleGuard>
  );
}
