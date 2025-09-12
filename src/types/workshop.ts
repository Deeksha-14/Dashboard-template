export interface WorkshopRequest {
  workshopTitle: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export interface WorkshopResponse extends WorkshopRequest {
  id: string;
}