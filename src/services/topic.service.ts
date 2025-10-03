import { ApiResponse } from "../types/ApiResponse";
import { Topic } from "../types/Topic";
import axiosClient from "./axiosClient";

export const topicService = {
    // GET all
    getAllTopics: async (page = 1, limit = 6): Promise<{
        items: Topic[];
        total: number;
        page: number;
        pageCount: number;
    }> => {
        const res = await axiosClient.get<ApiResponse<any>>(`/ctv/topics?page=${page}&limit=${limit}`);
        return res.data ?? { items: [], total: 0, page: 1, pageCount: 1 };
    },


    // CREATE
    createTopic: async (topic: Partial<Topic>): Promise<Topic> => {
        const res = await axiosClient.post<ApiResponse<Topic>>("/ctv/topics", topic);
        if (!res.data) {
            throw new Error("Không tạo được chủ đề");
        }
        return res.data;
    },

    // UPDATE
    updateTopic: async (id: string, topic: Partial<Topic>): Promise<Topic> => {
        const res = await axiosClient.put<ApiResponse<Topic>>(`/ctv/topics/${id}`, topic);
        if (!res.data) {
            throw new Error("Không cập nhật được chủ đề");
        }
        return res.data;
    },

    // DELETE
    deleteTopic: async (id: string): Promise<void> => {
        await axiosClient.delete(`/ctv/topics/${id}`);
    },
};
