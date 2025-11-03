export type UserStatus = "active" | "inactive" | "banned" | "banned_permanent";
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
  // removed banned_type and banned_until per backend schema
  banned_reason?: string | null;
}
