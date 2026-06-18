'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ProtectedRoute from '@/components/guards/ProtectedRoute';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <DashboardProvider>
        <div className="min-h-screen bg-[#040108] bg-mesh-gradient flex overflow-hidden relative">
          {/* Ambient background glows */}
          <div className="glow-bubble-pink top-[-10%] left-[5%]" />
          <div className="glow-bubble-purple bottom-[-10%] right-[5%]" />

          {/* Navigation Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />

          {/* Dashboard Main Window */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 h-screen">
            <Header onMenuClick={() => setSidebarOpen(true)} />

            <motion.main
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 p-4 md:p-6"
            >
              {children}
            </motion.main>
          </div>
        </div>
      </DashboardProvider>
    </ProtectedRoute>
  );
}
