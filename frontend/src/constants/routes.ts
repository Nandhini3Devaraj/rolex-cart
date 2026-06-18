import { Permission, Role } from '@/types';

export interface RouteConfig {
  path: string;
  label: string;
  roles?: Role[];
  permissions?: Permission[];
}

export const ROUTE_CONFIG: RouteConfig[] = [
  { path: '/dashboard', label: 'Dashboard', roles: ['SuperAdmin', 'Manager', 'Staff', 'Customer'] },
  { path: '/users', label: 'Users', roles: ['SuperAdmin', 'Manager'], permissions: ['view:users'] },
  { path: '/orders', label: 'Orders', roles: ['SuperAdmin', 'Manager', 'Staff'], permissions: ['view:orders'] },
  { path: '/products', label: 'Products', roles: ['SuperAdmin', 'Manager', 'Staff'], permissions: ['view:products'] },
  { path: '/reports', label: 'Reports', roles: ['SuperAdmin', 'Manager'], permissions: ['view:reports'] },
  { path: '/settings', label: 'Settings', roles: ['SuperAdmin', 'Customer'], permissions: ['view:settings'] },
  { path: '/customer/my-orders', label: 'My Orders', roles: ['Customer'], permissions: ['customer:my-orders'] },
  { path: '/customer/cart', label: 'Cart', roles: ['Customer'], permissions: ['customer:cart'] },
  { path: '/customer/wishlist', label: 'Wishlist', roles: ['Customer'], permissions: ['customer:wishlist'] },
  { path: '/unauthorized', label: 'Access Denied' },
];

export function getRouteLabel(pathname: string): string {
  const exact = ROUTE_CONFIG.find((r) => r.path === pathname);
  if (exact) return exact.label;

  if (pathname.startsWith('/orders/')) return 'Order Details';
  if (pathname.startsWith('/products/')) return 'Product Details';

  const segment = pathname.split('/').filter(Boolean).pop();
  if (!segment) return 'Dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}
