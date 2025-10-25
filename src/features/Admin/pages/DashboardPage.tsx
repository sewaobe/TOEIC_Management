"use client";

import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Chip,
  Stack,
  Badge,
  LinearProgress,
  Button,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { motion, easeOut } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

// ================= ANIMATION =================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

// ================= DATA =================
const summaryData = [
  {
    title: "Tổng số bài học",
    value: "248",
    change: "+12 so với tuần trước",
    icon: "📚",
    color: "#E0F2FE",
    borderColor: "#0EA5E9",
  },
  {
    title: "Đề thi chờ duyệt",
    value: "18",
    change: "+5 so với tuần trước",
    icon: "⏳",
    color: "#FEF3C7",
    borderColor: "#F97316",
  },
  {
    title: "CTV hoạt động",
    value: "42",
    change: "+3 so với tuần trước",
    icon: "👥",
    color: "#F3E8FF",
    borderColor: "#A855F7",
  },
  {
    title: "Học viên đang học",
    value: "1,256",
    change: "+89 so với tuần trước",
    icon: "🎓",
    color: "#DCFCE7",
    borderColor: "#22C55E",
  },
  {
    title: "Lộ trình học chạy",
    value: "34",
    change: "+2 so với tuần trước",
    icon: "🚀",
    color: "#FCE7F3",
    borderColor: "#EC4899",
  },
  {
    title: "Bình luận mới",
    value: "156",
    change: "+28 so với tuần trước",
    icon: "💬",
    color: "#FEFCE8",
    borderColor: "#EAB308",
  },
];

const barChartData = [
  { month: "Tháng 1", lessons: 45, exams: 12, contributors: 8 },
  { month: "Tháng 2", lessons: 52, exams: 15, contributors: 10 },
  { month: "Tháng 3", lessons: 48, exams: 18, contributors: 9 },
  { month: "Tháng 4", lessons: 61, exams: 22, contributors: 12 },
  { month: "Tháng 5", lessons: 55, exams: 19, contributors: 11 },
  { month: "Tháng 6", lessons: 67, exams: 25, contributors: 14 },
];

const lineChartData = [
  { week: "Tuần 1", active: 320 },
  { week: "Tuần 2", active: 380 },
  { week: "Tuần 3", active: 420 },
  { week: "Tuần 4", active: 480 },
  { week: "Tuần 5", active: 520 },
  { week: "Tuần 6", active: 580 },
  { week: "Tuần 7", active: 620 },
  { week: "Tuần 8", active: 680 },
];

const pieDataGroups = {
  examStatus: [
    { id: 0, value: 145, label: "Đã duyệt" },
    { id: 1, value: 38, label: "Chờ duyệt" },
    { id: 2, value: 12, label: "Từ chối" },
  ],
  lessonParts: [
    { id: 0, value: 35, label: "Part 1" },
    { id: 1, value: 32, label: "Part 2" },
    { id: 2, value: 28, label: "Part 3" },
    { id: 3, value: 30, label: "Part 4" },
    { id: 4, value: 25, label: "Part 5" },
    { id: 5, value: 27, label: "Part 6" },
    { id: 6, value: 31, label: "Part 7" },
  ],
  studentLevels: [
    { id: 0, value: 120, label: "A1" },
    { id: 1, value: 180, label: "A2" },
    { id: 2, value: 320, label: "B1" },
    { id: 3, value: 420, label: "B2" },
    { id: 4, value: 216, label: "C1" },
  ],
};

const activityData = [
  {
    type: "Đề thi",
    name: "Full Test 005",
    creator: "Lê Minh",
    date: "24/10/2025",
    status: "pending",
    label: "Chờ duyệt",
  },
  {
    type: "Bài học",
    name: "Unit 4 – Emails",
    creator: "CTV Phúc",
    date: "23/10/2025",
    status: "approved",
    label: "Đã duyệt",
  },
  {
    type: "Học viên",
    name: "Nguyễn An",
    creator: "—",
    date: "23/10/2025",
    status: "new",
    label: "Đăng ký mới",
  },
  {
    type: "Bài học",
    name: "Unit 3 – Meetings",
    creator: "CTV Linh",
    date: "21/10/2025",
    status: "pending",
    label: "Chờ duyệt",
  },
];

