import axiosClient from "./axiosClient";
import { Vocabulary } from "../types/Vocabulary";
import { ApiResponse } from "../types/ApiResponse";
import { TopicInfo } from "../types/Topic";

export const vocabularyService = {
  getByTopic: async (topicId: string, page = 1, limit = 10): Promise<{
    items: Vocabulary[];
    total: number;
    page: number;
    pageCount: number;
  }> => {
    const res = await axiosClient.get<ApiResponse<any>>(`/ctv/topics/${topicId}`, {
      params: { page, limit },
    });
    return {
      ...res.data,
      items: res.data.items.map((v: any) => ({ ...v, id: v._id }))
    };
  },
  create: async (payload: Partial<Vocabulary>): Promise<Vocabulary> => {
    const res = await axiosClient.post<ApiResponse<Vocabulary>>(
      `/ctv/vocabularies`,
      payload // nếu có topicId thì gửi, nếu không thì BE coi là vocab rời
    );
    if (!res.data) {
      throw new Error("Không tạo được từ vựng");
    }
    return res.data;
  },

  update: async (id: string, payload: Partial<Vocabulary> & { topicId?: string }): Promise<Vocabulary> => {
    const res = await axiosClient.put<ApiResponse<Vocabulary>>(
      `/ctv/vocabularies/${id}`,
      payload // topicId optional
    );
    if (!res.data) {
      throw new Error("Không cập nhật được từ vựng");
    }
    return res.data;
  },

  delete: async (id: string, topicId?: string): Promise<void> => {
    await axiosClient.delete<ApiResponse<null>>(`/ctv/vocabularies/${id}`, {
      params: topicId ? { topicId } : undefined, // nếu có thì xóa khỏi topic
    });
  },

  getTopicInfo: async (topicId: string): Promise<TopicInfo> => {
    const res = await axiosClient.get<ApiResponse<any>>(`/ctv/vocabularies/${topicId}/info`);
    if (!res.data) throw new Error("Không lấy được thông tin chủ đề")

    return res.data;
  },

};
