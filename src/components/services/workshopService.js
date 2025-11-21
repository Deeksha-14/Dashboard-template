import axiosInstance from "./axiosConfig";

/**
 * Workshop Service - Handles all workshop-related API operations
 * Methods for CRUD operations, searching, and participant management
 */

const workshopService = {
  /**
   * Get all available workshops
   * @returns {Promise<Array>} - Array of all workshops
   */
  async getAllWorkshops() {
    try {
      const response = await axiosInstance.get("/workshops");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching all workshops:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch workshops"
      );
    }
  },

  /**
   * Get workshops for a specific participant (enrolled)
   * @param {string|number} participantId - Participant ID
   * @returns {Promise<Array>} - Array of workshops for the participant
   */
  async getWorkshopsByParticipant(participantId) {
    try {
      const response = await axiosInstance.get(
        `/workshops/participant/${participantId}`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching participant workshops:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch your workshops"
      );
    }
  },

  /**
   * Search workshops by date range
   * @param {string} startDate - Start date (ISO format: YYYY-MM-DD)
   * @param {string} endDate - End date (ISO format: YYYY-MM-DD)
   * @returns {Promise<Array>} - Array of workshops within date range
   */
  async searchByDateRange(startDate, endDate) {
    try {
      const response = await axiosInstance.get("/workshops/search", {
        params: { startDate, endDate },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error searching workshops by date:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to search workshops"
      );
    }
  },

  /**
   * Search workshops by title
   * @param {string} title - Workshop title (partial match)
   * @returns {Promise<Array>} - Array of matching workshops
   */
  async searchByTitle(title) {
    try {
      const response = await axiosInstance.get("/workshops/search/title", {
        params: { title },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error searching workshops by title:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to search workshops"
      );
    }
  },

  /**
   * Get workshop by ID
   * @param {string|number} workshopId - Workshop ID
   * @returns {Promise<Object>} - Workshop details
   */
  async getWorkshopById(workshopId) {
    try {
      const response = await axiosInstance.get(`/workshops/${workshopId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching workshop:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch workshop details"
      );
    }
  },

  /**
   * Add participant to workshop (enrollment)
   * @param {string|number} workshopId - Workshop ID
   * @param {string|number} participantId - Participant ID
   * @returns {Promise<Object>} - Updated workshop data
   */
  async addParticipant(workshopId, participantId) {
    try {
      const response = await axiosInstance.post(
        `/workshops/${workshopId}/participants`,
        { participantId }
      );
      return response.data;
    } catch (error) {
      console.error("Error enrolling in workshop:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to enroll in workshop"
      );
    }
  },

  /**
   * Remove participant from workshop (unenroll)
   * @param {string|number} workshopId - Workshop ID
   * @param {string|number} participantId - Participant ID
   * @returns {Promise<Object>} - Updated workshop data
   */
  async removeParticipant(workshopId, participantId) {
    try {
      const response = await axiosInstance.delete(
        `/workshops/${workshopId}/participants/${participantId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing from workshop:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to remove from workshop"
      );
    }
  },

  /**
   * Get active workshops (ongoing)
   * @returns {Promise<Array>} - Array of active workshops
   */
  async getActiveWorkshops() {
    try {
      const response = await axiosInstance.get("/workshops/active");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching active workshops:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch active workshops"
      );
    }
  },

  /**
   * Get upcoming workshops (not started yet)
   * @returns {Promise<Array>} - Array of upcoming workshops
   */
  async getUpcomingWorkshops() {
    try {
      const response = await axiosInstance.get("/workshops/upcoming");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming workshops:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch upcoming workshops"
      );
    }
  },

  /**
   * Get completed workshops
   * @returns {Promise<Array>} - Array of completed workshops
   */
  async getCompletedWorkshops() {
    try {
      const response = await axiosInstance.get("/workshops/completed");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching completed workshops:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch completed workshops"
      );
    }
  },

  /**
   * Get workshop participants
   * @param {string|number} workshopId - Workshop ID
   * @returns {Promise<Array>} - Array of participants
   */
  async getWorkshopParticipants(workshopId) {
    try {
      const response = await axiosInstance.get(
        `/workshops/${workshopId}/participants`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching workshop participants:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch participants"
      );
    }
  },

  /**
   * Create new workshop (Admin only)
   * @param {Object} workshopData - Workshop details
   * @returns {Promise<Object>} - Created workshop
   */
  async createWorkshop(workshopData) {
    try {
      const response = await axiosInstance.post("/workshops", workshopData);
      return response.data;
    } catch (error) {
      console.error("Error creating workshop:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create workshop"
      );
    }
  },

  /**
   * Update workshop (Admin only)
   * @param {string|number} workshopId - Workshop ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated workshop
   */
  async updateWorkshop(workshopId, updates) {
    try {
      const response = await axiosInstance.put(
        `/workshops/${workshopId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error("Error updating workshop:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update workshop"
      );
    }
  },

  /**
   * Delete workshop (Admin only)
   * @param {string|number} workshopId - Workshop ID
   * @returns {Promise<Object>} - Confirmation message
   */
  async deleteWorkshop(workshopId) {
    try {
      const response = await axiosInstance.delete(`/workshops/${workshopId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting workshop:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete workshop"
      );
    }
  },
};

export default workshopService;
