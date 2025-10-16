import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";
import { Student, StudentDetail, GroupReport } from "../../../../../types/student";

const studentService = {
  // 📋 Lấy danh sách học viên
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    targetScore?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.status && params.status !== "all")
      query.append("status", params.status);
    if (params?.targetScore && params.targetScore > 0)
      query.append("targetScore", params.targetScore.toString());

    const res = await axiosClient.get<
      ApiResponse<{ items: Student[]; total: number; pageCount: number }>
    >(`/ctv/students?${query.toString()}`);

    return res.data || { items: [], total: 0, pageCount: 0 };
  },

  // 🧠 Lấy chi tiết học viên
  getById: async (id: string) => {
    const res = await axiosClient.get<ApiResponse<StudentDetail>>(
      `/ctv/students/${id}`
    );
    return res.data;
  },

  // 📊 Lấy báo cáo nhóm
  getReports: async () => {
    const res = await axiosClient.get<ApiResponse<GroupReport[]>>(
      `/ctv/students/reports/all`
    );
    return res.data || res.data || [];
  },
};

export default studentService;
