import apiClient from './client';
import { LoginForm, SignUpForm, CurrentUser } from '../types';

export const authApi = {
  login: async (form: LoginForm): Promise<void> => {
    await apiClient.post(
      '/sign-in',
      new URLSearchParams({
        email: form.email,
        password: form.password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  },

  logout: async (): Promise<void> => {
    await apiClient.get('/log-out');
  },

  signUp: async (form: SignUpForm): Promise<void> => {
    await apiClient.post(
      '/sign-up',
      new URLSearchParams({
        email: form.email,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        nickname: form.nickname,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  },

  sendAuthEmail: async (email: string): Promise<number> => {
    const response = await apiClient.post(`/auth/sendEmail/${encodeURIComponent(email)}`);
    return response.data;
  },

  checkAuthCode: async (email: string, authCode: string): Promise<boolean> => {
    const response = await apiClient.get(`/auth/check/${encodeURIComponent(email)}/${authCode}`);
    return response.data;
  },

  getCurrentUser: async (): Promise<CurrentUser | null> => {
    try {
      const response = await apiClient.get('/api/me');
      return response.data;
    } catch {
      return null;
    }
  },
};
