import axios from 'axios';

import { validateToken, displayRemainingSessionTime } from './jwt';

// Create axios instance
const axiosInstance = axios.create();

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      if (!validateToken(token)) {
        // Token is expired, remove it and redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/sign-in';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
      
      // Display remaining session time with styling
      displayRemainingSessionTime(token);
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized responses
      if (error.response.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/sign-in';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
      
      // Handle other error responses
      const errorMessage = error.response.data?.message || 'An error occurred';
      console.error('API Error:', errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    
    // Handle network errors
    if (error.request) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle other errors
    console.error('Error:', error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance; 