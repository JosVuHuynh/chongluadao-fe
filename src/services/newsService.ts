import { authenticatedFetch } from "./authService";
import { uploadImageToS3 } from "./reportService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface NewsAuthor {
  id: number;
  name: string;
  role: "ADMIN" | "BUSINESS";
  business: {
    id: number;
    name: string;
    logoUrl: string | null;
    verifiedBadge: boolean;
  } | null;
}

export interface NewsPostProduct {
  id: number;
  shopId: number;
  shopName: string;
  name: string;
  price: number;
  imageUrl: string | null;
  buyUrl: string | null;
}

export interface NewsPost {
  id: number;
  title: string | null;
  content: string;
  imageUrl: string | null;
  status: "PUBLISHED" | "HIDDEN";
  author: NewsAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  products: NewsPostProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsComment {
  id: number;
  content: string;
  author: { id: number; name: string; role: "ADMIN" | "BUSINESS" | "USER" };
  createdAt: string;
}

export interface PaginatedNews {
  data: NewsPost[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
}

async function parseErrorOrThrow(response: Response, fallbackMessage: string): Promise<never> {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || fallbackMessage);
}

/* Public reads — no login required */

export const getNewsList = async (params: {
  page?: number;
  limit?: number;
  authorRole?: "ADMIN" | "BUSINESS";
} = {}): Promise<PaginatedNews> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.authorRole) query.append("authorRole", params.authorRole);

  const response = await fetch(`${API_BASE_URL}/news?${query.toString()}`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải danh sách tin tức");
  return response.json();
};

export const getNewsById = async (id: number): Promise<NewsPost> => {
  const response = await fetch(`${API_BASE_URL}/news/${id}`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải bài viết");
  return response.json();
};

export const getNewsComments = async (id: number): Promise<{ data: NewsComment[] }> => {
  const response = await fetch(`${API_BASE_URL}/news/${id}/comments`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải bình luận");
  return response.json();
};

/* Interactions — require login (any role) */

export const toggleLike = async (id: number): Promise<{ liked: boolean; likeCount: number }> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/news/${id}/like`, { method: "POST" });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể thích bài viết");
  return response.json();
};

export const addComment = async (id: number, content: string): Promise<NewsComment> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/news/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể gửi bình luận");
  return response.json();
};

export const deleteComment = async (id: number, commentId: number): Promise<void> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/news/${id}/comments/${commentId}`, {
    method: "DELETE",
  });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể xóa bình luận");
};

/* Authoring — ADMIN or BUSINESS only (enforced by backend) */

export interface NewsPostInput {
  title?: string;
  content: string;
  imageUrl?: string;
  productIds?: number[];
}

export const getMyNews = async (params: { page?: number; limit?: number } = {}): Promise<PaginatedNews> => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));

  const response = await authenticatedFetch(`${API_BASE_URL}/news/mine?${query.toString()}`);
  if (!response.ok) await parseErrorOrThrow(response, "Không thể tải bài viết của bạn");
  return response.json();
};

export const createNews = async (data: NewsPostInput): Promise<NewsPost> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/news`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể đăng tin tức");
  return response.json();
};

export const updateNews = async (id: number, data: Partial<NewsPostInput>): Promise<NewsPost> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/news/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể cập nhật tin tức");
  return response.json();
};

export const deleteNews = async (id: number): Promise<void> => {
  const response = await authenticatedFetch(`${API_BASE_URL}/news/${id}`, { method: "DELETE" });
  if (!response.ok) await parseErrorOrThrow(response, "Không thể xóa tin tức");
};

export const uploadNewsImage = uploadImageToS3;
