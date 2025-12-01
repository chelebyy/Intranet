import axios from 'axios';

// API Base URL - will be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api';

// Create Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT: Send cookies with requests (HttpOnly JWT cookie)
});

// Request interceptor - Add birimId to headers if selected
apiClient.interceptors.request.use(
  (config) => {
    // Get selected birim from localStorage (persisted by Zustand)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.selectedBirim?.birimId) {
          config.headers['X-Birim-Id'] = state.selectedBirim.birimId.toString();
        }
      } catch (error) {
        console.error('Failed to parse auth storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors and unwrap ApiResponse
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('Unauthorized access - redirecting to login');
          if (window.location.pathname !== '/login') {
             window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden - insufficient permissions or IP blocked
          console.error('Access forbidden:', data.message || 'Insufficient permissions');
          break;
        case 404:
          console.error('Resource not found:', error.config.url);
          break;
        case 429:
          // Rate limit exceeded
          console.error('Too many requests - please wait');
          break;
        case 500:
        case 502:
        case 503:
          console.error('Server error - please try again later');
          break;
        default:
          console.error('API error:', data?.error?.message || data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - please check your connection');
    } else {
      // Something else happened
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
