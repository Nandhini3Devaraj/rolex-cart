'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import { orderService } from '@/services/orderService';
import { Product, User, Order } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface DashboardContextType {
  // Products
  products: Product[];
  refreshProducts: () => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Users
  users: User[];
  refreshUsers: () => Promise<void>;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Orders
  orders: Order[];
  refreshOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  
  // Global refresh
  refreshAll: () => Promise<void>;
  
  // Loading states
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Products operations
  const refreshProducts = useCallback(async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updatedProduct: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...updatedProduct } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }, []);

  // Users operations - Only for SuperAdmin and Manager
  const refreshUsers = useCallback(async () => {
    if (!user || (user.role !== 'SuperAdmin' && user.role !== 'Manager')) {
      return; // Skip if not authorized
    }
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  }, [user]);

  const addUser = useCallback((user: User) => {
    setUsers((prev) => [user, ...prev]);
  }, []);

  const updateUser = useCallback((id: string, updatedUser: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, ...updatedUser } : u))
    );
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
  }, []);

  // Orders operations - Only for Staff, Manager, and SuperAdmin
  const refreshOrders = useCallback(async () => {
    if (!user || user.role === 'Customer') {
      return; // Skip if customer - they should use customer-specific endpoint
    }
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
  }, [user]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrder = useCallback((id: string, updatedOrder: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, ...updatedOrder } : o))
    );
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o._id !== id));
  }, []);

  // Global refresh all data - Role-based
  const refreshAll = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    const promises: Promise<void>[] = [refreshProducts()];
    
    // Only fetch users for SuperAdmin and Manager
    if (user.role === 'SuperAdmin' || user.role === 'Manager') {
      promises.push(refreshUsers());
    }
    
    // Only fetch orders for Staff, Manager, and SuperAdmin
    if (user.role !== 'Customer') {
      promises.push(refreshOrders());
    }
    
    await Promise.all(promises);
    setIsLoading(false);
  }, [user, refreshProducts, refreshUsers, refreshOrders]);

  // Initial data load - Wait for user to be available
  useEffect(() => {
    if (user) {
      refreshAll();
    }
  }, [user, refreshAll]);

  const value: DashboardContextType = {
    products,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    users,
    refreshUsers,
    addUser,
    updateUser,
    deleteUser,
    orders,
    refreshOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    refreshAll,
    isLoading,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