const alerts = [
  {
    icon: "📋",
    title: "Đề thi chờ duyệt",
    count: 5,
    color: "#F97316",
    bgColor: "#FEF3C7",
  },
  {
    icon: "👥",
    title: "Yêu cầu CTV mới",
    count: 2,
    color: "#A855F7",
    bgColor: "#F3E8FF",
  },
  {
    icon: "💬",
    title: "Bình luận bị báo cáo",
    count: 3,
    color: "#EF4444",
    bgColor: "#FEE2E2",
  },
];

const progressData = [
  {
    title: "Hoàn thành lộ trình học tuần này",
    value: 68,
    comparison: "+5% so với tháng trước",
    color: "#2563EB",
  },
  {
    title: "Tỷ lệ duyệt đề thi trong tháng",
    value: 82,
    comparison: "+8% so với tháng trước",
    color: "#F97316",
  },
  {
    title: "Bài học được đánh giá cao (≥4⭐)",
    value: 74,
    comparison: "+3% so với tháng trước",
    color: "#22C55E",
  },
];

// ================= HELPERS =================
const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return { bg: "#DCFCE7", text: "#166534" };
    case "pending":
      return { bg: "#FEF3C7", text: "#92400E" };
    case "new":
      return { bg: "#E0F2FE", text: "#0369A1" };
    default:
      return { bg: "#F3F4F6", text: "#374151" };
  }
};

