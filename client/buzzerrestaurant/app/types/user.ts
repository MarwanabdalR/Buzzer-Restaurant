export interface AdminUser {
  id: number;
  fullName: string;
  mobileNumber: string;
  email: string | null;
  image: string | null;
  type: string | null;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: AdminUser[];
}

