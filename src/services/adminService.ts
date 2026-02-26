const API_BASE_URL = 'http://localhost:3000/api/v1/admin';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  // Get token directly from localStorage (saved by authService)
  const token = localStorage.getItem('accessToken');
  return token;
};

// Helper function to make authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Vui lòng đăng nhập để tiếp tục');
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle unauthorized access
    if (response.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// ===== USER MANAGEMENT =====
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  items: T[];
}

export const getUsers = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  role?: string;
  isActive?: boolean;
}): Promise<PaginatedResponse<User>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.q) queryParams.append('q', params.q);
  if (params.role) queryParams.append('role', params.role);
  if (params.isActive !== undefined) queryParams.append('isActive', params.isActive ? '1' : '0');

  return authenticatedFetch(`${API_BASE_URL}/users?${queryParams.toString()}`);
};

export const getUserById = async (id: number): Promise<User> => {
  return authenticatedFetch(`${API_BASE_URL}/users/${id}`);
};

export const createUser = async (data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
}): Promise<User> => {
  return authenticatedFetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateUser = async (id: number, data: {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}): Promise<User> => {
  return authenticatedFetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  return authenticatedFetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
};

// ===== REPORT MANAGEMENT =====
export interface ScamType {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface Report {
  id: number;
  scamType: ScamType;
  scamTypeOther: string | null;
  phone: string;
  bankAccount: string;
  relatedLinks: string[];
  description: string;
  evidenceUrls: string[];
  reporterName: string;
  contactInfo: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface ReportPaginatedResponse {
  data: Report[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getReports = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}): Promise<ReportPaginatedResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.q) queryParams.append('q', params.q);
  if (params.status) queryParams.append('status', params.status);

  return authenticatedFetch(`${API_BASE_URL}/reports?${queryParams.toString()}`);
};

export const createReport = async (data: {
  scamTypeId: number;
  scamTypeOther?: string;
  phone: string;
  bankAccount: string;
  relatedLinks: string[];
  description: string;
  evidenceUrls: string[];
  reporterName: string;
  contactInfo: string;
}): Promise<Report> => {
  return authenticatedFetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateReport = async (id: number, data: {
  scamTypeId?: number;
  scamTypeOther?: string;
  phone?: string;
  bankAccount?: string;
  relatedLinks?: string[];
  description?: string;
  evidenceUrls?: string[];
  reporterName?: string;
  contactInfo?: string;
  status?: string;
}): Promise<Report> => {
  return authenticatedFetch(`${API_BASE_URL}/reports/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteReport = async (id: number): Promise<void> => {
  return authenticatedFetch(`${API_BASE_URL}/reports/${id}`, {
    method: 'DELETE',
  });
};

// ===== BUSINESS MANAGEMENT =====
export interface Business {
  id: number;
  name: string;
  taxCode: string;
  phone: string;
  email: string;
  website?: string;
  address: string;
  description: string;
  plan: 'BASIC' | 'PREMIUM' | 'VIP';
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBadge: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getBusinesses = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}): Promise<PaginatedResponse<Business>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.q) queryParams.append('q', params.q);
  if (params.status) queryParams.append('status', params.status);

  return authenticatedFetch(`${API_BASE_URL}/businesses?${queryParams.toString()}`);
};

export const createBusiness = async (data: {
  name: string;
  taxCode: string;
  phone: string;
  email: string;
  website?: string;
  address: string;
  description: string;
  plan: 'BASIC' | 'PREMIUM' | 'VIP';
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBadge?: boolean;
}): Promise<Business> => {
  return authenticatedFetch(`${API_BASE_URL}/businesses`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateBusiness = async (id: number, data: {
  name?: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  description?: string;
  plan?: 'BASIC' | 'PREMIUM' | 'VIP';
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBadge?: boolean;
}): Promise<Business> => {
  return authenticatedFetch(`${API_BASE_URL}/businesses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteBusiness = async (id: number): Promise<void> => {
  return authenticatedFetch(`${API_BASE_URL}/businesses/${id}`, {
    method: 'DELETE',
  });
};

// ===== NEWS MANAGEMENT =====
export interface News {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

export const getNews = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  isPublished?: boolean;
}): Promise<PaginatedResponse<News>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.q) queryParams.append('q', params.q);
  if (params.category) queryParams.append('category', params.category);
  if (params.isPublished !== undefined) queryParams.append('isPublished', params.isPublished ? '1' : '0');

  return authenticatedFetch(`${API_BASE_URL}/news?${queryParams.toString()}`);
};

export const createNews = async (data: {
  title: string;
  content: string;
  category: string;
  author: string;
  imageUrl?: string;
}): Promise<News> => {
  return authenticatedFetch(`${API_BASE_URL}/news`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateNews = async (id: number, data: {
  title?: string;
  content?: string;
  category?: string;
  author?: string;
  imageUrl?: string;
  isPublished?: boolean;
}): Promise<News> => {
  return authenticatedFetch(`${API_BASE_URL}/news/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteNews = async (id: number): Promise<void> => {
  return authenticatedFetch(`${API_BASE_URL}/news/${id}`, {
    method: 'DELETE',
  });
};

// ===== SHOP MANAGEMENT =====
export interface Shop {
  id: number;
  businessId: number;
  name: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: string;
}

export const getShops = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
}): Promise<PaginatedResponse<Shop>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.q) queryParams.append('q', params.q);
  if (params.isActive !== undefined) queryParams.append('isActive', params.isActive ? '1' : '0');

  return authenticatedFetch(`${API_BASE_URL}/shops?${queryParams.toString()}`);
};

export const updateShop = async (id: number, data: {
  name?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isActive?: boolean;
}): Promise<Shop> => {
  return authenticatedFetch(`${API_BASE_URL}/shops/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteShop = async (id: number): Promise<void> => {
  return authenticatedFetch(`${API_BASE_URL}/shops/${id}`, {
    method: 'DELETE',
  });
};

// ===== STATISTICS =====
export interface Statistics {
  totalUsers: number;
  totalReports: number;
  totalBusinesses: number;
  totalNews: number;
  totalShops: number;
  totalRevenue: number;
  recentActivity: {
    type: string;
    message: string;
    timestamp: string;
  }[];
}

export const getStatistics = async (): Promise<Statistics> => {
  return authenticatedFetch(`${API_BASE_URL}/statistics`);
};