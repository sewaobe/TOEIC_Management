import { ActivityOption, ActivityType, LessonManager, LessonManagerFilters, PartType } from "../types/LessonManager";
import { LessonManagerDetail } from "../types/LessonManagerDetail";
import { PaginationResult } from "../types/PaginationResult";
import axiosClient from "./axiosClient";

const BASE_URL = "/ctv/lesson-manager";

const normalizePaginationResult = <T>(res: any): PaginationResult<T> => {
    const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.items)
            ? res.data.items
            : Array.isArray(res)
                ? res
                : [];

    return {
        data,
        pagination: res?.meta || res?.pagination || {
            page: 1,
            limit: data.length,
            total: data.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
        },
    };
};

export const lessonManagerService = {
    getAllTopicTitles: async (): Promise<{
        id: string;
        title: string;
    }[]> => {
        const res = await axiosClient.get(`${BASE_URL}/titles`);

        return res.data;
    },
    getAllLessonManager: async (
        page: number,
        limit: number,
        filters: LessonManagerFilters = {}
    ): Promise<PaginationResult<LessonManager>> => {
        const res = await axiosClient.get(`${BASE_URL}/`, {
            params: {
                page,
                limit,
                ...filters,
            },
        });

        return normalizePaginationResult<LessonManager>(res);
    },
    getActivityOptions: async (params: {
        activity_type?: ActivityType;
        part_type?: PartType | "";
        query?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginationResult<ActivityOption>> => {
        const res = await axiosClient.get(`${BASE_URL}/activity-options`, { params });
        return normalizePaginationResult<ActivityOption>(res);
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
    },
    updateStatusLessonManager: async (lessonManagerId: string, status: string): Promise<LessonManager> => {
        const res = await axiosClient.put(`${BASE_URL}/${lessonManagerId}/status`, { status });
        return res.data;
    }
}
