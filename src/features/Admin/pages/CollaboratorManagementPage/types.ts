// 🧩 Các kiểu dữ liệu dùng chung trong trang Quản lý CTV

// Trạng thái cộng tác viên
export type CollaboratorStatus = "pending" | "approved" | "rejected";

// Dữ liệu cơ bản của cộng tác viên trong bảng
export interface Collaborator {
  id: string;
  name: string;
  email: string;
  requested_at: string;
  joined_at?: string;
  status: CollaboratorStatus;
}

// Dữ liệu chi tiết trong Drawer
export interface UserDetail {
  id: string;
  email: string;
  status: CollaboratorStatus;
  profile: {
    fullname: string;
    avatar: string;
  };
  badges: { title: string }[];
  master_parts: { part_name: string; accuracy: number }[];
  topic_vocabularies: { title: string }[];
}
