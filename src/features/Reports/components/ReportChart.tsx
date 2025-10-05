import { Box, Paper, Typography, CircularProgress } from "@mui/material"
import { BarChart, LineChart } from "@mui/x-charts"
import { useSelector } from "react-redux"
import { RootState } from "../../../stores/store"
import { ReportType } from "../../../types/Report"

export default function ReportChart() {
  const { reportType, data, loading } = useSelector(
    (state: RootState) => state.reportFilter
  )

  // Xác định loại biểu đồ
  const isLineChart =
    reportType === "ratingPerformance" || reportType === "overallPerformance"
  const isBarChart =
    reportType === "contentCreation" || reportType === "studentActivity"
  const isMixedChart =
    reportType === "commentFeedback" || reportType === "errorReports"

  if (loading)
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          height: 450,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Paper>
    )

  if (!data || data.length === 0)
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          height: 450,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="text.secondary">Không có dữ liệu</Typography>
      </Paper>
    )

  // 🔹 Xác định trục & series (dựa theo dữ liệu mock)
  const xKey =
    reportType === "studentActivity" ? "week" : "month"

  const seriesMap: Record<ReportType, { dataKey: string; label: string }[]> = {
    contentCreation: [
      { dataKey: "fullTest", label: "Đề Full Test" },
      { dataKey: "minitest", label: "Minitest" },
      { dataKey: "video", label: "Video" },
      { dataKey: "vocab", label: "Từ vựng" },
    ],
    studentActivity: [
      { dataKey: "activeStudents", label: "Học viên hoạt động" },
      { dataKey: "newStudents", label: "Học viên mới" },
    ],
    commentFeedback: [
      { dataKey: "comments", label: "Tổng bình luận" },
      { dataKey: "positive", label: "Phản hồi tích cực" },
      { dataKey: "negative", label: "Phản hồi tiêu cực" },
    ],
    errorReports: [
      { dataKey: "reported", label: "Báo lỗi" },
      { dataKey: "resolved", label: "Đã xử lý" },
    ],
    ratingPerformance: [
      { dataKey: "avgRating", label: "Điểm trung bình" },
      { dataKey: "fiveStars", label: "Đánh giá 5 sao" },
    ],
    overallPerformance: [
      { dataKey: "completionRate", label: "Hoàn thành (%)" },
      { dataKey: "engagementRate", label: "Tương tác (%)" },
    ],
  }

  const series = seriesMap[reportType]

  return (
    <Paper sx={{ p: 3, borderRadius: 2, height: 450, boxShadow: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Báo cáo: {reportType}
      </Typography>

      <Box sx={{ width: "100%", height: "85%" }}>
        {isLineChart ? (
          <LineChart
            dataset={data}
            xAxis={[{ scaleType: "band", dataKey: xKey }]}
            series={series}
            slotProps={{
              legend: { position: { vertical: "bottom", horizontal: "center" } },
            }}
          />
        ) : isBarChart ? (
          <BarChart
            dataset={data}
            xAxis={[{ scaleType: "band", dataKey: xKey }]}
            series={series}
            slotProps={{
              legend: { position: { vertical: "bottom", horizontal: "center" } },
            }}
          />
        ) : isMixedChart ? (
          <>
            <BarChart
              dataset={data}
              xAxis={[{ scaleType: "band", dataKey: xKey }]}
              series={[series[0]]}
              height={200}
            />
            <LineChart
              dataset={data}
              xAxis={[{ scaleType: "band", dataKey: xKey }]}
              series={series.slice(1)}
              height={220}
            />
          </>
        ) : null}
      </Box>
    </Paper>
  )
}
