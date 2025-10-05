import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { Group } from "../types/group";
import { Question } from "../types/question";

const groupService = {
  // ✅ Thêm group mới
  create: (testId: string, data: Partial<Group>) =>
    axiosClient.post<ApiResponse<Group>>(`/ctv/groups/create/${testId}`, data),

  // ✅ Lấy group theo id
  getById: (id: string) =>
    axiosClient.get<ApiResponse<Group>>(`/ctv/groups/${id}`),

  // ✅ Cập nhật group
  update: (id: string, data: Partial<Group>) =>
    axiosClient.put<ApiResponse<Group>>(`/ctv/groups/${id}`, data),

  // ✅ Xóa group
  delete: (id: string) =>
    axiosClient.delete<ApiResponse<null>>(`/ctv/groups/${id}`),

  // ✅ Lấy danh sách câu hỏi kèm group info (phân trang, tìm kiếm, lọc, ...)
  getAllQuestionsWithGroup: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    part?: number;
    tag?: string;
  }) => {
    const { page = 1, limit = 10, search, part, tag } = params || {};
    const query = new URLSearchParams();

    query.append("page", page.toString());
    query.append("limit", limit.toString());
    if (search) query.append("search", search);
    if (part) query.append("part", part.toString());
    if (tag) query.append("tag", tag);

    const res = await axiosClient.get<
      ApiResponse<{
        items: Question[];
        total: number;
        pageCount: number;
      }>
    >(`/ctv/groups/questions/get-all?${query.toString()}`);

    // ✅ BE đã chuẩn hóa field “id” rồi, nên trả ra thẳng không cần map
    return res.data;
  },
};

export default groupService;
