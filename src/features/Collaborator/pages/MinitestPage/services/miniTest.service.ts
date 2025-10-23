import axiosClient from "../../../../../services/axiosClient";
import { FullTest } from "../../../../../types/fullTest";
import { ApiResponse } from "../../../../../types/api";

const miniTestService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    topic?: string;
  }) => {
    const { page = 1, limit = 10, search, status, topic } = params || {};
    const query = new URLSearchParams();

    query.append("page", page.toString());
    query.append("limit", limit.toString());
    if (search) query.append("search", search);
    if (status) query.append("status", status);
    if (topic) query.append("topic", topic);

    // ✅ Gửi type để backend nhận biết là mini-test
    query.append("type", "mini-test");

    const res = await axiosClient.get<
      ApiResponse<{
        items: FullTest[];
        total: number;
        pageCount: number;
      }>
    >(`/ctv/tests/get-all?${query.toString()}`);

    // ✅ BE đã chuẩn hóa field “id” trong FullTest rồi, trả ra thẳng luôn
    return res.data;
  },

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

export default miniTestService;
