import axiosInstance from './axiosConfig';

export const userService = {
  getAllUsers: () => axiosInstance.get('/users/search'),
  getUserById: (id) => axiosInstance.get(`/users/search/by-id/${id}`),
  updateUser: (id, data) => axiosInstance.put(`/users/update/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/users/delete-account/${id}`),
  // updateProfile: (id, data) => axiosInstance.put(`/users/update/${id}`, data)
};