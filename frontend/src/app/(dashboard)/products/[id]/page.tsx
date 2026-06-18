'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import RoleGuard from '@/components/guards/RoleGuard';
import PermissionGuard from '@/components/guards/PermissionGuard';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import ErrorState from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useProduct } from '@/hooks/useProducts';
import { ChevronLeft, Edit3, Package, Tag, Boxes } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: product, isLoading, isError, refetch } = useProduct(id);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <ErrorState
        type="api"
        message="Unable to load product details. The item may have been removed."
        retry={() => refetch()}
      />
    );
  }

  const stockStatus =
    product.stock === 0
      ? { label: 'Out of Stock', class: 'bg-red-500/10 text-red-400 border-red-500/20' }
      : product.stock <= 5
      ? { label: `Low Stock (${product.stock})`, class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
      : { label: `In Stock (${product.stock})`, class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };

  return (
    <RoleGuard allowedRoles={['SuperAdmin', 'Manager', 'Staff']} redirect>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Products
          </button>
          <PermissionGuard permission="edit:products">
            <Link href="/products">
              <GlassButton variant="secondary" className="text-xs flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5" /> Edit from Catalog
              </GlassButton>
            </Link>
          </PermissionGuard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400">
                {product.category}
              </span>
              <h1 className="text-2xl font-black text-slate-100 mt-2">{product.name}</h1>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Tag className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-black text-slate-200">${product.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Boxes className="w-4 h-4 text-purple-400" />
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${stockStatus.class}`}>
                  {stockStatus.label}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Package className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-400">ID: {product._id}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-xs text-slate-500 space-y-1">
              <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
              <p>Last updated: {new Date(product.updatedAt).toLocaleString()}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </RoleGuard>
  );
}
