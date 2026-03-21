import { CommentItem } from "../features/Dashboard/components/RecentCommentDashboard";
import axiosClient from "./axiosClient";

export const commentService = {
  getRecentCommentDashboard: async (
    page = 1,
    limit = 5
  ): Promise<{
    items: CommentItem[];
    total: number;
    page: number;
    pageCount: number;
  }> => {
    try {
      // axiosClient is configured to return response.data (ApiResponse)
      const apiRes = await axiosClient.get(
        `/ctv/reports/comments?page=${page}&limit=${limit}`
      );

      // apiRes should be { success: boolean, data: { items, total, page, pageCount }, message }
      if (!apiRes || !apiRes.success || !apiRes.data) {
        return { items: [], total: 0, page: 1, pageCount: 0 };
      }

      const payload = apiRes.data;

      const transformedItems: CommentItem[] = (payload.items || []).map(
        (item: any) => ({
          id: item._id || item.id,
          user:
            item.user?.profile?.fullname ||
            item.user?.profile?.name ||
            "Anonymous",
          content: item.content || "",
          time: item.create_at ? new Date(item.create_at).toLocaleString() : "",
          avatar:
            (item.user?.profile?.fullname &&
              item.user.profile.fullname.charAt(0).toUpperCase()) ||
            (item.user?.profile?.avatar ? "" : "A"),
          type: item.type === "lesson" ? "lesson" : "test",
          flagged: !!item.flagged,
        })
      );

      return {
        items: transformedItems,
        total: payload.total || 0,
        page: payload.page || page,
        pageCount: payload.pageCount || Math.ceil((payload.total || 0) / limit),
      };
    } catch (err) {
      console.error("commentService.getRecentCommentDashboard error:", err);
      return { items: [], total: 0, page: 1, pageCount: 0 };
    }
  },
};
