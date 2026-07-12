import axiosClient from "../../../../../services/axiosClient";
import { ApiResponse } from "../../../../../types/api";

export interface ILessonFeedback {
  _id?: string;
  day_study_id: string;
  dayStudy?: {
    id: string;
    stageNo?: number | null;
    status?: string | null;
    accuracyOverall?: number | null;
    cycleNo?: number | null;
    cycleStatus?: string | null;
    lessonTitles: string[];
  } | null;
  rating: number;
  reasons: string[];
  comment?: string;
  is_positive: boolean;
  created_at: string;
}

export interface IFeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  positiveFeedbacks: number;
  negativeFeedbacks: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

const feedbackService = {
  /**
   * Lấy tất cả feedback của một user
   */
  getByUserId: async (userId: string): Promise<ILessonFeedback[]> => {
    const res = await axiosClient.get<ApiResponse<ILessonFeedback[]>>(
      `/feedback/user/${userId}`
    );
    return res.data || [];
  },

  /**
   * Lấy thống kê feedback của một user
   */
  getStatsByUserId: async (userId: string): Promise<IFeedbackStats> => {
    const res = await axiosClient.get<ApiResponse<IFeedbackStats>>(
      `/feedback/user/${userId}/stats`
    );
    return (
      res.data || {
        totalFeedbacks: 0,
        averageRating: 0,
        positiveFeedbacks: 0,
        negativeFeedbacks: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    );
  },
};

export default feedbackService;
