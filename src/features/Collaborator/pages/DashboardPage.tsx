import { Box, Typography, Paper, Grid, useTheme } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";

// Mock Data cho Dashboard
const contentStats = [
  { name: "Đề Full Test", count: 12 },
  { name: "Đề Minitest", count: 35 },
  { name: "Video bài giảng", count: 80 },
  { name: "Bài tập vận dụng", count: 120 },
  { name: "Lý thuyết & Ngữ pháp", count: 45 },
  { name: "Từ vựng", count: 60 },
];

const pieData = [
  { id: 0, value: 300, label: "Đã hoàn thành" },
  { id: 1, value: 40, label: "Đang soạn thảo" },
  { id: 2, value: 12, label: "Chờ duyệt" },
];

const DashboardPage = () => {
  const theme = useTheme();

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
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          mb: 3,
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Card: Tổng quan nội dung */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            elevation={3}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
            >
              Tổng quan nội dung của tôi
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
            >
              352
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Tổng số mục đã tạo
            </Typography>
          </Paper>
        </Grid>

        {/* Card: Nội dung đang chờ duyệt */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            elevation={3}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
            >
              Đang chờ duyệt
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: theme.palette.warning.main }}
            >
              15
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Mục cần xem xét
            </Typography>
          </Paper>
        </Grid>

        {/* Card: Bình luận mới */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            elevation={3}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
            >
              Bình luận mới
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: theme.palette.success.main }}
            >
              8
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Bình luận chưa đọc
            </Typography>
          </Paper>
        </Grid>

        {/* Biểu đồ số lượng nội dung theo loại */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              height: 400,
            }}
            elevation={3}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
            >
              Số lượng nội dung theo loại
            </Typography>
            <Box sx={{ width: "100%", height: "80%" }}>
              <BarChart
                dataset={contentStats}
                xAxis={[{ scaleType: "band", dataKey: "name" }]}
                yAxis={[{ label: "Số lượng" }]}
                series={[{ dataKey: "count", label: "Số lượng" }]}
                slotProps={{
                  legend: {
                    position: { vertical: "bottom", horizontal: "center" },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Biểu đồ Tỷ lệ trạng thái nội dung */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              height: 400,
            }}
            elevation={3}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
            >
              Tỷ lệ trạng thái nội dung
            </Typography>
            <Box sx={{ width: "100%", height: "80%" }}>
              <PieChart
                series={[
                  {
                    data: pieData,
                    arcLabel: (item) => `${item.value}`,
                    arcLabelMinAngle: 35,
                    arcLabelRadius: "70%",
                  },
                ]}
                slotProps={{
                  legend: {
                    position: { vertical: "bottom", horizontal: "center" },
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

export default DashboardPage;
