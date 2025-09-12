import axiosInstance from './axiosConfig';
import {
  UserResponse
} from "../types/auth"; // adjust path based on your folder structure
import {
  WorkshopRequest,
  WorkshopResponse,
  
} from "../types/workshop"; // adjust path based on your folder structure
import { AxiosResponse } from 'axios';

export const workshopService = {
  // Get all workshops
  getAllWorkshops: (): Promise<AxiosResponse<WorkshopResponse[]>> =>
    axiosInstance.get('/workshops/search'),

  // Get workshop by ID
  getWorkshopById: (id: string): Promise<AxiosResponse<WorkshopResponse>> =>
    axiosInstance.get(`/workshops/search/by-id/${id}`),

  // Search workshops by title
  searchByTitle: (title: string): Promise<AxiosResponse<WorkshopResponse[]>> =>
    axiosInstance.get(`/workshops/search/by-title?title=${title}`),

  // Add new workshop
  addWorkshop: (workshopData: WorkshopRequest): Promise<AxiosResponse<WorkshopResponse>> =>
    axiosInstance.post('/workshops/add-workshop', workshopData),

  // Update workshop
  updateWorkshop: (
    id: string,
    data: Partial<WorkshopRequest>
  ): Promise<AxiosResponse<WorkshopResponse>> =>
    axiosInstance.put(`/workshops/update/${id}`, data),

  // Get participants of a workshop
  getParticipants: (workshopId: string): Promise<AxiosResponse<UserResponse[]>> =>
    axiosInstance.get(`/workshops/${workshopId}/participants`),

  // Add participant to workshop
  addParticipant: (workshopId: string, userId: string): Promise<AxiosResponse<void>> =>
    axiosInstance.post(`/workshops/${workshopId}/add-participants/${userId}`),

  // Remove participant from workshop
  removeParticipant: (workshopId: string, userId: string): Promise<AxiosResponse<void>> =>
    axiosInstance.delete(`/workshops/${workshopId}/remove-participants/${userId}`),

  // Delete workshop
  deleteWorkshop: (id: string): Promise<AxiosResponse<void>> =>
    axiosInstance.delete(`/workshops/${id}`),

  // Get all workshops by a participant
  getWorkshopsByParticipant: (participantId: string): Promise<AxiosResponse<WorkshopResponse[]>> =>
    axiosInstance.get(`/workshops/by-participant/${participantId}`),

  // Search workshops by date range
  searchByDateRange: (
    startDate: string,
    endDate: string
  ): Promise<AxiosResponse<WorkshopResponse[]>> =>
    axiosInstance.get(`/workshops/by-date-range?startDate=${startDate}&endDate=${endDate}`)
};




// import { WorkshopRequest } from '../types/workshop';
// import axiosInstance from './axiosConfig';


// export const workshopService = {
//   getAllWorkshops: () => axiosInstance.get('/workshops/search'),

//   getWorkshopById: (id : number | string) => axiosInstance.get(`/workshops/search/by-id/${id}`),

//   searchByTitle: (title : string ) => axiosInstance.get(`/workshops/search/by-title?title=${title}`),

//   addWorkshop: (workshopData: WorkshopRequest) => axiosInstance.post('/workshops/add-workshop', workshopData),

//   updateWorkshop: (id: number | string, data: Record<string, unknown>) => axiosInstance.put(`/workshops/update/${id}`, data),

//   getParticipants: (workshopId) => axiosInstance.get(`/workshops/${workshopId}/participants`),

//   addParticipant: (workshopId, userId) => 
//     axiosInstance.post(`/workshops/${workshopId}/add-participants/${userId}`),

//   removeParticipant: (workshopId, userId) => 
//     axiosInstance.delete(`/workshops/${workshopId}/remove-participants/${userId}`),

//   deleteWorkshop: (id) => axiosInstance.delete(`/workshops/${id}`),

//   getWorkshopsByParticipant: (participantId) => 
//   axiosInstance.get(`/workshops/by-participant/${participantId}`),

//   searchByDateRange: (startDate, endDate) => 
//     axiosInstance.get(`/workshops/by-date-range?startDate=${startDate}&endDate=${endDate}`)
// };


// export const workshopService = {
//   getAllWorkshops: () => api.get('/workshops/search'),
//   getWorkshopById: (id) => api.get(`/workshops/search/by-id/${id}`),
//   searchByTitle: (title) => api.get(`/workshops/search/by-title?title=${title}`),
//   addWorkshop: (workshopData) => api.post('/workshops/add-workshop', workshopData),
//   updateWorkshop: (id, data) => api.put(`/workshops/update/${id}`, data),
//   getParticipants: (workshopId) => api.get(`/workshops/${workshopId}/participants`),
//   addParticipant: (workshopId, userId) => 
//     api.post(`/workshops/${workshopId}/add-participants/${userId}`),
//   removeParticipant: (workshopId, userId) => 
//     api.delete(`/workshops/${workshopId}/remove-participants/${userId}`),
//   searchByDateRange: (startDate, endDate) => 
//     api.get(`/workshops/by-date-range?startDate=${startDate}&endDate=${endDate}`)
// };

