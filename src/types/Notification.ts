export interface Notification {
  id: string;
  senderId?: string;
  recipientId?: string;
  message: string;
  description?: string;
  type: "system" | "comment" | "error" | "chat" | "test" | "lesson";
  isRead?: boolean;
  createdAt: string;
}