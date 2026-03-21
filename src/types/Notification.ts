import { AdminReportType } from "../features/Admin/pages/ReportManagementPage/types";

export interface Notification {
  id: string;
  senderId?: string;
  recipientId?: string;
  message: string;
  description?: string;
  type: "system" | "comment" | "error" | "chat" | "test" | "lesson" | AdminReportType;
  isRead?: boolean;
  createdAt: string;
}