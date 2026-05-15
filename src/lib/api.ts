/**
 * SmartMeter API Service
 * Centralized API communication layer for frontend-backend integration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// ==================== AUTH TYPES ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    role: 'ADMIN' | 'RESIDENT';
    managed_by?: number;
    first_name: string;
    last_name: string;
  };
}

export interface CurrentUserResponse {
  id: number;
  email: string;
  role: 'ADMIN' | 'RESIDENT';
  managed_by?: number;
  first_name: string;
  last_name: string;
}

// ==================== CONSUMPTION READING TYPES ====================

export interface ConsumptionReading {
  id: number;
  resident_id: number;
  meter_id: string;
  timestamp: string;
  consumption_kwh: number;
  cost_estimate: number;
  tariff_type: 'standard' | 'peak' | 'off_peak';
  created_at: string;
  updated_at: string;
}

export interface ConsumptionReadingInput {
  meter_id: string;
  timestamp: string;
  consumption_kwh: number;
  tariff_type?: 'standard' | 'peak' | 'off_peak';
}

// ==================== RESIDENT TYPES ====================

export interface Resident {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'RESIDENT';
  meter_id?: string;
}

export interface ResidentDashboardData {
  resident_email: string;
  meter_id: string;
  total_consumption_kwh: number;
  total_cost_estimate: number;
  average_daily_consumption: number;
  readings: ConsumptionReading[];
}

// ==================== ADMIN TYPES ====================

export interface AdminResidentsListResponse {
  count: number;
  residents: Resident[];
}

export interface ResidentStats {
  email: string;
  meter_id: string;
  total_consumption_kwh: number;
  total_cost_estimate: number;
}

export interface ConsumptionByDay {
  date: string;
  total_consumption_kwh: number;
}

export interface AdminDashboardData {
  admin_email: string;
  total_residents: number;
  total_consumption_kwh: number;
  total_cost_estimate: number;
  average_consumption_per_resident: number;
  residents: ResidentStats[];
  consumption_by_day: ConsumptionByDay[];
}

// ==================== API METHODS ====================

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiResponse<T>> {
  const { token, ...requestOptions } = options;
  
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((requestOptions.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...requestOptions,
      headers,
    });

    const data = await response.json();

    return {
      data: response.ok ? data : undefined,
      error: !response.ok ? data.error || `HTTP ${response.status}` : undefined,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// ==================== AUTH API ====================

export const authApi = {
  login: (credentials: LoginRequest) =>
    apiRequest<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  refreshToken: (refresh: string) =>
    apiRequest<{ access: string }>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }),

  getCurrentUser: (token: string) =>
    apiRequest<CurrentUserResponse>('/auth/me/', { token }),
};

// ==================== RESIDENT API ====================

export const residentApi = {
  getDashboard: (token: string) =>
    apiRequest<ResidentDashboardData>('/resident/dashboard/', { token }),

  getReadings: (
    token: string,
    params?: { meter_id?: string; start_date?: string; end_date?: string; tariff_type?: string }
  ) => {
    const queryString = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as any).toString() : '';
    return apiRequest<ConsumptionReading[]>(`/resident/readings/${queryString}`, { token });
  },

  createReading: (token: string, reading: ConsumptionReadingInput) =>
    apiRequest<ConsumptionReading>('/resident/readings/', {
      token,
      method: 'POST',
      body: JSON.stringify(reading),
    }),

  updateReading: (token: string, readingId: number, reading: Partial<ConsumptionReadingInput>) =>
    apiRequest<ConsumptionReading>(`/resident/readings/${readingId}/`, {
      token,
      method: 'PATCH',
      body: JSON.stringify(reading),
    }),

  deleteReading: (token: string, readingId: number) =>
    apiRequest<void>(`/resident/readings/${readingId}/`, {
      token,
      method: 'DELETE',
    }),
};

// ==================== ADMIN API ====================

export const adminApi = {
  getResidents: (token: string) =>
    apiRequest<AdminResidentsListResponse>('/admin/residents/', { token }),

  getResident: (token: string, residentId: number) =>
    apiRequest<Resident>(`/admin/residents/${residentId}/`, { token }),

  createResident: (token: string, residentData: { email: string; first_name: string; last_name: string; password: string }) =>
    apiRequest<Resident>('/admin/residents/', {
      token,
      method: 'POST',
      body: JSON.stringify(residentData),
    }),

  updateResident: (token: string, residentId: number, residentData: Partial<{ email: string; first_name: string; last_name: string; password: string }>) =>
    apiRequest<Resident>(`/admin/residents/${residentId}/`, {
      token,
      method: 'PATCH',
      body: JSON.stringify(residentData),
    }),

  deleteResident: (token: string, residentId: number) =>
    apiRequest<void>(`/admin/residents/${residentId}/`, {
      token,
      method: 'DELETE',
    }),

  getDashboard: (token: string) =>
    apiRequest<AdminDashboardData>('/admin/dashboard/', { token }),

  getResidentReadings: (token: string, residentId: number, params?: any) => {
    const queryString = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as any).toString() : '';
    return apiRequest<ConsumptionReading[]>(`/admin/residents/${residentId}/readings/${queryString}`, { token });
  },

  createResidentReading: (token: string, residentId: number, reading: ConsumptionReadingInput) =>
    apiRequest<ConsumptionReading>(`/admin/residents/${residentId}/readings/`, {
      token,
      method: 'POST',
      body: JSON.stringify(reading),
    }),

  updateResidentReading: (token: string, residentId: number, readingId: number, reading: Partial<ConsumptionReadingInput>) =>
    apiRequest<ConsumptionReading>(`/admin/residents/${residentId}/readings/${readingId}/`, {
      token,
      method: 'PATCH',
      body: JSON.stringify(reading),
    }),

  deleteResidentReading: (token: string, residentId: number, readingId: number) =>
    apiRequest<void>(`/admin/residents/${residentId}/readings/${readingId}/`, {
      token,
      method: 'DELETE',
    }),
};

export default {
  authApi,
  residentApi,
  adminApi,
};
