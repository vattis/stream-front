import apiClient from './client';
import { SimpleProduct, DetailProduct, ProductComment, PageResponse } from '../types';

export const productApi = {
  getShopProducts: async (filter?: string, pageNo: number = 0): Promise<{
    discountProducts: PageResponse<SimpleProduct>;
    popularProducts: PageResponse<SimpleProduct>;
  }> => {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    params.append('pageNo', pageNo.toString());

    const response = await apiClient.get(`/api/shop/products?${params}`);
    return response.data;
  },

  getProduct: async (productId: number): Promise<{
    product: DetailProduct;
    comments: PageResponse<ProductComment>;
  }> => {
    const response = await apiClient.get(`/api/product/${productId}`);
    return response.data;
  },

  searchProducts: async (
    searchTag?: string,
    searchWord?: string,
    pageNo: number = 0
  ): Promise<PageResponse<SimpleProduct>> => {
    const params = new URLSearchParams();
    if (searchTag) params.append('tag', searchTag);
    if (searchWord) params.append('searchWord', searchWord);
    params.append('pageNo', pageNo.toString());

    const response = await apiClient.get(`/api/product/search?${params}`);
    return response.data;
  },

  addToCart: async (productId: number): Promise<void> => {
    await apiClient.post(`/shoppingCartProduct/${productId}`);
  },

  addProductComment: async (
    productId: number,
    content: string,
    rating: number
  ): Promise<void> => {
    await apiClient.post(`/productComment/${productId}`, new URLSearchParams({
      content,
      rating: rating.toString(),
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  deleteProductComment: async (commentId: number, productId: number): Promise<void> => {
    await apiClient.post(`/productComment/${commentId}`, new URLSearchParams({
      _method: 'delete',
      productId: productId.toString(),
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
};
