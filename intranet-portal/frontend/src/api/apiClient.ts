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
    // Check if response has ApiResponse structure { success, data, message }
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      // If success is true, return the inner data
      if (response.data.success) {
        // Modify response.data to be the inner data directly
        // This makes existing code like response.data work as expected
        // BUT we need to be careful. Most axios calls expect response.data to be the payload.
        // With wrapper, payload is response.data.data
        
        // IMPORTANT: We are modifying the response object that gets returned to caller
        // We replace response.data with response.data.data
        const originalData = response.data;
        response.data = originalData.data;
        
        // We can attach the message to the response object if needed
        // @ts-ignore
        response.message = originalData.message;
      } else {
        // If success is false, throw an error
        return Promise.reject({
          response: {
            status: response.status,
            data: response.data // This contains { success: false, error: ... }
          },
          message: response.data.error?.message || response.data.message || 'Operation failed'
        });
      }
    }
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
