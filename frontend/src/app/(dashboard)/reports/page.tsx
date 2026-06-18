'use client';

import React, { useState, useEffect } from 'react';
import RoleGuard from '@/components/guards/RoleGuard';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import { Download, BarChart2, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const MONTHLY_REPORTS = [
  { month: 'Jan', revenue: 45000, orders: 150, signups: 80 },
  { month: 'Feb', monthNum: 2, revenue: 52000, orders: 180, signups: 95 },
  { month: 'Mar', monthNum: 3, revenue: 61000, orders: 210, signups: 120 },
  { month: 'Apr', monthNum: 4, revenue: 58000, orders: 195, signups: 110 },
  { month: 'May', monthNum: 5, revenue: 85000, orders: 320, signups: 175 },
  { month: 'Jun', monthNum: 6, revenue: 99000, orders: 390, signups: 220 },
];

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeReport, setActiveReport] = useState<'revenue' | 'orders' | 'users'>('revenue');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock download helper
  const triggerExport = (format: 'CSV' | 'PDF') => {
    alert(`Generating ${activeReport.toUpperCase()} report in ${format} format...`);
    
    // Simulate file download
    const headers = 'Month,Revenue,Orders,Signups\n';
    const rows = MONTHLY_REPORTS.map((r) => `${r.month},${r.revenue},${r.orders},${r.signups}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `rolex_cart_${activeReport}_report_${Date.now()}.${format.toLowerCase()}`);
    a.click();
  };

  if (!mounted) return null;

  return (
    <RoleGuard allowedRoles={['SuperAdmin', 'Manager']} redirect>
      <div className="space-y-6">
        {/* Reports selections */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveReport('revenue')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeReport === 'revenue'
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/15 text-pink-400 border border-pink-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Revenue Report
            </button>
            <button
              onClick={() => setActiveReport('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeReport === 'orders'
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/15 text-pink-400 border border-pink-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Order Report
            </button>
            <button
              onClick={() => setActiveReport('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeReport === 'users'
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/15 text-pink-400 border border-pink-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              User Report
            </button>
          </div>

          <div className="flex gap-3">
            <GlassButton
              onClick={() => triggerExport('CSV')}
              variant="secondary"
              className="text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV
            </GlassButton>
            <GlassButton
              onClick={() => triggerExport('PDF')}
              variant="secondary"
              className="text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export PDF
            </GlassButton>
          </div>
        </div>

        {/* Executive summary row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/15">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-semibold tracking-wider">Total Sales (H1)</span>
                <h3 className="text-xl font-black text-slate-200 mt-0.5">$400,000</h3>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/15">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-semibold tracking-wider">Total Transactions</span>
                <h3 className="text-xl font-black text-slate-200 mt-0.5">1,445 Orders</h3>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/15">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-semibold tracking-wider">New Signups</span>
                <h3 className="text-xl font-black text-slate-200 mt-0.5">800 Users</h3>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Reports Chart Rendering */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-pink-500" />
              {activeReport === 'revenue' && 'Revenue & Profit Growth Trend'}
              {activeReport === 'orders' && 'Monthly Order Volume Breakdown'}
              {activeReport === 'users' && 'User Signup Registration Report'}
            </h3>
            <span className="text-pink-400 text-xs font-bold inline-flex items-center gap-1">
              +14.8% YoY <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={MONTHLY_REPORTS}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 10, 25, 0.9)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />

                {activeReport === 'revenue' && (
                  <>
                    <Bar dataKey="revenue" name="Sales ($)" fill="#ec4899" radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Line type="monotone" dataKey="revenue" name="Projection" stroke="#a855f7" strokeWidth={3} />
                  </>
                )}

                {activeReport === 'orders' && (
                  <>
                    <Bar dataKey="orders" name="Placed Orders" fill="#a855f7" radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Line type="monotone" dataKey="orders" name="Target Volume" stroke="#ec4899" strokeWidth={3} />
                  </>
                )}

                {activeReport === 'users' && (
                  <>
                    <Bar dataKey="signups" name="User Growth" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
                    <Line type="monotone" dataKey="signups" name="Projected Growth" stroke="#ec4899" strokeWidth={3} />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </RoleGuard>
  );
}
