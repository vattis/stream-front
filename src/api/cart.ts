import apiClient from './client';
import { CartItem } from '../types';

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await apiClient.get('/api/shoppingCart');
    // 백엔드가 Page 객체를 반환하므로 content 배열 추출
    return response.data.content || [];
  },

  addToCart: async (productId: number): Promise<void> => {
    await apiClient.post(`/api/shoppingCart/${productId}`);
  },

  removeFromCart: async (cartItemId: number): Promise<void> => {
    await apiClient.delete(`/api/shoppingCart/${cartItemId}`);
  },

  checkout: async (): Promise<void> => {
    await apiClient.post('/api/order/checkout');
  },
};
