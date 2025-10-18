import axiosClient from "./axiosClient";

const BASE_URL = "/ctv/lesson-manager";
export const lessonManagerService = {
    getAllTopicTitles: async (): Promise<{
        id: string;
        title: string;
    }[]> => {
        const res = await axiosClient.get(`${BASE_URL}/titles`);

        return res.data;
    }
}