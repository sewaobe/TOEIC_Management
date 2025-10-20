import { LessonManager } from "../types/LessonManager";
import { LessonManagerDetail } from "../types/LessonManagerDetail";
import { PaginationResult } from "../types/PaginationResult";
import axiosClient from "./axiosClient";

const BASE_URL = "/ctv/lesson-manager";
export const lessonManagerService = {
    getAllTopicTitles: async (): Promise<{
        id: string;
        title: string;
    }[]> => {
        const res = await axiosClient.get(`${BASE_URL}/titles`);

        return res.data;
    },
    getAllLessonManager: async (page: number, limit: number): Promise<PaginationResult<LessonManager>> => {
        const res = await axiosClient.get(`${BASE_URL}/`, {
            params: {
                page,
                limit,
            },
        });

        
        return {
            data: res.data,
            pagination: res.meta
        };
    },
    getLessonManagerDetail: async (lessonManagerId: string): Promise<LessonManagerDetail> => {
        const res = await axiosClient.get(`${BASE_URL}/${lessonManagerId}`);
        return res.data;
    },
    createLessonManager: async (payload: Partial<LessonManager>): Promise<LessonManager> => {
        const res = await axiosClient.post(`${BASE_URL}/`, payload);
        return res.data;
    },
    updateLessonManager: async (lessonManagerId: string, payload: Partial<LessonManager>): Promise<LessonManager> => {
        const res = await axiosClient.put(`${BASE_URL}/${lessonManagerId}`, payload);
        return res.data;
    },
    deleteLessonManager: async (lessonManagerId: string): Promise<LessonManager> => {
        const res = await axiosClient.delete(`${BASE_URL}/${lessonManagerId}`);
        return res.data;
    }
}