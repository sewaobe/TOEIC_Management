import { ReportType } from "../types/Report"
import axiosClient from "./axiosClient";

// Mock Data cho Báo cáo 
export const monthlyContentData = [
  { month: "Tháng 1", fullTest: 3, minitest: 10, video: 15, grammar: 5, vocab: 8, practice: 12, },
  { month: "Tháng 2", fullTest: 4, minitest: 12, video: 18, grammar: 6, vocab: 10, practice: 15, },
  { month: "Tháng 3", fullTest: 5, minitest: 15, video: 20, grammar: 7, vocab: 12, practice: 18, },
  { month: "Tháng 4", fullTest: 6, minitest: 18, video: 22, grammar: 8, vocab: 14, practice: 20, },

];
export const studentActivityData = [
  { week: "Tuần 1", activeStudents: 150, newStudents: 20 },
  { week: "Tuần 2", activeStudents: 165, newStudents: 25 },
  { week: "Tuần 3", activeStudents: 180, newStudents: 30 },
  { week: "Tuần 4", activeStudents: 170, newStudents: 18 },
];

export const commentFeedbackData = [
  { month: "Th1", comments: 45, positive: 30, negative: 15 },
  { month: "Th2", comments: 52, positive: 34, negative: 18 },
  { month: "Th3", comments: 60, positive: 40, negative: 20 },
  { month: "Th4", comments: 48, positive: 35, negative: 13 },
]

// Báo cáo lỗi & cập nhật
export const errorReportData = [
  { month: "Th1", reported: 8, resolved: 5 },
  { month: "Th2", reported: 10, resolved: 9 },
  { month: "Th3", reported: 6, resolved: 6 },
  { month: "Th4", reported: 12, resolved: 10 },
  { month: "Th5", reported: 9, resolved: 7 },
  { month: "Th6", reported: 11, resolved: 10 },
]

// Hiệu suất đánh giá nội dung
export const ratingData = [
  { month: "Th1", avgRating: 4.2, fiveStars: 30 },
  { month: "Th2", avgRating: 4.5, fiveStars: 45 },
  { month: "Th3", avgRating: 4.6, fiveStars: 52 },
  { month: "Th4", avgRating: 4.4, fiveStars: 40 },
  { month: "Th5", avgRating: 4.7, fiveStars: 60 },
  { month: "Th6", avgRating: 4.8, fiveStars: 70 },
]

// Hiệu suất tổng quan (Tỷ lệ hoàn thành & tương tác)
export const performanceData = [
  { month: "Th1", completionRate: 62, engagementRate: 75 },
  { month: "Th2", completionRate: 68, engagementRate: 80 },
  { month: "Th3", completionRate: 70, engagementRate: 82 },
  { month: "Th4", completionRate: 73, engagementRate: 85 },
  { month: "Th5", completionRate: 76, engagementRate: 87 },
  { month: "Th6", completionRate: 78, engagementRate: 90 },
]

export const reportService = {
  async fetchReportData(reportType: ReportType, dateRange: [Date | null, Date | null]) {
    console.log("📊 Giả lập gọi API:", { reportType, dateRange })

    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        switch (reportType) {
          case "contentCreation":
            resolve(monthlyContentData)
            break
          case "studentActivity":
            resolve(studentActivityData)
            break
          case "commentFeedback":
            resolve(commentFeedbackData)
            break
          case "errorReports":
            resolve(errorReportData)
            break
          case "ratingPerformance":
            resolve(ratingData)
            break
          case "overallPerformance":
            resolve(performanceData)
            break
          default:
            resolve([])
        }
      }, 1000) // ⏱ mô phỏng delay 1 giây
    })
  },
  async fetchReportComment(page = 1, limit = 5) {
    const res = await axiosClient.get("/ctv/reports/comments", {
      params: { page, limit }
    });

    const apiItems = res.data.items;

    const items = apiItems.map((item: any) => ({
      id: item._id,
      user: item.user?.profile.fullname || "Người dùng ẩn danh",
      avatar:
        item.user?.profile?.avatar ||
        "https://ui-avatars.com/api/?name=User&background=random",
      content: item.content,
      time: new Date(item.create_at).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      type: item.type === "lesson" ? "lesson" : "test", // fallback nếu BE trả sai
      flagged: false, // default
      activityId: item.activity_id,
      activityTitle: item.activity_title,
    }));

    return {
      items,
      total: res.data.total,
      page: res.data.page,
      pageCount: res.data.pageCount,
    };
  }
}
