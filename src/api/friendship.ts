import apiClient from './client';
import { Friendship, FriendRequest, PageResponse } from '../types';

export const friendshipApi = {
  getFriends: async (memberId: number): Promise<Friendship[]> => {
    const response = await apiClient.get(`/api/friendships/${memberId}`);
    return response.data;
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
