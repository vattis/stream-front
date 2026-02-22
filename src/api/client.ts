import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const requestUrl = error.config?.url || '';
    // 로그아웃, 로그인, 현재 사용자 조회는 401이어도 리다이렉트하지 않음
    const skipRedirectPaths = ['/api/logout', '/api/login', '/api/me'];
    const shouldSkipRedirect = skipRedirectPaths.some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !shouldSkipRedirect) {
      // 토큰 만료 시 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
