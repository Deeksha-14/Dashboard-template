import axiosInstance from "./axiosConfig";

/**
 * Auth Service - Handles all authentication operations
 * Methods for login, register, logout, and user session management
 */

const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<AuthResponseDTO>} - JWT and user data
   */
  async login(email, password) {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const data = response.data;

      // Store JWT and user info
      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data));
      }

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  },

  /**
   * Register new user
   * @param {RegisterRequestDTO} userData - User registration data
   * @returns {Promise<AuthResponseDTO>} - JWT and user data
   */
  async register(userData) {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      const data = response.data;

      // Auto-login after successful registration
      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data));
      }

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Registration failed. Please check your details."
      );
    }
  },

  /**
   * Logout user - Clear session
   */
  logout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} - User object or null if not logged in
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid JWT
   */
  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  },

  /**
   * Check if current user has specific role
   * @param {string|string[]} roles - Single role or array of roles to check
   * @returns {boolean} - True if user has one of the roles
   */
  hasRole(roles) {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;

    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(user.role);
  },

  /**
   * Get JWT token
   * @returns {string|null} - JWT token or null
   */
  getToken() {
    return localStorage.getItem("token");
  },

  /**
   * Verify token is still valid (check expiration if needed)
   * @returns {boolean} - True if token exists and valid
   */
  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode JWT to check expiration
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
