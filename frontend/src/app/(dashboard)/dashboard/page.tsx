'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/contexts/DashboardContext';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { userService } from '@/services/userService';
import { Product, Order, User } from '@/types';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  CreditCard,
  Plus,
  ArrowUpRight,
  Clock,
  Compass,
  Heart,
  ShoppingCart,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock charts dataset
const REVENUE_DATA = [
  { day: 'Mon', revenue: 4200 },
  { day: 'Tue', revenue: 5800 },
  { day: 'Wed', revenue: 5100 },
  { day: 'Thu', revenue: 7900 },
  { day: 'Fri', revenue: 6400 },
  { day: 'Sat', revenue: 9500 },
  { day: 'Sun', revenue: 11000 },
];

const ORDERS_DATA = [
  { day: 'Mon', orders: 12 },
  { day: 'Tue', orders: 18 },
  { day: 'Wed', orders: 15 },
  { day: 'Thu', orders: 28 },
  { day: 'Fri', orders: 20 },
  { day: 'Sat', orders: 32 },
  { day: 'Sun', orders: 45 },
];

const USERS_GROWTH = [
  { month: 'Jan', count: 120 },
  { month: 'Feb', count: 190 },
  { month: 'Mar', count: 310 },
  { month: 'Apr', count: 480 },
  { month: 'May', count: 690 },
  { month: 'Jun', count: 950 },
];

