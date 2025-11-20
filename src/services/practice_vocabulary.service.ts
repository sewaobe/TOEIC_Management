import { ApiResponse } from "../types/ApiResponse";
import {
  PracticeTopicVocabulary,
  VocabularyWord,
} from "../types/PracticeVocabulary";
import axiosClient from "./axiosClient";

export const practiceTopicVocabularyService = {
  // GET all practice topics
  getAllPracticeTopics: async (
    page = 1,
    limit = 10,
    filters?: { search?: string; level?: string }
  ): Promise<{
    items: PracticeTopicVocabulary[];
    total: number;
    page: number;
    pageCount: number;
  }> => {
    let url = `/ctv/practice-topics?page=${page}&limit=${limit}`;
    if (filters?.search) url += `&search=${filters.search}`;
    if (filters?.level) url += `&level=${filters.level}`;

    const res = await axiosClient.get<ApiResponse<any>>(url);
    return res.data ?? { items: [], total: 0, page: 1, pageCount: 1 };
  },

  // GET practice topic by ID
  getPracticeTopicById: async (
    id: string
  ): Promise<PracticeTopicVocabulary> => {
    const res = await axiosClient.get<ApiResponse<PracticeTopicVocabulary>>(
      `/ctv/practice-topics/${id}`
    );
    if (!res.data) {
      throw new Error("Không tìm thấy chủ đề");
    }
    return res.data;
  },

  // CREATE practice topic
  createPracticeTopic: async (
    topic: Partial<PracticeTopicVocabulary>
  ): Promise<PracticeTopicVocabulary> => {
    const res = await axiosClient.post<ApiResponse<PracticeTopicVocabulary>>(
      "/ctv/practice-topics",
      topic
    );
    if (!res.data) {
      throw new Error("Không tạo được chủ đề");
    }
    return res.data;
  },

  // UPDATE practice topic
  updatePracticeTopic: async (
    id: string,
    topic: Partial<PracticeTopicVocabulary>
  ): Promise<PracticeTopicVocabulary> => {
    const res = await axiosClient.put<ApiResponse<PracticeTopicVocabulary>>(
      `/ctv/practice-topics/${id}`,
      topic
    );
    if (!res.data) {
      throw new Error("Không cập nhật được chủ đề");
    }
    return res.data;
  },

  // DELETE practice topic
  deletePracticeTopic: async (id: string): Promise<void> => {
    await axiosClient.delete(`/ctv/practice-topics/${id}`);
  },

  // Add vocabulary word to topic
  addVocabularyWordToTopic: async (
    topicId: string,
    vocabularyWordId: string
  ): Promise<PracticeTopicVocabulary> => {
    const res = await axiosClient.post<ApiResponse<PracticeTopicVocabulary>>(
      "/ctv/practice-topics/add-word",
      { topicId, vocabularyWordId }
    );
    if (!res.data) {
      throw new Error("Không thể thêm từ vựng vào chủ đề");
    }
    return res.data;
  },

  // Remove vocabulary word from topic
  removeVocabularyWordFromTopic: async (
    topicId: string,
    vocabularyWordId: string
  ): Promise<PracticeTopicVocabulary> => {
    const res = await axiosClient.post<ApiResponse<PracticeTopicVocabulary>>(
      "/ctv/practice-topics/remove-word",
      { topicId, vocabularyWordId }
    );
    if (!res.data) {
      throw new Error("Không thể xóa từ vựng khỏi chủ đề");
    }
    return res.data;
  },
};

export const vocabularyWordService = {
  // GET all vocabulary words
  getAllVocabularyWords: async (
    page = 1,
    limit = 10,
    filters?: { search?: string }
  ): Promise<{
    items: VocabularyWord[];
    total: number;
    page: number;
    pageCount: number;
  }> => {
    let url = `/ctv/vocabulary-words?page=${page}&limit=${limit}`;
    if (filters?.search) url += `&search=${filters.search}`;

    const res = await axiosClient.get<ApiResponse<any>>(url);
    return res.data ?? { items: [], total: 0, page: 1, pageCount: 1 };
  },

  // GET vocabulary word by ID
  getVocabularyWordById: async (id: string): Promise<VocabularyWord> => {
    const res = await axiosClient.get<ApiResponse<VocabularyWord>>(
      `/ctv/vocabulary-words/${id}`
    );
    if (!res.data) {
      throw new Error("Không tìm thấy từ vựng");
    }
    return res.data;
  },

  // CREATE vocabulary word
  createVocabularyWord: async (
    word: Partial<VocabularyWord>
  ): Promise<VocabularyWord> => {
    const res = await axiosClient.post<ApiResponse<VocabularyWord>>(
      "/ctv/vocabulary-words",
      word
    );
    if (!res.data) {
      throw new Error("Không tạo được từ vựng");
    }
    return res.data;
  },

  // UPDATE vocabulary word
  updateVocabularyWord: async (
    id: string,
    word: Partial<VocabularyWord>
  ): Promise<VocabularyWord> => {
    const res = await axiosClient.put<ApiResponse<VocabularyWord>>(
      `/ctv/vocabulary-words/${id}`,
      word
    );
    if (!res.data) {
      throw new Error("Không cập nhật được từ vựng");
    }
    return res.data;
  },

  // DELETE vocabulary word
  deleteVocabularyWord: async (id: string): Promise<void> => {
    await axiosClient.delete(`/ctv/vocabulary-words/${id}`);
  },
};
