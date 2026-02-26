// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers when token is refreshed
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthUser {
  email: string;
  name: string;
  role: string;
  id: number;
  phone: string;
  accessToken: string;
}

// Save auth data to localStorage
const saveAuthData = (data: LoginResponse) => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
};

// Get auth data from localStorage
export const getAuthData = (): { accessToken: string; user: User } | null => {
  const accessToken = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  
  if (accessToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      return { accessToken, user };
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Clear auth data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthData() !== null;
};

// Login function
export const login = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies (refresh_token)
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Email hoặc mật khẩu không đúng');
      } else if (response.status === 400) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      } else {
        throw new Error('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
      }
    }

    const data: LoginResponse = await response.json();
    
    // Save auth data to localStorage
    saveAuthData(data);

    // Return formatted user data
    return {
      email: data.user.email,
      name: data.user.fullName,
      role: data.user.role,
      id: data.user.id,
      phone: data.user.phone,
      accessToken: data.accessToken,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    // Call logout API if exists
    const authData = getAuthData();
    if (authData) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.accessToken}`,
        },
        credentials: 'include',
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local auth data
    clearAuthData();
  }
};

// Get current user from localStorage
export const getCurrentUser = (): AuthUser | null => {
  const authData = getAuthData();
  if (!authData) return null;

  return {
    email: authData.user.email,
    name: authData.user.fullName,
    role: authData.user.role,
    id: authData.user.id,
    phone: authData.user.phone,
    accessToken: authData.accessToken,
  };
};

// Register function
export const register = async (userData: RegisterRequest): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 400) {
        throw new Error(errorData.message || 'Thông tin đăng ký không hợp lệ');
      } else if (response.status === 409) {
        throw new Error('Email đã được sử dụng');
      } else {
        throw new Error('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
  }
};

// Refresh access token using refresh_token from cookies
export const refreshAccessToken = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Important: send cookies (refresh_token)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Unable to refresh token');
    }

    const data = await response.json();
    
    // Update access token in localStorage
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    }
    
    throw new Error('No access token in response');
  } catch (error) {
    // If refresh fails, clear auth data and force re-login
    clearAuthData();
    throw new Error('Session expired. Please login again.');
  }
};

// API call with authentication and auto token refresh
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const authData = getAuthData();
  
  if (!authData) {
    throw new Error('Unauthorized');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authData.accessToken}`,
    ...options.headers,
  };

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // If unauthorized (401), try to refresh token
  if (response.status === 401) {
    try {
      // Check if we're already refreshing
      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken: string) => {
            // Retry the original request with new token
            const retryHeaders = {
              ...headers,
              'Authorization': `Bearer ${newToken}`,
            };
            
            fetch(url, {
              ...options,
              headers: retryHeaders,
              credentials: 'include',
            })
              .then(resolve)
              .catch(reject);
          });
        });
      }

      // Set refreshing flag
      isRefreshing = true;

      // Try to refresh the token
      const newAccessToken = await refreshAccessToken();

      // Notify all subscribers
      onRefreshed(newAccessToken);
      isRefreshing = false;

      // Retry the original request with new token
      const retryHeaders = {
        ...headers,
        'Authorization': `Bearer ${newAccessToken}`,
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: 'include',
      });

      return response;
    } catch (error) {
      isRefreshing = false;
      clearAuthData();
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      
      throw new Error('Session expired. Please login again.');
    }
  }

  return response;
};