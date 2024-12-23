import axios from 'axios';
import { ensureValidToken } from './tokenUtils';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  });
  

// Add token to requests except for the login endpoint
API.interceptors.request.use(async (config) => {
    const loginEndpoint = '/token/';
    if (!config.url.endsWith(loginEndpoint)) {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from storage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error retrieving token:', error);
        }
    }
    return config;
});

// Retry failed requests with a token refresh
API.interceptors.response.use(
    (response) => response, // Pass successful responses
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 && // Unauthorized error
            !originalRequest._retry && // Prevent infinite retries
            !originalRequest.url.endsWith('/token/') // Skip for login endpoint
        ) {
            originalRequest._retry = true;

            try {
                const newToken = await ensureValidToken(); // Refresh the token
                if (newToken) {
                    localStorage.setItem('token', newToken); // Save the new token
                    API.defaults.headers.Authorization = `Bearer ${newToken}`; // Update default headers
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return API(originalRequest); // Retry the original request
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default API;
