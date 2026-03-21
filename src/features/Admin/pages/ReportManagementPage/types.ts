export type AdminReportType =
  | "system"
  | "lesson"
  | "flashcard"
  | "chatbot"
  | "other";

export type AdminReportStatus =
  | "pending"
  | "in_progress"
  | "resolved"
  | "rejected";

export interface AdminReportUserInfo {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
}

export interface AdminReportItem {
  id: string;
  type: AdminReportType;
  title: string;
  description: string;
  imageUrl?: string;
  status: AdminReportStatus;
  adminNote?: string;
  handledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: AdminReportUserInfo | null;
  handler: AdminReportUserInfo | null;
}

export interface AdminReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminReportListResponse {
  items: AdminReportItem[];
  pagination: AdminReportPagination;
}

export interface AdminReportQuery {
  page?: number;
  limit?: number;
  type?: AdminReportType | "all";
  status?: AdminReportStatus | "all";
  search?: string;
  from?: string;
  to?: string;
}

export interface AdminUpdateReportPayload {
  status?: AdminReportStatus;
  adminNote?: string;
  handledBy?: string | null;
}
