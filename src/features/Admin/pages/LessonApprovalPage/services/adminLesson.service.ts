import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";

const adminLessonService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    part?: string;
    level?: string;
  }) => {
    const res = await axiosClient.get<ApiResponse<any>>(`/admin/lessons`, {
      params,
    });
    return (res as any).data?.data ?? (res as any).data;
  },

  getDetail: async (id: string) => {
    const res = await axiosClient.get<ApiResponse<any>>(`/admin/lessons/${id}`);
    return (res as any).data?.data ?? (res as any).data;
  },

  approve: async (id: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
      `/admin/lessons/${id}/approve`
    );
    return (res as any).data?.data ?? (res as any).data;
  },

  reject: async (id: string, reason?: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
      `/admin/lessons/${id}/reject`,
      { reason }
    );
    return (res as any).data?.data ?? (res as any).data;
  },

  softDelete: async (id: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
      `/admin/lessons/${id}/delete`
    );
    return (res as any).data?.data ?? (res as any).data;
  },
};

export default adminLessonService;
