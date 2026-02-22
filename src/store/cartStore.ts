import { create } from 'zustand';
import { CartItem } from '../types';
import { cartApi } from '../api/cart';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  checkout: () => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const items = await cartApi.getCart();
      set({ items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: number) => {
    await cartApi.addToCart(productId);
    await get().fetchCart();
  },

  removeFromCart: async (cartItemId: number) => {
    await cartApi.removeFromCart(cartItemId);
    set((state) => ({
      items: state.items.filter((item) => item.id !== cartItemId),
    }));
  },

  checkout: async () => {
    await cartApi.checkout();
    set({ items: [] });
  },

  clearCart: () => {
    set({ items: [] });
  },
}));
