import axiosClient from "./axiosClient";
import { FullTest } from "../types/fullTest";
import { ApiResponse } from "../types/api";

const fullTestService = {
  getAll: (page: number = 1, limit: number = 10) =>
    axiosClient.get<ApiResponse<FullTest[]>>(
      `/ctv/tests/get-all?page=${page}&limit=${limit}`
    ) as any as ApiResponse<FullTest[]>,

  getById: (id: string) =>
    axiosClient.get<ApiResponse<FullTest>>(
      `/ctv/tests/${id}`
    ) as any as ApiResponse<FullTest>,
  create: (data: Partial<FullTest>) =>
    axiosClient.post<ApiResponse<FullTest>>("/ctv/tests/create", data),

  update: (id: string, data: Partial<FullTest>) =>
    axiosClient.put<ApiResponse<FullTest>>(`/ctv/tests/${id}`, data),

  delete: (id: string) =>
    axiosClient.delete<ApiResponse<null>>(`/ctv/tests/${id}`),
};

export default fullTestService;
