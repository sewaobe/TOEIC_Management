import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { Lesson } from "../types/lesson";

// 🧩 Kiểu dữ liệu query khi lấy danh sách
interface LessonQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  part_type?: number;
  status?: string;
}

const lessonService = {
  // 🟢 Lấy danh sách bài học (có phân trang + search + lọc)
  getAll: (params?: LessonQueryParams) =>
    axiosClient.get<
      ApiResponse<{
        items: Lesson[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >("/ctv/lesson", { params }),

  // 🟩 Tạo bài mới (rỗng)
  create: (data: Partial<Lesson>) =>
    axiosClient.post<ApiResponse<Lesson>>("/ctv/lesson", data),

  // 🟦 Lấy chi tiết 1 bài học
  getById: (id: string) =>
    axiosClient.get<ApiResponse<Lesson>>(`/ctv/lesson/${id}`),

  // 🟨 Cập nhật bài học (thêm / sửa sections)
  updateWithSections: (id: string, data: Partial<Lesson>) =>
    axiosClient.put<ApiResponse<Lesson>>(`/ctv/lesson/${id}/sections`, data),

  // 🟧 Cập nhật thông tin cơ bản (title, summary, status, ...)
  updateBasic: (id: string, data: Partial<Lesson>) =>
    axiosClient.put<ApiResponse<Lesson>>(`/ctv/lesson/${id}/basic`, data),

  // 🔴 Xóa bài học
  delete: (id: string) =>
    axiosClient.delete<ApiResponse<null>>(`/ctv/lesson/${id}`),
};

export default lessonService;
