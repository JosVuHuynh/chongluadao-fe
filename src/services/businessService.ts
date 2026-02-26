const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface BusinessRegistration {
  name: string;
  taxCode: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  plan: 'BASIC' | 'PREMIUM' | 'VIP';
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