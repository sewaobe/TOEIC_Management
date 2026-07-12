import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";
import {
  CareConversationSummary,
  CareConversationStatus,
  Student,
  StudentDetail,
  GroupReport,
} from "../../../../../types/student";

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

  createCareConversation: async (
    studentId: string,
    payload: { signalType: string; signalScopeKey: string; sentText?: string }
  ) => {
    const res = await axiosClient.post<
      ApiResponse<{ conversation: CareConversationSummary; reused: boolean }>
    >(`/ctv/students/${studentId}/care-conversations`, payload);
    return res.data;
  },

  addCareConversationSolution: async (
    conversationId: string,
    payload: { solutionCodes: string[]; note?: string; followUpDueAt?: string | null }
  ) => {
    const res = await axiosClient.patch<ApiResponse<any>>(
      `/ctv/care-conversations/${conversationId}/solution`,
      payload
    );
    return res.data;
  },

  resolveCareConversation: async (conversationId: string) => {
    const res = await axiosClient.patch<ApiResponse<any>>(
      `/ctv/care-conversations/${conversationId}/resolve`,
      {}
    );
    return res.data;
  },

  listCareConversations: async (
    studentId: string,
    params?: { status?: CareConversationStatus; page?: number; limit?: number }
  ) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    const res = await axiosClient.get<
      ApiResponse<{ items: CareConversationSummary[]; total: number; pageCount: number }>
    >(`/ctv/students/${studentId}/care-conversations?${query.toString()}`);
    return res.data;
  },
};

export default studentService;
