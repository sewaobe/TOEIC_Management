import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";

export interface Quiz {
  _id: string;
  title: string;
  topic?: (string | { _id: string; title: string })[];
  question_ids?: any[]; // ✅ đổi từ group_ids → question_ids
  part_type?: number;
  level?: string;
  status?: string;
  planned_completion_time?: number;
  weight?: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuizQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  topic?: string;
  level?: string;
  status?: string;
  part_type?: number;
}

const quizService = {
  getAll: (params?: QuizQueryParams) =>
    axiosClient.get<
      ApiResponse<{
        items: Quiz[];
        total: number;
        pageCount: number;
      }>
    >("/ctv/quiz", { params }),

  create: (data: Partial<Quiz>) =>
    axiosClient.post<ApiResponse<Quiz>>("/ctv/quiz", data),

  getById: (id: string) =>
    axiosClient.get<ApiResponse<Quiz>>(`/ctv/quiz/${id}`),

  update: (id: string, data: Partial<Quiz>) =>
    axiosClient.put<ApiResponse<Quiz>>(`/ctv/quiz/${id}`, data),

  delete: (id: string) =>
    axiosClient.delete<ApiResponse<null>>(`/ctv/quiz/${id}`),
};

export default quizService;
