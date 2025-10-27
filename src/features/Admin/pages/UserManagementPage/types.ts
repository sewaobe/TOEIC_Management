export type UserStatus = "active" | "inactive" | "suspended";
export type UserRole = "admin" | "collaborator" | "student";

export interface User {
  id: number;
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
}
