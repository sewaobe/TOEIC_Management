// src/types/fullTest.ts
import { Group } from "./group";

// ===============================
// 🧩 Enum trạng thái đề thi
// ===============================
export enum TestStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  OPEN = "open",
  CLOSED = "closed",
}

// ===============================
// 🧩 Enum loại đề thi
// ===============================
export enum TestType {
  FULL_TEST = "full-test",
  MINI_TEST = "mini-test",
  PART_TEST = "part-test",
  CUSTOM = "custom",
}

// ===============================
// 🧩 Interface FullTest (phản ánh chính xác ITest từ BE)
// ===============================
export interface FullTest {
  _id: string;
  id: string;
  title: string;
  audioListen: string[]; // Array<ObjectId> tham chiếu tới Media (audio)
  groups: Group[];       // Populate toàn bộ group + questions + media
  type: TestType | string;
  status: TestStatus | string;
  topic: string;
  countComment: number;
  countSubmit: number;
  created_at: string;
  created_by?: {
    _id: string;
    profile: {
      fullname: string;
    }
  }   // có thể populate sau này
  updated_at?: string;
}

// ===============================
// 🧩 Interface response chung từ BE
// ===============================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
  