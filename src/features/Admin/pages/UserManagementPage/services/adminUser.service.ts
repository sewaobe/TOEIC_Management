import axiosClient from "../../../../../services/axiosClient";

const adminUserService = {
  // list users with query params (q, role, status, page, limit)
  listUsers: async (params: Record<string, any>) => {
    const res = await axiosClient.get(`/admin/users`, { params });
    const payload: any = res;
    return payload.data; // { data: [...], total, page, limit }
  },

  getUserDetail: async (id: string) => {
    const res = await axiosClient.get(`/admin/users/${id}`);
    const payload: any = res;
    return payload.data; // user dto
  },

  banUser: async (
    id: string,
    body: { type: "temp" | "perm"; reason: string; durationDays?: number }
  ) => {
    const res = await axiosClient.post(`/admin/users/${id}/ban`, body);
    const payload: any = res;
    return payload.data;
  },

  unbanUser: async (id: string) => {
    const res = await axiosClient.post(`/admin/users/${id}/unban`);
    const payload: any = res;
    return payload.data;
  },
};

export default adminUserService;
