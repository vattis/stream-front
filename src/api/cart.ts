import apiClient from './client';
import { CartItem } from '../types';

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await apiClient.get('/api/shoppingCart');
    return response.data;
  },

  addToCart: async (productId: number): Promise<void> => {
    await apiClient.post(`/shoppingCartProduct/${productId}`);
  },

  removeFromCart: async (cartItemId: number): Promise<void> => {
    await apiClient.delete(`/api/shoppingCart/${cartItemId}`);
  },

  checkout: async (): Promise<void> => {
    await apiClient.post('/api/order/checkout');
  },
};
