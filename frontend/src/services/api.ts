import axios from 'axios';
import { User, Product, Order, Role } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('rolex-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// MOCK DATA STORE - Fallback if backend is down
const MOCK_USERS: User[] = [
  {
    _id: 'u-admin-1',
    name: 'Super Admin',
    email: 'admin@rolex.com',
    role: 'SuperAdmin',
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'u-manager-1',
    name: 'Manager User',
    email: 'manager@rolex.com',
    role: 'Manager',
    isActive: true,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'u-staff-1',
    name: 'Staff User',
    email: 'staff@rolex.com',
    role: 'Staff',
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'u-customer-1',
    name: 'John Customer',
    email: 'customer@rolex.com',
    role: 'Customer',
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'u-customer-2',
    name: 'Jane Customer',
    email: 'jane@rolex.com',
    role: 'Customer',
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'p-1',
    name: 'Rolex Submariner Date',
    description: 'The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert in black ceramic and a black dial with large luminescent hour markers.',
    category: 'Watches',
    price: 12500,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'p-2',
    name: 'Rolex Cosmograph Daytona',
    description: 'The Oyster Perpetual Cosmograph Daytona in Oystersteel with a white dial and an Oyster bracelet, features a Cerachrom bezel with tachymetric scale.',
    category: 'Watches',
    price: 24500,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'p-3',
    name: 'Omega Seamaster Diver 300M',
    description: 'Since 1993, the Seamaster Professional Diver 300M has enjoyed a legendary following. Today’s modern collection has embraced that famous ocean heritage.',
    category: 'Watches',
    price: 6200,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'p-4',
    name: 'Luxury Leather Watch Case',
    description: 'Premium calfskin leather case designed to store and protect three of your finest timepieces. Rich velvet lining and padded dividers.',
    category: 'Accessories',
    price: 150,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'p-5',
    name: 'Rolex GMT-Master II',
    description: 'Designed to show the time in two different time zones simultaneously, the GMT-Master II is the ultimate watch for globetrotters.',
    category: 'Watches',
    price: 18900,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'p-6',
    name: 'Premium Automatic Watch Winder',
    description: 'An elegant watch winder with multiple rotation programs, silent motor operation, and high-gloss cherry wood finish.',
    category: 'Accessories',
    price: 390,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'p-7',
    name: 'Audemars Piguet Royal Oak',
    description: 'The Royal Oak Ref. 15500ST in stainless steel features a black Grande Tapisserie dial and signature octagonal bezel with hexagonal screws.',
    category: 'Watches',
    price: 38000,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'p-8',
    name: 'Patek Philippe Nautilus',
    description: 'With the rounded octagonal shape of its bezel, the Nautilus has transcended watches to become a global design icon.',
    category: 'Watches',
    price: 72000,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_ORDERS: Order[] = [
  {
    _id: 'o-1',
    customer: {
      _id: 'u-customer-1',
      name: 'John Customer',
      email: 'customer@rolex.com',
    },
    products: [
      {
        product: {
          _id: 'p-1',
          name: 'Rolex Submariner Date',
          price: 12500,
          image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
        },
        quantity: 1,
        price: 12500,
      },
    ],
    totalAmount: 12500,
    status: 'Pending',
    shippingAddress: {
      street: '123 Luxury St',
      city: 'London',
      state: 'Greater London',
      postalCode: 'EC1A 1BB',
      country: 'UK',
    },
    notes: 'Please wrap as a gift',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'o-2',
    customer: {
      _id: 'u-customer-2',
      name: 'Jane Customer',
      email: 'jane@rolex.com',
    },
    products: [
      {
        product: {
          _id: 'p-3',
          name: 'Omega Seamaster Diver 300M',
          price: 6200,
          image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop',
        },
        quantity: 2,
        price: 6200,
      },
      {
        product: {
          _id: 'p-4',
          name: 'Luxury Leather Watch Case',
          price: 150,
          image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop',
        },
        quantity: 1,
        price: 150,
      },
    ],
    totalAmount: 12550,
    status: 'Completed',
    shippingAddress: {
      street: '456 Fashion Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    notes: '',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'o-3',
    customer: {
      _id: 'u-customer-1',
      name: 'John Customer',
      email: 'customer@rolex.com',
    },
    products: [
      {
        product: {
          _id: 'p-6',
          name: 'Premium Automatic Watch Winder',
          price: 390,
          image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=600&auto=format&fit=crop',
        },
        quantity: 1,
        price: 390,
      },
    ],
    totalAmount: 390,
    status: 'Processing',
    shippingAddress: {
      street: '123 Luxury St',
      city: 'London',
      state: 'Greater London',
      postalCode: 'EC1A 1BB',
      country: 'UK',
    },
    notes: '',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initialize localStorage items if missing
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('rolex_mock_users')) {
    localStorage.setItem('rolex_mock_users', JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem('rolex_mock_products')) {
    localStorage.setItem('rolex_mock_products', JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem('rolex_mock_orders')) {
    localStorage.setItem('rolex_mock_orders', JSON.stringify(MOCK_ORDERS));
  }
}

// Helper getter/setters for Local Storage
export const mockDb = {
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem('rolex_mock_users') || '[]');
  },
  setUsers: (users: User[]) => {
    localStorage.setItem('rolex_mock_users', JSON.stringify(users));
  },
  getProducts: (): Product[] => {
    return JSON.parse(localStorage.getItem('rolex_mock_products') || '[]');
  },
  setProducts: (products: Product[]) => {
    localStorage.setItem('rolex_mock_products', JSON.stringify(products));
  },
  getOrders: (): Order[] => {
    return JSON.parse(localStorage.getItem('rolex_mock_orders') || '[]');
  },
  setOrders: (orders: Order[]) => {
    localStorage.setItem('rolex_mock_orders', JSON.stringify(orders));
  },
};

// Unified request runner that handles API vs Mock fallback
export async function apiCall<T>(
  requestFn: () => Promise<T>,
  mockFn: () => T
): Promise<T> {
  try {
    return await requestFn();
  } catch (error: any) {
    // Check if network error (e.g. backend offline)
    if (!error.response || error.code === 'ERR_NETWORK') {
      console.warn('Backend server offline. Running in graceful mock fallback mode.');
      return mockFn();
    }
    // If server responded with error, re-throw with readable message
    const message = error.response?.data?.message || error.message || 'Request failed';
    throw new Error(message);
  }
}
