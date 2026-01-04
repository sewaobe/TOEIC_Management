// CTV chỉ xử lý báo lỗi lesson và flashcard
export type CTVReportType = "lesson" | "flashcard";

export type CTVReportStatus =
  | "pending"
  | "in_progress"
  | "resolved"
  | "rejected";

export interface CTVReportUserInfo {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
}

export interface CTVReportItem {
  id: string;
  type: CTVReportType;
  title: string;
  description: string;
  imageUrl?: string;
  status: CTVReportStatus;
  adminNote?: string;
  handledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: CTVReportUserInfo | null;
  handler: CTVReportUserInfo | null;
}

export interface CTVReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CTVReportListResponse {
  items: CTVReportItem[];
  pagination: CTVReportPagination;
}

export interface CTVReportQuery {
  page?: number;
  limit?: number;
  type?: CTVReportType | "all";
  status?: CTVReportStatus | "all";
  search?: string;
  from?: string;
  to?: string;
}

export interface CTVUpdateReportPayload {
  status?: CTVReportStatus;
  adminNote?: string;
}
