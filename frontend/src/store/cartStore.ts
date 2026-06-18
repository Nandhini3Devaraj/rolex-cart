import { CartItem } from '@/types';

const CART_KEY = 'rolex_cart';
const WISHLIST_KEY = 'rolex_wishlist';

export const cartStore = {
  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  },
  setCart(items: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },
  getWishlist() {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  },
  setWishlist(items: unknown[]) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  },
};
