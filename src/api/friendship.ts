import apiClient from './client';
import { Friendship, FriendRequest, PageResponse } from '../types';

export const friendshipApi = {
  getFriends: async (memberId: number): Promise<Friendship[]> => {
    const response = await apiClient.get(`/api/friendships/${memberId}`);
    // 백엔드가 Page 객체를 반환하므로 content 배열 추출
    return response.data.content || [];
  },

  getReceivedRequests: async (): Promise<FriendRequest[]> => {
    const response = await apiClient.get('/api/friendships/received');
    return response.data;
  },

  sendFriendRequest: async (toMemberId: number): Promise<void> => {
    await apiClient.post(`/api/friendships/request/${toMemberId}`);
  },

  acceptFriendRequest: async (requestId: number): Promise<void> => {
    await apiClient.post(`/api/friendships/accept/${requestId}`);
  },

  rejectFriendRequest: async (requestId: number): Promise<void> => {
    await apiClient.post(`/api/friendships/reject/${requestId}`);
  },

  removeFriend: async (friendshipId: number): Promise<void> => {
    await apiClient.delete(`/api/friendships/${friendshipId}`);
  },
};
