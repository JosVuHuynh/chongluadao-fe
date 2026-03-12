const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/admin';

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
    const error: any = new Error("Vui lòng đăng nhập để tiếp tục");
    error.response = {
      data: {
        message: "Vui lòng đăng nhập để tiếp tục",
      },
    };
    throw error;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      const error: any = new Error(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại"
      );
      error.response = {
        status: 401,
        data: {
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại",
        },
      };
      throw error;
    }

    const error: any = new Error(
      responseData.message || `HTTP error! status: ${response.status}`
    );

    error.response = {
      status: response.status,
      data: responseData,
    };

    throw error;
  }

  return responseData;
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
  businessId?: string | number | null;
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
  businessId?: string | number | null;

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
  businessId?: string | number | null;

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
  logoUrl?: string | null;
  taxCode: string;
  phone: string;
  email: string;
  website?: string | null;
  address: string;
  description?: string | null;
  category?: string | null;

  plan: 'BASIC' | 'PREMIUM' | 'VIP';
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBadge: boolean;

  isTrusted: boolean;
  hasInsurance: boolean;

  facebookUrl?: string | null;
  messengerUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
  zaloUrl?: string | null;
  youtubeUrl?: string | null;

  ceoName?: string | null;
  ceoAvatarUrl?: string | null;

  rejectReason?: string | null;
  verifiedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface BusinessListResponse {
  data: Business[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getBusinesses = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  category?: string;
  isTrusted?: boolean;
  hasInsurance?: boolean;
}): Promise<BusinessListResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.q) queryParams.append('q', params.q);
  if (params.status) queryParams.append('status', params.status);
  if (params.category) queryParams.append('category', params.category);
  if (params.isTrusted !== undefined) {
    queryParams.append('isTrusted', params.isTrusted ? '1' : '0');
  }
  if (params.hasInsurance !== undefined) {
    queryParams.append('hasInsurance', params.hasInsurance ? '1' : '0');
  }

  return authenticatedFetch(`${API_BASE_URL}/businesses?${queryParams.toString()}`);
};

export const createBusiness = async (data: {
  name: string;
  logoUrl?: string | null;
  taxCode: string;
  phone: string;
  email: string;
  website?: string | null;
  address: string;
  description?: string | null;
  category?: string | null;

  plan: 'BASIC' | 'PREMIUM' | 'VIP';
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBadge?: boolean;

  isTrusted?: boolean;
  hasInsurance?: boolean;

  facebookUrl?: string | null;
  messengerUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
  zaloUrl?: string | null;
  youtubeUrl?: string | null;

  ceoName?: string | null;
  ceoAvatarUrl?: string | null;
}): Promise<Business> => {
  return authenticatedFetch(`${API_BASE_URL}/businesses`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateBusiness = async (id: number, data: {
  name?: string;
  logoUrl?: string | null;
  taxCode?: string;
  phone?: string;
  email?: string;
  website?: string | null;
  address?: string;
  description?: string | null;
  category?: string | null;

  plan?: 'BASIC' | 'PREMIUM' | 'VIP';
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBadge?: boolean;
  rejectReason?: string | null;

  isTrusted?: boolean;
  hasInsurance?: boolean;

  facebookUrl?: string | null;
  messengerUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
  zaloUrl?: string | null;
  youtubeUrl?: string | null;

  ceoName?: string | null;
  ceoAvatarUrl?: string | null;
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