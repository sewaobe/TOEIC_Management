import { ApiResponse } from "../types/ApiResponse";
import { Dictation } from "../types/Dictation";
import axiosClient from "./axiosClient";

const BASE_URL = "/ctv/dictation"
export const dictationService = {
    getAll: async (page = 1, limit = 10): Promise<{
        items: Dictation[],
        total: number,
        page: number,
        pageCount: number
    }> => {
        const res = await axiosClient.get<ApiResponse<{
            items: Dictation[],
            total: number,
            page: number,
            pageCount: number
        }>>(`${BASE_URL}?page=${page}&limit=${limit}`,);

        if (!res.data) {
            throw new Error("Get all dictation error");
        }

        return res.data;
    },
    create: async (payload: Partial<Dictation>): Promise<Dictation> => {
        const res = await axiosClient.post<ApiResponse<Dictation>>(`${BASE_URL}/`, payload);

        if (!res.data) {
            throw new Error("Create dictation error");
        }

        return res.data;
    },
    update: async (payload: Partial<Dictation>, dictationId: string): Promise<Dictation> => {
        const res = await axiosClient.put<ApiResponse<Dictation>>(`${BASE_URL}/${dictationId}`, payload);

        if (!res.data) {
            throw new Error("Update dictation error");
        }

        return res.data;
    },
    delete: async (dictationId: string): Promise<boolean> => {
        const res = await axiosClient.delete<ApiResponse<boolean>>(`${BASE_URL}/${dictationId}`);

        return res.success;
    },

}