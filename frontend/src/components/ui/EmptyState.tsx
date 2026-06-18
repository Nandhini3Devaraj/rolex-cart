'use client';

import React from 'react';
import { ShoppingBag, Users, ShoppingCart } from 'lucide-react';

interface EmptyStateProps {
  type: 'orders' | 'users' | 'products' | 'cart' | 'wishlist';
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  type,
  title,
  description,
  action,
}: EmptyStateProps) {
  const config = {
    orders: {
      icon: <ShoppingCart className="w-8 h-8 text-pink-400" />,
      title: 'No Orders Found',
      description: 'You have not placed or received any orders yet.',
    },
    users: {
      icon: <Users className="w-8 h-8 text-pink-400" />,
      title: 'No Users Found',
      description: 'There are no user accounts matching your search in the system.',
    },
    products: {
      icon: <ShoppingBag className="w-8 h-8 text-pink-400" />,
      title: 'No Products Found',
      description: 'The product catalog is currently empty or no items match your criteria.',
    },
    cart: {
      icon: <ShoppingCart className="w-8 h-8 text-pink-400" />,
      title: 'Your Cart is Empty',
      description: 'Browse our collection and add premium luxury items to your cart.',
    },
    wishlist: {
      icon: <ShoppingBag className="w-8 h-8 text-pink-400" />,
      title: 'Your Wishlist is Empty',
      description: 'Bookmark luxury items to keep track of what you love.',
    },
  };

  const current = config[type];

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px] glass-panel rounded-[24px]">
      <div className="w-16 h-16 rounded-full bg-pink-500/5 flex items-center justify-center mb-6 border border-pink-500/15">
        {current.icon}
      </div>
      <h3 className="text-lg font-bold text-slate-200 mb-2">{title || current.title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
        {description || current.description}
      </p>
      {action}
    </div>
  );
}
