import axiosInstance from "./axiosConfig";

/**
 * User Service - Handles all user-related API operations
 * Methods for user profile management and admin operations
 */

const userService = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} - Current user data
   */
  async getCurrentUserProfile() {
    try {
      const response = await axiosInstance.get("/users/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user profile:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch user profile"
      );
    }
  },

  /**
   * Get user by ID
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} - User data
   */
  async getUserById(userId) {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  },

  /**
   * Update current user profile
   * @param {Object} userData - User data to update (firstName, lastName, phoneNumber, email, etc.)
   * @returns {Promise<Object>} - Updated user data
   */
  async updateProfile(userData) {
    try {
      const response = await axiosInstance.put("/users/profile", userData);

      // Update localStorage with new user data
      if (response.data) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },

  /**
   * Update user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Confirmation message
   */
  async updatePassword(currentPassword, newPassword) {
    try {
      const response = await axiosInstance.put("/users/password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update password"
      );
    }
  },

  /**
   * Get all users (Admin only)
   * @param {Object} params - Query parameters (page, limit, role, status)
   * @returns {Promise<Object>} - Paginated user list
   */
  async getAllUsers(params = {}) {
    try {
      const response = await axiosInstance.get("/users", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  },

  /**
   * Search users by name or email (Admin only)
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of matching users
   */
  async searchUsers(query) {
    try {
      const response = await axiosInstance.get("/users/search", {
        params: { query },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error searching users:", error);
      throw new Error(
        error.response?.data?.message || "Failed to search users"
      );
    }
  },

  /**
   * Get all participants (Admin only)
   * @returns {Promise<Array>} - Array of all participants
   */
  async getAllParticipants() {
    try {
      const response = await axiosInstance.get("/users/role/PARTICIPANT");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching participants:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch participants"
      );
    }
  },

  /**
   * Get all admins (Admin only)
   * @returns {Promise<Array>} - Array of all admins
   */
  async getAllAdmins() {
    try {
      const response = await axiosInstance.get("/users/role/ADMIN");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch admins"
      );
    }
  },

  /**
   * Update user (Admin only)
   * @param {string|number} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated user
   */
  async updateUser(userId, updates) {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, updates);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update user"
      );
    }
  },

  /**
   * Delete user (Admin only)
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} - Confirmation message
   */
  async deleteUser(userId) {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  },

  /**
   * Get user statistics (Admin only)
   * @returns {Promise<Object>} - User statistics
   */
  async getUserStatistics() {
    try {
      const response = await axiosInstance.get("/users/statistics");
      return response.data;
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch statistics"
      );
    }
  },

  /**
   * Get active users (Admin only)
   * @returns {Promise<Array>} - Array of active users
   */
  async getActiveUsers() {
    try {
      const response = await axiosInstance.get("/users/status/active");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching active users:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch active users"
      );
    }
  },

  /**
   * Get inactive users (Admin only)
   * @returns {Promise<Array>} - Array of inactive users
   */
  async getInactiveUsers() {
    try {
      const response = await axiosInstance.get("/users/status/inactive");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching inactive users:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch inactive users"
      );
    }
  },

  /**
   * Get user activity logs (Admin only)
   * @param {string|number} userId - User ID
   * @returns {Promise<Array>} - Array of activity logs
   */
  async getUserActivityLogs(userId) {
    try {
      const response = await axiosInstance.get(`/users/${userId}/activity`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch activity logs"
      );
    }
  },

  /**
   * Bulk update users (Admin only)
   * @param {Array} userIds - Array of user IDs
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Confirmation message
   */
  async bulkUpdateUsers(userIds, updates) {
    try {
      const response = await axiosInstance.put("/users/bulk", {
        userIds,
        updates,
      });
      return response.data;
    } catch (error) {
      console.error("Error bulk updating users:", error);
      throw new Error(
        error.response?.data?.message || "Failed to bulk update users"
      );
    }
  },

  /**
   * Bulk delete users (Admin only)
   * @param {Array} userIds - Array of user IDs to delete
   * @returns {Promise<Object>} - Confirmation message
   */
  async bulkDeleteUsers(userIds) {
    try {
      const response = await axiosInstance.delete("/users/bulk", {
        data: { userIds },
      });
      return response.data;
    } catch (error) {
      console.error("Error bulk deleting users:", error);
      throw new Error(
        error.response?.data?.message || "Failed to bulk delete users"
      );
    }
  },
};

export default userService;
