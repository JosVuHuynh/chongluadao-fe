import { authenticatedFetch } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================================
   TYPES
================================ */

export interface CreateReportRequest {
  scamTypeId: number;
  scamTypeOther?: string | null;

  scammerName: string;
  phone: string;
  bankAccount: string;

  relatedLinks: string[];
  description: string;

  evidenceUrls: string[];

  reporterName: string;
  contactInfo: string;
}

export interface ReportResponse {
  id: number;

  scamTypeId: number;
  scamTypeOther?: string | null;

  scammerName: string;
  phone: string;
  bankAccount: string;

  relatedLinks: string[];
  description: string;

  evidenceUrls: string[];

  reporterName: string;
  contactInfo: string;

  status: string;
  createdAt: string;
}

export interface ScamType {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

interface ScamTypesResponse {
  data: ScamType[];
}

interface S3PresignResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

/* ================================
   HELPER: Map FE → BE payload
================================ */

type CreateReportPayloadBE = {
  scam_type_id: number;
  scam_type_other: string | null;
  scammer_name: string;

  phone: string;
  bank_account: string;

  related_links: string[];
  description: string;

  evidence_urls: string[];

  reporter_name: string;
  contact_info: string;
};

const toReportPayloadBE = (
  input: CreateReportRequest
): CreateReportPayloadBE => ({
  scam_type_id: input.scamTypeId,
  scam_type_other: input.scamTypeOther ?? null,
  scammerName: input.scammerName,

  phone: input.phone,
  bank_account: input.bankAccount,

  related_links: input.relatedLinks ?? [],
  description: input.description,

  evidence_urls: input.evidenceUrls ?? [],

  reporter_name: input.reporterName,
  contact_info: input.contactInfo,
});

/* ================================
   S3 Upload
================================ */

const getS3PresignUrl = async (
  fileName: string,
  contentType: string
): Promise<S3PresignResponse> => {
  const response = await fetch(`${API_BASE_URL}/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // nếu BE dùng cookie cho logic nào đó thì giữ include, còn không thì bỏ
    credentials: "include",
    body: JSON.stringify({ fileName, contentType }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Không thể lấy presigned URL");
  }

  return response.json();
};

export const uploadImageToS3 = async (file: File): Promise<string> => {
  const presign = await getS3PresignUrl(file.name, file.type);

  const uploadResponse = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload S3 thất bại");
  }

  return presign.publicUrl;
};

export const uploadMultipleImages = async (
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<string[]> => {
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const url = await uploadImageToS3(files[i]);
    urls.push(url);
    onProgress?.(i + 1, files.length);
  }

  return urls;
};

/* ================================
   CREATE REPORT
================================ */

export const createReport = async (
  reportData: CreateReportRequest
): Promise<any> => {
  const payload = toReportPayloadBE(reportData);

  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 400) {
      throw new Error(
        errorData.message || "Dữ liệu gửi lên không hợp lệ"
      );
    }

    if (response.status === 429) {
      throw new Error("Bạn đã gửi quá nhiều tố cáo. Vui lòng thử lại sau.");
    }

    // Không cần xử lý 401 nữa vì đây là API public
    throw new Error(
      errorData.message || "Không thể gửi tố cáo"
    );
  }

  return response.json();
};
/* ================================
   STATS
================================ */

export const getUserReportCount = async (): Promise<{ totalReports: number }> => {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/reports/count`,
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error("Không thể lấy thống kê");
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return { totalReports: 0 };
  }
};

/* ================================
   SCAM TYPES
================================ */

export const getScamTypes = async (): Promise<ScamType[]> => {
  const response = await fetch(`${API_BASE_URL}/scam-types`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Không thể lấy danh sách loại lừa đảo");
  }

  const data = (await response.json()) as ScamTypesResponse;
  return data.data ?? [];
};