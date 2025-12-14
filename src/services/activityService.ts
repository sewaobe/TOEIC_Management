import axiosClient from "./axiosClient";

export interface ActivityDetail {
  _id: string;
  title: string;
  kind: string;
  [key: string]: any;
}

export const activityService = {
  // Get lesson details with sections
  getLessonDetails: async (lessonId: string): Promise<ActivityDetail> => {
    const response = await axiosClient.get(`/ctv/lesson/${lessonId}`);
    return response.data;
  },

  // Get quiz details with questions
  getQuizDetails: async (quizId: string): Promise<ActivityDetail> => {
    const response = await axiosClient.get(`/ctv/quiz/${quizId}`);
    return response.data;
  },

  // Get flashcard details
  getFlashcardDetails: async (flashcardId: string): Promise<ActivityDetail> => {
    const response = await axiosClient.get(
      `/ctv/practice-topics/${flashcardId}`
    );
    return response.data;
  },

  // Get dictation details
  getDictationDetails: async (dictationId: string): Promise<ActivityDetail> => {
    const response = await axiosClient.get(`/ctv/dictation/${dictationId}`);
    return response.data;
  },

  // Get shadowing details
  getShadowingDetails: async (shadowingId: string): Promise<ActivityDetail> => {
    const response = await axiosClient.get(`/ctv/shadowing/${shadowingId}`);
    return response.data;
  },

  // Get mini test details
  getMiniTestDetails: async (testId: string): Promise<ActivityDetail> => {
    const response = await axiosClient.get(`/ctv/tests/${testId}`);
    return response.data;
  },

  // Generic fetcher based on kind
  getActivityDetails: async (
    activityId: string,
    kind: string
  ): Promise<ActivityDetail> => {
    switch (kind.toLowerCase()) {
      case "lesson":
        return activityService.getLessonDetails(activityId);
      case "quiz":
        return activityService.getQuizDetails(activityId);
      case "flash_card":
      case "flashcard":
        return activityService.getFlashcardDetails(activityId);
      case "dictation":
        return activityService.getDictationDetails(activityId);
      case "shadowing":
        return activityService.getShadowingDetails(activityId);
      case "mini_test":
      case "minitest":
        return activityService.getMiniTestDetails(activityId);
      default:
        throw new Error(`Unknown activity kind: ${kind}`);
    }
  },
};
