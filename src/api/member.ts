import apiClient from './client';
import { ProfileDto, SimpleMember, MemberGame, PageResponse } from '../types';

export const memberApi = {
  getProfile: async (memberId: number, pageNo: number = 0): Promise<ProfileDto> => {
    const response = await apiClient.get(`/api/profile/${memberId}?commentPageNum=${pageNo}`);
    return response.data;
  },

  getLibrary: async (memberId: number): Promise<MemberGame[]> => {
    const response = await apiClient.get(`/api/library/${memberId}`);
    return response.data;
  },

  getLibraryGame: async (memberId: number, gameId: number): Promise<MemberGame> => {
    const response = await apiClient.get(`/api/library/${memberId}/${gameId}`);
    return response.data;
  },

  searchMembers: async (
    searchTag: string = 'nickname',
    searchWord: string = '',
    pageNo: number = 0
  ): Promise<PageResponse<SimpleMember>> => {
    const params = new URLSearchParams({
      searchTag,
      searchWord,
      pageNo: pageNo.toString(),
    });
    const response = await apiClient.get(`/api/members?${params}`);
    return response.data;
  },

  addProfileComment: async (
    profileId: number,
    content: string
  ): Promise<void> => {
    await apiClient.post('/profileComment', new URLSearchParams({
      profileId: profileId.toString(),
      content,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  deleteProfileComment: async (commentId: number, profileId: number): Promise<void> => {
    await apiClient.post(`/profileComment/${commentId}`, new URLSearchParams({
      _method: 'delete',
      profileId: profileId.toString(),
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
};
