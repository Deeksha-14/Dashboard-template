export interface UserRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  phoneNumber?: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
}

export interface RegisterRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}