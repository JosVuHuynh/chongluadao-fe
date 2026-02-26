const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
;

// Search result types
export interface Business {
  id: number;
  name: string;
  taxCode: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description: string;
  plan: 'BASIC' | 'PREMIUM' | 'VIP';
  isTrusted: number;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt: string | null;
  verifiedBadge?: number;  // 1 = show verified badge, 0 = no badge
  verified_badge?: number; // snake_case version from API
}

export interface Scam {
  phone: string;
  status: 'WARNING' | 'DANGER' | 'SAFE';
  reason: string;
  totalReports: number;
  latestReportedAt: string;
  evidenceUrls: string[];
  relatedLinks: string[];
}

export interface SearchResponse {
  query: {
    q: string;
    page: number;
    limit: number;
  };
  businesses: Business[];
  scams: Scam[];
  pagination: {
    businesses: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
    scams: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

/**
 * Search for businesses and scams by query
 * @param query - Search query (phone, business name, website, etc.)
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 */
export const search = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchResponse> => {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể tra cứu thông tin');
    }

    const data = await response.json();
    
    // Normalize business data - convert snake_case to camelCase
    if (data.businesses && Array.isArray(data.businesses)) {
      data.businesses = data.businesses.map((business: any) => ({
        ...business,
        taxCode: business.tax_code || business.taxCode,
        // Map verifyBadge (from API) to verifiedBadge
        verifiedBadge: business.verifyBadge ?? business.verified_badge ?? business.verifiedBadge ?? 0,
        verifiedAt: business.verified_at || business.verifiedAt,
      }));
    }
    
    // Normalize scam data - convert snake_case to camelCase
    if (data.scams && Array.isArray(data.scams)) {
      data.scams = data.scams.map((scam: any) => ({
        ...scam,
        latestReportedAt: scam.latest_reported_at || scam.latestReportedAt,
        totalReports: scam.total_reports ?? scam.totalReports ?? 0,
        evidenceUrls: scam.evidence_urls || scam.evidenceUrls || [],
        relatedLinks: scam.related_links || scam.relatedLinks || [],
      }));
    }
    
    return data;
  } catch (error: any) {
    console.error('Search error:', error);
    throw new Error(error.message || 'Lỗi khi tra cứu thông tin');
  }
};