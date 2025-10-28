import { Badge } from "../../../../types/Badge";
import { MasterPart } from "../../../../types/MasterPart";
import { UserProfile } from "../../../../types/User";

export type CollaboratorStatus = "pending" | "approved" | "rejected";

export interface CollaboratorRequest {
  _id: string;
  user_id?: {
    _id: string;
    profile?: UserProfile;
    badges?: Badge[];
    master_parts?: MasterPart[];
  } | null;
  fullName: string;
  email: string;
  experience: string;
  expertise: string[];
  motivation: string;
  availability: "part-time" | "full-time" | "flexible";
  cv_url: string;
  status: CollaboratorStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}