// ================= MAIN COMPONENT =================
export default function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const textColor = theme.palette.text.primary;
  const paperColor = theme.palette.background.paper;

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const borderColor = theme.palette.divider;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? theme.palette.background.default
          : "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            flexWrap="wrap"
            gap={2}
            mb={4}
          >
            <Box>
              <Typography variant="h1" sx={{ color: textColor, mb: 1 }}>
                Xin chào, Quản trị viên 👋
              </Typography>
              <Typography color="text.secondary" mb={1}>
                {today}
              </Typography>
              <Chip
                label="Bạn có 8 yêu cầu chờ duyệt và 3 đề thi cần xem hôm nay"
                sx={{
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                }}
              />
            </Box>
            <Button variant="outlined" startIcon={<RefreshIcon />}>
              Làm mới
            </Button>
          </Box>

          {/* SUMMARY CARDS */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {summaryData.map((item, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Card
                    sx={{
                      p: 3,
                      background: paperColor,
                      border: `2px solid ${item.borderColor}`,
                      borderRadius: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Typography color="text.secondary" fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Typography fontSize="1.5rem">{item.icon}</Typography>
                    </Stack>
                    <Typography variant="h2" color={textColor} fontWeight={700}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.change}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* BAR & LINE CHARTS */}
          <Grid container spacing={3} mb={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography
                  variant="h3"
                  color={textColor}
                  mb={3}
                  fontWeight={700}
                >
                  Thống kê tạo mới theo tháng
                </Typography>
                <BarChart
                  height={300}
                  xAxis={[
                    {
                      data: barChartData.map((d) => d.month),
                      scaleType: "band",
                    },
                  ]}
                  series={[
                    {
                      data: barChartData.map((d) => d.lessons),
                      label: "Bài học",
                      color: "#2563EB",
                    },
                    {
                      data: barChartData.map((d) => d.exams),
                      label: "Đề thi",
                      color: "#F97316",
                    },
                    {
                      data: barChartData.map((d) => d.contributors),
                      label: "CTV",
                      color: "#A855F7",
                    },
                  ]}
                />
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography
                  variant="h3"
                  color={textColor}
                  mb={3}
                  fontWeight={700}
                >
                  Học viên hoạt động theo tuần
                </Typography>
                <LineChart
                  height={300}
                  xAxis={[{ data: lineChartData.map((d) => d.week) }]}
                  series={[
                    {
                      data: lineChartData.map((d) => d.active),
                      label: "Học viên hoạt động",
                      color: "#2563EB",
                    },
                  ]}
                />
              </Card>
            </Grid>
          </Grid>

          {/* PIE CHARTS */}
          <Grid container spacing={3} mb={4}>
            {Object.entries(pieDataGroups).map(([key, data], i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    color={textColor}
                    mb={2}
                    fontWeight={700}
                  >
                    {key === "examStatus" && "Trạng thái đề thi"}
                    {key === "lessonParts" && "Phân bổ bài học"}
                    {key === "studentLevels" && "Phân bố trình độ"}
                  </Typography>
                  <PieChart height={220} series={[{ data }]} />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ACTIVITY TABLE & ALERTS */}
          <Grid container spacing={2} sx={{ mt: 2, mb: 4 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <motion.div variants={itemVariants}>
                <Card sx={{ p: 3, borderRadius: 3 }}>
                  <Typography
                    variant="h3"
                    color={textColor}
                    mb={3}
                    fontWeight={700}
                  >
                    Hoạt động gần đây
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{ borderBottom: `2px solid ${borderColor}` }}
                        >
                          <TableCell sx={{ color: textColor, fontWeight: 700 }}>
                            Loại
                          </TableCell>
                          <TableCell sx={{ color: textColor, fontWeight: 700 }}>
                            Tên
                          </TableCell>
                          <TableCell sx={{ color: textColor, fontWeight: 700 }}>
                            Người tạo
                          </TableCell>
                          <TableCell sx={{ color: textColor, fontWeight: 700 }}>
                            Ngày
                          </TableCell>
                          <TableCell sx={{ color: textColor, fontWeight: 700 }}>
                            Trạng thái
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activityData.map((row, index) => {
                          const c = getStatusColor(row.status);
                          return (
                            <TableRow
                              key={index}
                              sx={{
                                borderBottom: `1px solid ${borderColor}`,
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <TableCell sx={{ color: textColor }}>
                                {row.type}
                              </TableCell>
                              <TableCell
                                sx={{ color: textColor, fontWeight: 500 }}
                              >
                                {row.name}
                              </TableCell>
                              <TableCell sx={{ color: textColor }}>
                                {row.creator}
                              </TableCell>
                              <TableCell sx={{ color: textColor }}>
                                {row.date}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.label}
                                  sx={{
                                    backgroundColor: c.bg,
                                    color: c.text,
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants}>
                <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                  <Typography
                    variant="h3"
                    color={textColor}
                    mb={3}
                    fontWeight={700}
                  >
                    ⚠️ Cảnh báo & Nhiệm vụ
                  </Typography>
                  <Stack spacing={2}>
                    {alerts.map((a, i) => {
                      const bg = a.bgColor;
                      const isLight = theme.palette.mode === "light";
                      const textClr = isLight
                        ? theme.palette.text.primary
                        : "#0F172A"; // 👈 chữ đen trên nền sáng
                      const borderClr = isLight
                        ? a.color
                        : theme.palette.divider;

                      return (
                        <Box
                          key={i}
                          sx={{
                            p: 2,
                            background: bg,
                            border: `1px solid ${borderClr}`,
                            borderRadius: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateX(4px)",
                              boxShadow: 3,
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography fontSize="1.5rem">{a.icon}</Typography>
                            <Typography
                              fontWeight={600}
                              sx={{ color: textClr }}
                            >
                              {a.title}
                            </Typography>
                          </Box>
                          <Badge
                            badgeContent={a.count}
                            sx={{
                              "& .MuiBadge-badge": {
                                backgroundColor: a.color,
                                color: "#fff",
                                fontWeight: 700,
                              },
                            }}
                          >
                            <Box />
                          </Badge>
                        </Box>
                      );
                    })}
                  </Stack>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* PROGRESS BARS */}
          <motion.div variants={itemVariants}>
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Typography
                variant="h3"
                color={textColor}
                mb={4}
                fontWeight={700}
              >
                📊 Thanh tiến độ
              </Typography>
              <Grid container spacing={4}>
                {progressData.map((p, i) => (
                  <Grid key={i} size={{ xs: 12, md: 4 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography color={textColor} fontWeight={600} mb={1}>
                          {p.title}
                        </Typography>
                        <Typography color="text.secondary" fontSize="0.85rem">
                          {p.comparison}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          color={p.color}
                          fontWeight={700}
                          fontSize="1.25rem"
                          mb={1}
                        >
                          {p.value}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={p.value}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: theme.palette.divider,
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: p.color,
                            },
                          }}
                        />
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
