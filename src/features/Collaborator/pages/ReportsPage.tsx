import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";

// Mock Data cho Báo cáo
const monthlyContentData = [
  {
    month: "Tháng 1",
    fullTest: 3,
    minitest: 10,
    video: 15,
    grammar: 5,
    vocab: 8,
    practice: 12,
  },
  {
    month: "Tháng 2",
    fullTest: 4,
    minitest: 12,
    video: 18,
    grammar: 6,
    vocab: 10,
    practice: 15,
  },
  {
    month: "Tháng 3",
    fullTest: 5,
    minitest: 15,
    video: 20,
    grammar: 7,
    vocab: 12,
    practice: 18,
  },
  {
    month: "Tháng 4",
    fullTest: 6,
    minitest: 18,
    video: 22,
    grammar: 8,
    vocab: 14,
    practice: 20,
  },
];

const studentActivityData = [
  { week: "Tuần 1", activeStudents: 150, newStudents: 20 },
  { week: "Tuần 2", activeStudents: 165, newStudents: 25 },
  { week: "Tuần 3", activeStudents: 180, newStudents: 30 },
  { week: "Tuần 4", activeStudents: 170, newStudents: 18 },
];

const ReportsPage = () => {
  const theme = useTheme();

  // Mock state cho các bộ lọc báo cáo
  const [reportType, setReportType] = React.useState("contentCreation");
  const [timeRange, setTimeRange] = React.useState("monthly");

  const selectedData =
    reportType === "contentCreation" ? monthlyContentData : studentActivityData;
  const xAxisLabel = reportType === "contentCreation" ? "month" : "week";
  const series =
    reportType === "contentCreation"
      ? [
          { dataKey: "fullTest", label: "Đề Full Test" },
          { dataKey: "minitest", label: "Đề Minitest" },
          { dataKey: "video", label: "Video bài giảng" },
          { dataKey: "grammar", label: "Lý thuyết & Ngữ pháp" },
          { dataKey: "vocab", label: "Từ vựng" },
          { dataKey: "practice", label: "Bài tập vận dụng" },
        ]
      : [
          { dataKey: "activeStudents", label: "Học viên hoạt động" },
          { dataKey: "newStudents", label: "Học viên mới" },
        ];

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.default,
        overflow: "auto",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{ fontWeight: "bold", color: theme.palette.text.primary, mb: 3 }}
      >
        Báo cáo
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="report-type-label">Loại Báo cáo</InputLabel>
            <Select
              labelId="report-type-label"
              id="report-type-select"
              value={reportType}
              label="Loại Báo cáo"
              onChange={(e) => setReportType(e.target.value)}
              sx={{
                bgcolor: theme.palette.background.paper,
              }}
            >
              <MenuItem value="contentCreation">
                Số lượng nội dung đã tạo
              </MenuItem>
              <MenuItem value="studentActivity">Hoạt động học viên</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="time-range-label">Khoảng thời gian</InputLabel>
            <Select
              labelId="time-range-label"
              id="time-range-select"
              value={timeRange}
              label="Khoảng thời gian"
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{
                bgcolor: theme.palette.background.paper,
              }}
            >
              <MenuItem value="monthly">Theo tháng</MenuItem>
              <MenuItem value="quarterly">Theo quý</MenuItem>
              <MenuItem value="yearly">Theo năm</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              height: 450,
              boxShadow: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
            >
              Báo cáo (
              {reportType === "contentCreation"
                ? "Nội dung đã tạo"
                : "Hoạt động học viên"}
              )
            </Typography>
            <Box sx={{ width: "100%", height: "85%" }}>
              <LineChart
                dataset={selectedData}
                xAxis={[{ scaleType: "band", dataKey: xAxisLabel }]}
                series={series}
                slotProps={{
                  legend: {
                    position: { vertical: "bottom", horizontal: "center" },
                    direction: "horizontal",
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;
