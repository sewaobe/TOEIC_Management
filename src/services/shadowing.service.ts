import { ApiResponse } from "../types/ApiResponse";
import { Shadowing } from "../types/Shadowing";
import axiosClient from "./axiosClient";

const BASE_URL = "/ctv/shadowing"
export const shadowingService = {
    getAll: async (page = 1, limit = 10): Promise<{
        items: Shadowing[],
        total: number,
        page: number,
        pageCount: number
    }> => {
        const res = await axiosClient.get<ApiResponse<{
            items: Shadowing[],
            total: number,
            page: number,
            pageCount: number
        }>>(`${BASE_URL}?page=${page}&limit=${limit}`,);

        if (!res.data) {
            throw new Error("Get all shadowing error");
        }

        return res.data;
    },
    create: async (payload: Partial<Shadowing>): Promise<Shadowing> => {
        const res = await axiosClient.post<ApiResponse<Shadowing>>(`${BASE_URL}/`, payload);

        if (!res.data) {
            throw new Error("Create shadowing error");
        }

        return res.data;
    },
    update: async (payload: Partial<Shadowing>, shadowingId: string): Promise<Shadowing> => {
        const res = await axiosClient.put<ApiResponse<Shadowing>>(`${BASE_URL}/${shadowingId}`, payload);

        if (!res.data) {
            throw new Error("Update shadowing error");
        }

        return res.data;
    },
    delete: async (shadowingId: string): Promise<boolean> => {
        const res = await axiosClient.delete<ApiResponse<boolean>>(`${BASE_URL}/${shadowingId}`);

        return res.success;
    },

}