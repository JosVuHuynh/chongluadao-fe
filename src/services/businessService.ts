import { uploadImageToS3 } from "./reportService";
import { authenticatedFetch } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface BusinessRegistration {
   name: string;
  taxCode: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  category?: string;

  facebookUrl?: string;
  messengerUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  zaloUrl?: string;
  youtubeUrl?: string;

  ceoName?: string;
  ceoAvatarUrl?: string;

  plan?: "BASIC" | "PREMIUM" | "VIP";
  requestVerifiedBadge?: boolean;
}

export interface Business {
  id: number;
  name: string;
  taxCode: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  plan: 'BASIC' | 'PREMIUM' | 'VIP';
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBadge: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Public business registration (no auth required)
 */
export const registerBusiness = async (data: BusinessRegistration): Promise<Business> => {
  const response = await fetch(`${API_BASE_URL}/business/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Failed to register business');
  }

  return response.json();
};


export interface MyBusiness {
  id: number;
  name: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  logo_url: string | null;
  tax_code: string;
  email: string;
  phone: string;
  address: string;
  website: string | null;
  category: string | null;
  [key: string]: unknown;
}

/**
 * Business self-service: hồ sơ doanh nghiệp của tài khoản đang đăng nhập (role BUSINESS)
 */
export const getMyBusiness = async (): Promise<MyBusiness | null> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/business/mine`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể tải hồ sơ doanh nghiệp');
  }
  const result = await response.json();
  return result.data;
};

export const uploadImage = async (
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<string> => {
  const urls: string[] = [];
    const url = await uploadImageToS3(file);
    urls.push(url);
  return urls[0];
};