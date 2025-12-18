import axios, {AxiosError, AxiosInstance} from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 20000, // 20 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status && error.response.status >= 500) {
      console.error('API server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
