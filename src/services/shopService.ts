import { authenticatedFetch } from "./authService";
import { uploadImageToS3 } from "./reportService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Shop {
  id: number;
  businessId: number;
  businessName: string;
  name: string;
  slug: string;
  category: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  shortDescription: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  province: string | null;
  district: string | null;
  address: string | null;
  status: ModerationStatus;
  rejectionReason: string | null;
  isFeatured: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShopDetail extends Shop {
  products: Product[];
}

export interface Product {
  id: number;
  shopId: number;
  shopName: string;
  businessId: number;
  businessName: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  sales: number;
  imageUrl: string | null;
  buyUrl: string | null;
  description: string | null;
  status: ModerationStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
}

async function parseErrorOrThrow(response: Response, fallbackMessage: string): Promise<never> {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || fallbackMessage);
}

/* ---------- Public ---------- */

export const getShops = async (params: { q?: string; category?: string; page?: number; limit?: number } = {}): Promise<Paginated<Shop>> => {
  const query = new URLSearchParams();
  if (params.q) query.append("q", params.q);
  if (params.category) query.append("category", params.category);
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));

  const response = await fetch(`${API_BASE_URL}/shops?${query.toString()}`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải danh sách cửa hàng");
  return response.json();
};

export const getShopById = async (id: number): Promise<ShopDetail> => {
  const response = await fetch(`${API_BASE_URL}/shops/${id}`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải thông tin cửa hàng");
  return response.json();
};

/* ---------- Business self-service ---------- */

export interface ShopInput {
  name: string;
  category?: string;
  logoUrl?: string;
  coverUrl?: string;
  shortDescription?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  province?: string;
  district?: string;
  address?: string;
}

export const getMyShop = async (): Promise<Shop | null> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/shops/mine`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải cửa hàng của bạn");
  const result = await response.json();
  return result.data;
};

export const createShop = async (data: ShopInput): Promise<Shop> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/shops`, { method: "POST", body: JSON.stringify(data) });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tạo cửa hàng");
  return response.json();
};

export const updateShop = async (id: number, data: Partial<ShopInput>): Promise<Shop> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/shops/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể cập nhật cửa hàng");
  return response.json();
};

export interface ProductInput {
  name: string;
  category?: string;
  price: number;
  stock?: number;
  sales?: number;
  imageUrl?: string;
  buyUrl?: string;
  description?: string;
}

export const getMyProducts = async (params: { page?: number; limit?: number } = {}): Promise<Paginated<Product>> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));

  const response = await authenticatedFetch(`${API_BASE_URL}/products/mine?${query.toString()}`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải sản phẩm của bạn");
  return response.json();
};

export const createProduct = async (data: ProductInput): Promise<Product> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/products`, { method: "POST", body: JSON.stringify(data) });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể thêm sản phẩm");
  return response.json();
};

export const updateProduct = async (id: number, data: Partial<ProductInput>): Promise<Product> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/products/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể cập nhật sản phẩm");
  return response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể xóa sản phẩm");
};

/* ---------- Admin ---------- */

export const adminGetShops = async (params: { q?: string; status?: ModerationStatus; page?: number; limit?: number } = {}): Promise<Paginated<Shop>> => {
  const query = new URLSearchParams();
  if (params.q) query.append("q", params.q);
  if (params.status) query.append("status", params.status);
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));

  const response = await authenticatedFetch(`${API_BASE_URL}/admin/shops?${query.toString()}`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải danh sách cửa hàng");
  return response.json();
};

export const adminApproveShop = async (id: number): Promise<Shop> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/admin/shops/${id}/approve`, { method: "PATCH" });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể duyệt cửa hàng");
  return response.json();
};

export const adminRejectShop = async (id: number, reason: string): Promise<Shop> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/admin/shops/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể từ chối cửa hàng");
  return response.json();
};

export const adminSetShopFeatured = async (id: number, isFeatured: boolean): Promise<Shop> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/admin/shops/${id}/feature`, { method: "PATCH", body: JSON.stringify({ isFeatured }) });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể cập nhật cửa hàng nổi bật");
  return response.json();
};

export const adminDeleteShop = async (id: number): Promise<void> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/admin/shops/${id}`, { method: "DELETE" });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể xóa cửa hàng");
};

export const adminGetProducts = async (params: { q?: string; status?: ModerationStatus; page?: number; limit?: number } = {}): Promise<Paginated<Product>> => {
  const query = new URLSearchParams();
  if (params.q) query.append("q", params.q);
  if (params.status) query.append("status", params.status);
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));

  const response = await authenticatedFetch(`${API_BASE_URL}/admin/products?${query.toString()}`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải danh sách sản phẩm");
  return response.json();
};

export const adminApproveProduct = async (id: number): Promise<Product> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/admin/products/${id}/approve`, { method: "PATCH" });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể duyệt sản phẩm");
  return response.json();
};

export const adminRejectProduct = async (id: number, reason: string): Promise<Product> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/admin/products/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể từ chối sản phẩm");
  return response.json();
};

export const uploadShopImage = uploadImageToS3;
