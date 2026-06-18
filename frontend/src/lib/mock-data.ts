import { User, Product, Order } from '@/types';

export const MOCK_USERS: User[] = [
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
];

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'p-1',
    name: 'Rolex Submariner Date',
    description: 'The Oyster Perpetual Submariner Date in Oystersteel with a Cerachrom bezel insert in black ceramic.',
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
    description: 'The Oyster Perpetual Cosmograph Daytona in Oystersteel with a white dial and Oyster bracelet.',
    category: 'Watches',
    price: 24500,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    _id: 'o-1',
    customer: { _id: 'u-customer-1', name: 'John Customer', email: 'customer@rolex.com' },
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
];
