export interface Notification {
  id: string;
  senderId?: string;
  recipientId?: string;
  message: string;
  type: "system" | "comment" | "error" | "chat" | "test";
  isRead?: boolean;
  createdAt: string;
}