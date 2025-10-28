import { CollaboratorRequest } from "../features/Admin/pages/CollaboratorManagementPage/types";
import axiosClient from "./axiosClient";

const BASE_URL = "/admin/request-collaborators";
export const requestCollaboratorService = {
    submitRequestCollaborator: async (data: any) => {
        const res = await axiosClient.post(`${BASE_URL}`, data);
        return res.data;
    },
    getRequestCollaboratorByUser: async () => {
        const res = await axiosClient.get(`${BASE_URL}/by-user`);
        return res.data;
    },
    getAllRequest: async (page = 1, limit = 6): Promise<{
        items: CollaboratorRequest[];
        total: number;
        page: number;
        pageCount: number;
    }> => {
        const res = await axiosClient.get(`${BASE_URL}`, {
            params: { page, limit }
        });
        return {
            items: res.data.items,
            total: res.data.total,
            page: res.data.page,
            pageCount: res.data.pageCount,
        };
    },
    updateRequestStatus: async (id: string, status: 'approved' | 'rejected', rejection_reason?: string) => {
        const res = await axiosClient.put(`${BASE_URL}/${id}/status`, {
            status,
            rejection_reason
        });
        return res.data;
    }
}