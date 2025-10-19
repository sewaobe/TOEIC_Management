// src/types/lesson.ts

/**
 * Ví dụ minh họa trong bài học
 */
export interface Example {
  en?: string;
  vi?: string;
  note?: string;
}

/**
 * Cặp câu sai/đúng + giải thích
 */
export interface ErrorExample {
  wrong?: string;
  correct?: string;
  explanation?: string;
}

/**
 * Phần (section) trong bài học — có thể là lý thuyết, ví dụ, bảng, media...
 */
export interface LessonSection {
  _id?: string; // ID thật từ MongoDB
  id?: string; // ID tạm (chỉ dùng ở FE)
  lesson_id?: string; // Tham chiếu đến Lesson cha
  order: number; // Thứ tự trong bài học
  title: string;
  type: "text" | "example" | "error" | "media" | "table";
  content?: string;
  example?: Example;
  error?: ErrorExample;
  medias_id?: string[]; // Danh sách ID media (trường hợp có nhiều media)
  mediaId?: string; // Media chính (1 cái duy nhất)
  mediaUrl?: string; // URL preview (FE)
  tableData?: string[][]; // Dữ liệu bảng (nếu type = table)
}

/**
 * Thông tin bài học (Lesson)
 * Lưu metadata + tham chiếu đến các section
 */
export interface Lesson {
  _id?: string; // ID MongoDB
  part_type: number; // 🧩 Số thứ tự part (1–7)
  topic?: string[]; // ID chủ đề liên quan (optional để dễ tạo)
  title: string; // Tiêu đề bài học
  status: "draft" | "pending" | "approved" | "open" | "closed"; // ✅ match enum BE TestStatus
  summary?: string; // Mô tả ngắn
  planned_completion_time?: number; // Thời lượng dự kiến (phút)
  weight?: number; // Trọng số (AI/LP)
  sections_id?: LessonSection[]; // Danh sách section con
  created_at?: string;
  created_by?: string;
  updated_at?: string;
}
