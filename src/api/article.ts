import apiClient from './client';
import { Article, PageResponse } from '../types';

export interface ArticleComment {
  id: number;
  content: string;
  memberId: number;
  nickname: string;
  avatarUrl?: string;
  createdTime: string;
}

export const articleApi = {
  getArticle: async (
    articleId: number,
  ): Promise<{
    article: Article;
    comments: PageResponse<ArticleComment>;
  }> => {
    const response = await apiClient.get(`/api/article/${articleId}`);
    return response.data;
  },

  searchArticles: async (
    galleryId: number,
    searchTag?: string,
    searchWord?: string,
    pageNo: number = 0,
  ): Promise<PageResponse<Article>> => {
    const params = new URLSearchParams();
    params.append('galleryId', galleryId.toString());
    if (searchTag) params.append('tag', searchTag);
    if (searchWord) params.append('searchWord', searchWord);
    params.append('pageNo', pageNo.toString());

    const response = await apiClient.get(`/api/article/search?${params}`);
    return response.data;
  },

  createArticle: async (galleryId: number, title: string, content: string): Promise<number> => {
    const response = await apiClient.post('/api/article', {
      galleryId,
      title,
      content,
    });
    return response.data;
  },

  deleteArticle: async (articleId: number, galleryId: number): Promise<void> => {
    await apiClient.delete(`/api/article/${articleId}?galleryId=${galleryId}`);
  },

  addArticleComment: async (articleId: number, content: string): Promise<void> => {
    await apiClient.post(`/api/article/${articleId}/comment`, { content });
  },

  deleteArticleComment: async (commentId: number, articleId: number): Promise<void> => {
    await apiClient.delete(`/api/article/comment/${commentId}?articleId=${articleId}`);
  },
};
