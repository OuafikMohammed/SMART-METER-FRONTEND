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
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'RESIDENT';
    fullName: string;
    managed_by?: number;
    first_name?: string;
    last_name?: string;
  };
}

export interface CurrentUserResponse {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'RESIDENT';
  fullName: string;
  managed_by?: number;
  first_name?: string;
  last_name?: string;
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
export async function apiRequest<T>(
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

    if (response.status === 204) {
      return {
        data: {} as T,
        status: 204,
      };
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data: any;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.warn(`[API] Expected JSON but received ${contentType}. Status: ${response.status}`);
      return {
        error: `Server error (${response.status}): The server did not return JSON. This often happens on 404 or 500 errors.`,
        status: response.status,
      };
    }

    return {
      data: response.ok ? data : undefined,
      error: !response.ok ? data.error || data.detail || `HTTP ${response.status}` : undefined,
      status: response.status,
    };
  } catch (error) {
    console.error('[API] Request failed:', error);
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

  register: (userData: any) =>
    apiRequest<any>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
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
    apiRequest<ResidentDashboardData>('/energy/resident/dashboard/', { token }),

  getReadings: (
    token: string,
    params?: { meter_id?: string; start_date?: string; end_date?: string; tariff_type?: string }
  ) => {
    const queryString = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as any).toString() : '';
    return apiRequest<ConsumptionReading[]>(`/energy/resident/readings/${queryString}`, { token });
  },

  createReading: (token: string, reading: ConsumptionReadingInput) =>
    apiRequest<ConsumptionReading>('/energy/resident/readings/', {
      token,
      method: 'POST',
      body: JSON.stringify(reading),
    }),

  updateReading: (token: string, readingId: number, reading: Partial<ConsumptionReadingInput>) =>
    apiRequest<ConsumptionReading>(`/energy/resident/readings/${readingId}/`, {
      token,
      method: 'PATCH',
      body: JSON.stringify(reading),
    }),

  deleteReading: (token: string, readingId: number) =>
    apiRequest<void>(`/energy/resident/readings/${readingId}/`, {
      token,
      method: 'DELETE',
    }),

  getHistory: (token: string, period: 'week' | 'month' | 'year' = 'month') =>
    apiRequest<{ count: number; period: string; total_kwh: number; avg_kwh: number; results: any[] }>(
      `/energy/resident/historique/?period=${period}`,
      { token }
    ),

  getAlerts: (token: string, status: 'all' | 'new' | 'acknowledged' = 'all') =>
    apiRequest<{ count: number; alertes_actives: number; alertes_acquittees: number; results: any[] }>(
      `/energy/resident/alertes/?status=${status}`,
      { token }
    ),

  acquitAlert: (token: string, alertId: number) =>
    apiRequest<any>(`/energy/alertes/${alertId}/acquitter/`, {
      token,
      method: 'POST',
    }),

  deleteAlert: (token: string, alertId: number) =>
    apiRequest<void>(`/energy/alertes/${alertId}/`, {
      token,
      method: 'DELETE',
    }),

  getChatHistory: (token: string) =>
    apiRequest<any[]>('/energy/chat/', { token }),

  sendChatMessage: (token: string, question: string) =>
    apiRequest<any>('/energy/chat/', {
      token,
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
};

// ==================== ADMIN API ====================

export const adminApi = {
  getResidents: (token: string) =>
    apiRequest<AdminResidentsListResponse>('/energy/admin/residents/', { token }),

  getResident: (token: string, residentId: number) =>
    apiRequest<Resident>(`/energy/admin/residents/${residentId}/`, { token }),

  createResident: (token: string, residentData: { email: string; first_name: string; last_name: string; password: string }) =>
    apiRequest<Resident>('/energy/admin/residents/', {
      token,
      method: 'POST',
      body: JSON.stringify(residentData),
    }),

  updateResident: (token: string, residentId: number, residentData: Partial<{ email: string; first_name: string; last_name: string; password: string }>) =>
    apiRequest<Resident>(`/energy/admin/residents/${residentId}/`, {
      token,
      method: 'PATCH',
      body: JSON.stringify(residentData),
    }),

  deleteResident: (token: string, residentId: number) =>
    apiRequest<void>(`/energy/admin/residents/${residentId}/`, {
      token,
      method: 'DELETE',
    }),

  getDashboard: (token: string) =>
    apiRequest<AdminDashboardData>('/energy/admin/dashboard/', { token }),

  getResidentReadings: (token: string, residentId: number, params?: any) => {
    const queryString = params ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as any).toString() : '';
    return apiRequest<ConsumptionReading[]>(`/energy/admin/residents/${residentId}/readings/${queryString}`, { token });
  },

  createResidentReading: (token: string, residentId: number, reading: ConsumptionReadingInput) =>
    apiRequest<ConsumptionReading>(`/energy/admin/residents/${residentId}/readings/`, {
      token,
      method: 'POST',
      body: JSON.stringify(reading),
    }),

  updateResidentReading: (token: string, residentId: number, readingId: number, reading: Partial<ConsumptionReadingInput>) =>
    apiRequest<ConsumptionReading>(`/energy/admin/residents/${residentId}/readings/${readingId}/`, {
      token,
      method: 'PATCH',
      body: JSON.stringify(reading),
    }),

  deleteResidentReading: (token: string, residentId: number, readingId: number) =>
    apiRequest<void>(`/energy/admin/residents/${residentId}/readings/${readingId}/`, {
      token,
      method: 'DELETE',
    }),
};

export const anomalyApi = {
  getAnomalies: (token: string) =>
    apiRequest<any>('/energy/anomalies/', { token }),

  markConsulted: (token: string, anomalyId: number) =>
    apiRequest<any>(`/energy/anomalies/${anomalyId}/marquer_consultee/`, { token, method: 'POST' }),

  markAcquitted: (token: string, anomalyId: number) =>
    apiRequest<any>(`/energy/anomalies/${anomalyId}/marquer_acquittee/`, { token, method: 'POST' }),
};

export default {
  authApi,
  residentApi,
  adminApi,
  anomalyApi,
};
