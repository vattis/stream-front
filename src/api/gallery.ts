import apiClient from './client';
import { Gallery, Article, PageResponse } from '../types';

export const galleryApi = {
  getGalleries: async (pageNo: number = 0): Promise<PageResponse<Gallery>> => {
    const response = await apiClient.get(`/api/galleries?pageNo=${pageNo}`);
    return response.data;
  },

  getGallery: async (galleryId: number): Promise<Gallery> => {
    const response = await apiClient.get(`/api/gallery/${galleryId}`);
    return response.data;
  },

  searchGalleries: async (
    searchWord: string,
    pageNo: number = 0,
  ): Promise<PageResponse<Gallery>> => {
    const response = await apiClient.get(
      `/api/gallery/search?searchWord=${searchWord}&pageNo=${pageNo}`,
    );
    return response.data;
  },

  getGalleryArticles: async (
    galleryId: number,
    pageNo: number = 0,
  ): Promise<PageResponse<Article>> => {
    const response = await apiClient.get(`/api/gallery/${galleryId}/articles?pageNo=${pageNo}`);
    return response.data;
  },
};
