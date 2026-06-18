export type Role = 'SuperAdmin' | 'Manager' | 'Staff' | 'Customer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id?: string;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderProduct {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  products: OrderProduct[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  shippingAddress?: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type Permission =
  | 'view:dashboard'
  | 'view:users'
  | 'create:users'
  | 'edit:users'
  | 'delete:users'
  | 'toggle:users-status'
  | 'view:orders'
  | 'edit:orders'
  | 'delete:orders'
  | 'update:orders-status'
  | 'view:products'
  | 'create:products'
  | 'edit:products'
  | 'delete:products'
  | 'view:reports'
  | 'export:reports'
  | 'view:settings'
  | 'manage:roles'
  | 'customer:cart'
  | 'customer:wishlist'
  | 'customer:my-orders';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
