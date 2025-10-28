export type UserStatus = "active" | "inactive" | "suspended";
export type UserRole = "admin" | "collaborator" | "student";

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role_id: {
    _id: string;
    name: UserRole;
  };
  status: UserStatus;
  avatar: string;
  created_at: string;
  last_active?: string;
  badges?: string[];
  topic_vocabularies?: string[];
  master_parts: {
    part_name: string;
    accuracy: number;
  }[];
  // Thông tin ban (có thể không có nếu user không bị ban)
  banned_at?: string | null;
  banned_by?: string | null;
  banned_type?: "temp" | "perm" | null;
  banned_until?: string | null;
  banned_reason?: string | null;
}
