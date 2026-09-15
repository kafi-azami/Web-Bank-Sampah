import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  config.headers['x-app-key'] = process.env.NEXT_PUBLIC_APP_KEY;

  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Kalau token expired/invalid, otomatis logout & redirect ke login
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry sekali kalau error 500 (kemungkinan koneksi DB terputus sesaat)
    if (error.response?.status === 500 && config && !config._retried) {
      config._retried = true;
      await new Promise((resolve) => setTimeout(resolve, 500));
      return apiClient(config);
    }

    // Token expired/invalid -> otomatis logout & redirect ke login
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('role');
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  },
);