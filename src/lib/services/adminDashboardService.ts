import { apiRequest, ApiResponse } from '../api';

export interface DailyConsumption {
  date: string;
  value: number;
}

export interface TopConsumer {
  resident: string;
  consumption: number;
}

export interface AdminDashboardResponse {
  total_consumption: number;
  active_residents: number;
  foyers_count: number;
  efficiency: number;
  daily_consumption: DailyConsumption[];
  top_consumers: TopConsumer[];
}

/**
 * Service to handle Admin Dashboard data fetching
 */
export const adminDashboardService = {
  /**
   * Fetches the admin dashboard data from the backend
   * @param token JWT access token
   * @returns AdminDashboardResponse
   */
  getDashboardData: async (token: string): Promise<AdminDashboardResponse> => {
    const response = await apiRequest<AdminDashboardResponse>('/energy/admin/dashboard/', { token });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('No data received from dashboard API');
    }
    
    return response.data;
  }
};
