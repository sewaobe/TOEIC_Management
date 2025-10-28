import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";
import { TestItem } from "../mock/mockTests";

const adminTestService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    topic?: string;
    type?: string;
  }) => {
    const res = await axiosClient.get<
      ApiResponse<{ items: TestItem[]; total: number; pageCount: number }>
    >("/admin/tests", { params });

    // axiosClient interceptor returns response.data; controllers sometimes wrap payload under `data`.
    // Normalize to return the inner payload (items/total/pageCount) when present.
    return (res as any).data?.data ?? (res as any).data;
  },

  getDetail: async (id: string) => {
    const res = await axiosClient.get<ApiResponse<any>>(`/admin/tests/${id}`);
    return (res as any).data?.data ?? (res as any).data;
  },

  approve: async (id: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
      `/admin/tests/${id}/approve`
    );
    return (res as any).data?.data ?? (res as any).data;
  },

  reject: async (id: string, reason?: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
      `/admin/tests/${id}/reject`,
      { reason }
    );
    return (res as any).data?.data ?? (res as any).data;
  },

  softDelete: async (id: string) => {
    const res = await axiosClient.post<ApiResponse<any>>(
      `/admin/tests/${id}/delete`
    );
    return (res as any).data?.data ?? (res as any).data;
  },
};

export default adminTestService;