const COLORS = ['#ec4899', '#a855f7', '#6366f1', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#f97316'];

export default function DashboardPage() {
  const { user } = useAuth();
  const { products: allProducts, users: allUsers, orders: allOrders } = useDashboard();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate stats from context
  const userCount = allUsers.length;
  const productCount = allProducts.length;
  const orderCount = allOrders.length;
  const revenueTotal = allOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const recentOrders = allOrders.slice(0, 5);
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  // Calculate dynamic category distribution from actual products
  const categoryDistribution = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    allProducts.forEach((product) => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });

    const total = allProducts.length || 1;
    return Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [allProducts]);

  useEffect(() => {
    setMounted(true);

    // Load cart/wishlist for customer
    if (typeof window !== 'undefined') {
      setCart(JSON.parse(localStorage.getItem('rolex_cart') || '[]'));
      setWishlist(JSON.parse(localStorage.getItem('rolex_wishlist') || '[]'));
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    const updatedCart = [...cart];
    const idx = updatedCart.findIndex((item) => item.product._id === product._id);
    if (idx > -1) {
      updatedCart[idx].quantity += 1;
    } else {
      updatedCart.push({ product, quantity: 1 });
    }
    setCart(updatedCart);
    localStorage.setItem('rolex_cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (product: Product) => {
    const updatedWishlist = [...wishlist];
    if (updatedWishlist.some((p) => p._id === product._id)) {
      alert(`${product.name} is already in your wishlist!`);
      return;
    }
    updatedWishlist.push(product);
    setWishlist(updatedWishlist);
    localStorage.setItem('rolex_wishlist', JSON.stringify(updatedWishlist));
    alert(`${product.name} added to wishlist!`);
  };

  if (!mounted) return null;
  if (!user) return null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-[24px] animate-pulse">
            <div className="h-4 w-1/3 bg-white/5 rounded-lg mb-4" />
            <div className="h-8 w-2/3 bg-white/5 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  const isExecutive = user.role === 'SuperAdmin' || user.role === 'Manager';

  // ----------------------------------------------------
  // EXECUTIVE & MANAGER DASHBOARD VIEW
  // ----------------------------------------------------
  if (isExecutive) {
    return (
      <div className="space-y-6">
        {/* Executive Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard glow="pink" hoverEffect className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
                <h3 className="text-2xl font-black text-slate-100 mt-1">${revenueTotal.toLocaleString()}</h3>
                <span className="text-pink-400 text-xs font-bold inline-flex items-center gap-1 mt-1">
                  +12.5% <TrendingUp className="w-3 h-3" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="purple" hoverEffect className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Users</span>
                <h3 className="text-2xl font-black text-slate-100 mt-1">{userCount}</h3>
                <span className="text-purple-400 text-xs font-bold inline-flex items-center gap-1 mt-1">
                  +8.3% <TrendingUp className="w-3 h-3" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="none" hoverEffect className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Orders</span>
                <h3 className="text-2xl font-black text-slate-100 mt-1">{orderCount}</h3>
                <span className="text-pink-400 text-xs font-bold inline-flex items-center gap-1 mt-1">
                  +15.2% <TrendingUp className="w-3 h-3" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="none" hoverEffect className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Inventory Products</span>
                <h3 className="text-2xl font-black text-slate-100 mt-1">{productCount}</h3>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-1 block">
                  Items listed
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                <Plus className="w-6 h-6" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Area Chart */}
          <GlassCard className="p-6 lg:col-span-2">
            <h4 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6">Revenue Trend</h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 10, 25, 0.9)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ec4899"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Category Pie Chart */}
          <GlassCard className="p-6">
            <h4 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6">Category Distribution</h4>
            <div className="h-80 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 10, 25, 0.9)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-4 text-[10px] font-semibold justify-center">
                {categoryDistribution.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-400">{entry.name} ({entry.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders trend chart */}
          <GlassCard className="p-6">
            <h4 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6">Orders Volume</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ORDERS_DATA}>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 10, 25, 0.9)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="orders" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* User growth line chart */}
          <GlassCard className="p-6">
            <h4 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6">User Signups</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={USERS_GROWTH}>
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 10, 25, 0.9)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Recent Orders table overview */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-slate-200 text-sm font-bold uppercase tracking-wider">Recent Orders</h4>
            <Link
              href="/orders"
              className="text-xs font-bold text-pink-400 hover:text-pink-300 inline-flex items-center gap-1 hover:underline"
            >
              View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="border-b border-white/5 hover:bg-white/[0.01]">
                    <td className="py-4 font-bold text-pink-400">{ord._id}</td>
                    <td className="py-4 font-medium text-slate-300">{ord.customer.name}</td>
                    <td className="py-4 font-bold text-slate-200">${ord.totalAmount}</td>
                    <td className="py-4">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border',
                          ord.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : ord.status === 'Processing'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        )}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400 text-right">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ----------------------------------------------------
  // STAFF VIEW
  // ----------------------------------------------------
  if (user.role === 'Staff') {
    return (
      <div className="space-y-6">
        <GlassCard glow="purple" className="p-6">
          <h2 className="text-xl font-bold text-slate-200">Welcome back, {user.name}</h2>
          <p className="text-slate-400 text-sm mt-1">Here is the order assignment queue status for today.</p>
        </GlassCard>

        {/* Staff Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Active Orders</span>
            <h3 className="text-2xl font-black text-slate-100 mt-1">{orderCount}</h3>
          </GlassCard>
          <GlassCard className="p-6 border border-amber-500/10">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Processing</span>
            <h3 className="text-2xl font-black text-amber-400 mt-1">
              {recentOrders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length}
            </h3>
          </GlassCard>
          <GlassCard className="p-6 border border-emerald-500/10">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Completed Orders</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">
              {recentOrders.filter((o) => o.status === 'Completed').length}
            </h3>
          </GlassCard>
        </div>

        {/* List of orders queue */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-slate-200 text-sm font-bold uppercase tracking-wider">Order Assignment Queue</h4>
            <Link
              href="/orders"
              className="text-xs font-semibold text-pink-400 hover:underline inline-flex items-center gap-1"
            >
              Go to Fulfillment Queue <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((ord) => (
              <GlassCard key={ord._id} className="p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-pink-400">{ord._id}</span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border',
                          ord.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : ord.status === 'Processing'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        )}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">{ord.customer.name}</p>
                    <p className="text-[11px] text-slate-400">{ord.products.length} Items • Total amount: ${ord.totalAmount}</p>
                  </div>
                  <Link href={`/orders/${ord._id}`}>
                    <GlassButton variant="secondary" className="w-full sm:w-auto text-xs py-1.5 px-3">
                      Update Status
                    </GlassButton>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  // ----------------------------------------------------
  // CUSTOMER VIEW (STOREFRONT / DASHBOARD PORTAL)
  // ----------------------------------------------------
  return (
    <div className="space-y-8">
      {/* Customer Greeting */}
      <GlassCard glow="pink" className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-black text-slate-100">Welcome to RoleX Cart, {user.name}!</h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Explore the world's most exquisite luxury timepieces. Browse products, add reviews, and shop with confidence.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/customer/my-orders">
            <GlassButton variant="primary" className="text-xs inline-flex items-center gap-2">
              <Clock className="w-4 h-4" /> Track Orders
            </GlassButton>
          </Link>
          <Link href="/customer/cart">
            <GlassButton variant="secondary" className="text-xs inline-flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> View Cart ({cart.length})
            </GlassButton>
          </Link>
        </div>
      </GlassCard>

      {/* Browse All Products */}
      <div>
        <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
          <Compass className="w-5 h-5 text-pink-500" /> Shop All Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <CustomerProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Customer Product Card Component with Buy and Review
function CustomerProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}) {
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      await productService.addReview(product._id, rating, comment);
      alert('✅ Review submitted successfully!');
      setShowReview(false);
      setComment('');
      setRating(5);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = product.averageRating || 0;
  const reviewCount = product.totalReviews || 0;

  return (
    <GlassCard className="p-4 flex flex-col bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-all">
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-white/5">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <button
          onClick={() => onAddToWishlist(product)}
          className="absolute top-2 right-2 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-pink-500 transition-colors cursor-pointer"
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-red-400 text-sm font-bold">OUT OF STOCK</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-pink-400">{product.category}</span>
          <h4 className="text-sm font-bold text-slate-200 line-clamp-1 mt-0.5">{product.name}</h4>
          <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
          {/* Rating Display */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-xs ${i < Math.round(displayRating) ? 'text-amber-400' : 'text-slate-600'}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-slate-500">({reviewCount} reviews)</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-extrabold text-slate-200">${product.price.toLocaleString()}</span>
            <GlassButton
              onClick={() => onAddToCart(product)}
              variant="primary"
              className="text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : '🛒 Buy Now'}
            </GlassButton>
          </div>
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full text-[11px] py-1.5 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all font-semibold"
          >
            ✍️ Write a Review
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showReview && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl transition-colors cursor-pointer"
                >
                  <span className={star <= rating ? 'text-amber-400' : 'text-slate-600'}>★</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500/50 min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-[9px] text-slate-500 mt-1">{comment.length}/500 characters</p>
          </div>
          <div className="flex gap-2">
            <GlassButton
              onClick={handleSubmitReview}
              variant="primary"
              disabled={submitting}
              className="flex-1 text-xs py-2"
            >
              {submitting ? 'Submitting...' : '✓ Submit Review'}
            </GlassButton>
            <GlassButton
              onClick={() => { setShowReview(false); setComment(''); setRating(5); }}
              variant="secondary"
              className="flex-1 text-xs py-2"
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
