export function getErrorMessages(error: any): string[] {
  const data = error?.response?.data;

  if (Array.isArray(data?.errors)) {
    return data.errors
      .map((item: any) => item?.message)
      .filter(Boolean);
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return [data.message];
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return [error.message];
  }

  return ["Đã có lỗi xảy ra"];
}