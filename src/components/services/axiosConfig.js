import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: if backend sends a refreshed token in Authorization header
// or in the response body (e.g. { token: '...' }), persist it to localStorage.
axiosInstance.interceptors.response.use(
  (response) => {
    try {
      const authHeader = response.headers && response.headers.authorization;
      if (authHeader && typeof authHeader === 'string') {
        const parts = authHeader.split(' ');
        const maybeToken = parts.length === 2 ? parts[1] : authHeader;
        if (maybeToken) localStorage.setItem('token', maybeToken);
      }

      // also check response body for common token fields
      const data = response.data || {};
      const tokenFromBody = data.token || data.jwt || data.accessToken;
      if (tokenFromBody) localStorage.setItem('token', tokenFromBody);
    } catch (e) {
      // ignore storage errors
    }
    return response;
  },
  (error) => {
    // If unauthorized, clear local token so app can react (optional)
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;