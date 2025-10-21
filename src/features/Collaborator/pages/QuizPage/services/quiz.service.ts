import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";

// 🧠 Định nghĩa type Quiz cơ bản
export interface Quiz {
  _id: string;
  title: string;
  topic?: (string | { _id: string; title: string })[]; // ✅ cho phép cả string[] và object[]
  group_ids?: any[];
  part_type?: number;
  level?: string;
  status?: string;
  planned_completion_time?: number;
  weight?: number;
  created_at?: string;
  updated_at?: string;
}


// 🧩 Kiểu dữ liệu query khi lấy danh sách quiz
export interface QuizQueryParams {
  page?: number;
  limit?: number;
  query?: string; // ✅ đổi "search" → "query" cho khớp BE
  topic?: string; // ✅ đổi "topicId" → "topic" cho khớp BE
  level?: string;
  status?: string;
  part_type?: number;
}

// 🧱 quizService (chuẩn TOEIC form)
const quizService = {
  // 🟢 Lấy danh sách quiz (có phân trang + tìm kiếm + lọc)
  getAll: (params?: QuizQueryParams) =>
    axiosClient.get<
      ApiResponse<{
        items: Quiz[];
        total: number;
        pageCount: number;
      }>
    >("/ctv/quiz", { params }),

  // 🟩 Tạo quiz mới
  create: (data: Partial<Quiz>) =>
    axiosClient.post<ApiResponse<Quiz>>("/ctv/quiz", data),

  // 🟦 Lấy chi tiết quiz
  getById: (id: string) =>
    axiosClient.get<ApiResponse<Quiz>>(`/ctv/quiz/${id}`),

  // 🟨 Cập nhật quiz
  update: (id: string, data: Partial<Quiz>) =>
    axiosClient.put<ApiResponse<Quiz>>(`/ctv/quiz/${id}`, data),

  // 🔴 Xóa quiz
  delete: (id: string) =>
    axiosClient.delete<ApiResponse<null>>(`/ctv/quiz/${id}`),
};

export default quizService;
