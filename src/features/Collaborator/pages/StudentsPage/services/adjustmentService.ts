import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";
import {
  IAdjustmentRequest,
  ILearningPathFull,
} from "../../../../../types/adjustment";

export const adjustmentService = {
  // Lấy lộ trình chi tiết của học viên
  getFullLearningPath: async (studentId: string) => {
    const res = await axiosClient.get<ApiResponse<ILearningPathFull>>(
      `/adjustment-requests/student-path/${studentId}`
    );
    return res.data;
  },

  // Tạo yêu cầu điều chỉnh
  createRequest: async (data: Partial<IAdjustmentRequest>) => {
    const res = await axiosClient.post<ApiResponse<IAdjustmentRequest>>(
      "/adjustment-requests",
      data
    );
    return res.data;
  },

  // Lấy lịch sử yêu cầu của CTV
  getCollaboratorRequests: async () => {
    const res = await axiosClient.get<ApiResponse<IAdjustmentRequest[]>>(
      "/adjustment-requests/collaborator"
    );
    return res.data;
  },

  // Lấy lịch sử yêu cầu điều chỉnh của 1 học viên cụ thể
  getByStudentId: async (studentId: string) => {
    const res = await axiosClient.get<ApiResponse<IAdjustmentRequest[]>>(
      `/adjustment-requests/student/${studentId}`
    );
    return res.data;
  },
};
