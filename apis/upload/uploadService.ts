export type UploadFolder =
  | "avatars"
  | "submissions"
  | "resources"
  | "badges"
  | "courses"
  | "tracks";

export interface UploadResponse {
  url: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-rar-compressed",
  "text/plain",
  "text/javascript",
  "application/javascript",
];

export function isAllowedFileType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type) || file.name.endsWith(".rar");
}

export async function uploadFile(
  file: File,
  token: string,
  folder: UploadFolder = "submissions",
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload?folder=${folder}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function uploadMultipleFiles(
  files: File[],
  token: string,
  folder: UploadFolder = "submissions",
): Promise<UploadResponse[]> {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const res = await fetch(`${API_URL}/api/upload/multiple?folder=${folder}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}
