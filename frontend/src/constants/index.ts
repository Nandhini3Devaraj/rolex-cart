import { Permission, Role } from '../types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SuperAdmin: [
    'view:dashboard',
    'view:users',
    'create:users',
    'edit:users',
    'delete:users',
    'toggle:users-status',
    'view:orders',
    'edit:orders',
    'delete:orders',
    'update:orders-status',
    'view:products',
    'create:products',
    'edit:products',
    'delete:products',
    'view:reports',
    'export:reports',
    'view:settings',
    'manage:roles',
  ],
  Manager: [
    'view:dashboard',
    'view:orders',
    'edit:orders',
    'update:orders-status',
    'view:products',
    'create:products',
    'edit:products',
    'view:reports',
    'export:reports',
  ],
  Staff: [
    'view:dashboard',
    'view:orders',
    'view:products',
  ],
  Customer: [
    'view:dashboard',
    'view:settings',
    'customer:cart',
    'customer:wishlist',
    'customer:my-orders',
  ],
};

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  roles: Role[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutGrid',
    roles: ['SuperAdmin', 'Manager', 'Staff', 'Customer'],
  },
  {
    name: 'Users',
    href: '/users',
    icon: 'Users',
    roles: ['SuperAdmin'],
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: 'Activity',
    roles: ['SuperAdmin', 'Manager', 'Staff'],
  },
  {
    name: 'My Orders',
    href: '/customer/my-orders',
    icon: 'FolderKanban',
    roles: ['Customer'],
  },
  {
    name: 'Cart',
    href: '/customer/cart',
    icon: 'ShoppingBag',
    roles: ['Customer'],
  },
  {
    name: 'Products',
    href: '/products',
    icon: 'Package',
    roles: ['SuperAdmin', 'Manager', 'Staff'],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: 'BarChart3',
    roles: ['SuperAdmin', 'Manager'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: 'Settings',
    roles: ['SuperAdmin'],
  },
  {
    name: 'Profile',
    href: '/settings',
    icon: 'UserCircle',
    roles: ['Customer'],
  },
  {
    name: 'Wishlist',
    href: '/customer/wishlist',
    icon: 'Heart',
    roles: ['Customer'],
  },
];
