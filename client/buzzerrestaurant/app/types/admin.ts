export interface DashboardStats {
  users: {
    total: number;
  };
  restaurants: {
    total: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  categories: {
    total: number;
  };
  products: {
    total: number;
  };
  revenue: {
    total: number;
  };
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

