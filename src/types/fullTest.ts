// src/types/fullTest.ts

// Enum trạng thái đề thi
export enum TestStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  OPEN = "open",
  CLOSED = "closed",
}

// Interface của 1 FullTest
export interface FullTest {
  _id: string;
  title: string;
  type: string;
  status: TestStatus | string; // union để tránh crash nếu BE trả string lạ
  topic: string;
  created_at: string;
  countComment?: number;
  countSubmit?: number;
}

// Interface response chung từ BE
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
