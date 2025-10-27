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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { motion, easeOut } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { LinearProgress } from "@mui/material";
import {
  School,
  LibraryBooks,
  PendingActions,
  Groups,
  Forum,
  RocketLaunch,
  Assignment,
  People,
  ReportProblem,
  ShowChart,
} from "@mui/icons-material";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

// ================= MOCK DATA =================
const summaryConfig = {
  totalLessons: {
    title: "Tổng số bài học",
    icon: <LibraryBooks color="primary" />,
    borderColor: "#0EA5E9",
  },
  pendingExams: {
    title: "Đề thi chờ duyệt",
    icon: <PendingActions color="warning" />,
    borderColor: "#F97316",
  },
  activeContribs: {
    title: "CTV hoạt động",
    icon: <Groups color="secondary" />,
    borderColor: "#A855F7",
  },
  activeStudents: {
    title: "Học viên đang học",
    icon: <School color="success" />,
    borderColor: "#22C55E",
  },
  runningPaths: {
    title: "Lộ trình đang chạy",
    icon: <RocketLaunch color="error" />,
    borderColor: "#EC4899",
  },
  newComments: {
    title: "Bình luận mới",
    icon: <Forum color="info" />,
    borderColor: "#EAB308",
  },
};

const summaryData = [
  { key: "totalLessons", value: 248, change: "+12 so với tuần trước" },
  { key: "pendingExams", value: 18, change: "+5 so với tuần trước" },
  { key: "activeContribs", value: 42, change: "+3 so với tuần trước" },
  { key: "activeStudents", value: 1256, change: "+89 so với tuần trước" },
  { key: "runningPaths", value: 34, change: "+2 so với tuần trước" },
  { key: "newComments", value: 156, change: "+28 so với tuần trước" },
];

const barChartData = [
  { week: "Tuần 1", lessons: 12, exams: 4, contributors: 3 },
  { week: "Tuần 2", lessons: 14, exams: 6, contributors: 4 },
  { week: "Tuần 3", lessons: 18, exams: 5, contributors: 5 },
  { week: "Tuần 4", lessons: 20, exams: 7, contributors: 6 },
];

const lineChartData = [
  { week: "Tuần 1", active: 320 },
  { week: "Tuần 2", active: 380 },
  { week: "Tuần 3", active: 420 },
  { week: "Tuần 4", active: 480 },
  { week: "Tuần 5", active: 520 },
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
    icon: <Assignment sx={{ color: "#F97316" }} />,
    title: "Đề thi chờ duyệt",
    count: 5,
    color: "#F97316",
    bgColor: "#FEF3C7",
  },
  {
    icon: <People sx={{ color: "#A855F7" }} />,
    title: "Yêu cầu CTV mới",
    count: 2,
    color: "#A855F7",
    bgColor: "#F3E8FF",
  },
  {
    icon: <ReportProblem sx={{ color: "#EF4444" }} />,
    title: "Bình luận bị báo cáo",
    count: 3,
    color: "#EF4444",
    bgColor: "#FEE2E2",
  },
];

const progressByWeek = [
  {
    week: "Tuần 1",
    lessons: 45,
    learningPaths: 38,
    participation: 72,
  },
  {
    week: "Tuần 2",
    lessons: 58,
    learningPaths: 50,
    participation: 78,
  },
  {
    week: "Tuần 3",
    lessons: 67,
    learningPaths: 61,
    participation: 84,
  },
  {
    week: "Tuần 4",
    lessons: 82,
    learningPaths: 73,
    participation: 90,
  },
  {
    week: "Tuần 5",
    lessons: 90,
    learningPaths: 80,
    participation: 95,
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
  const textColor = theme.palette.text.primary;
  const paperColor = theme.palette.background.paper;

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "dark"
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
              {/* Header with waving icon */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: textColor,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  Xin chào, Quản trị viên
                </Typography>

                {/* 👋 Tay vẫy nhẹ, không đảo hướng */}
                <motion.div
                  animate={{ rotate: [0, 10, -8, 10, 0] }} // 👈 rung nhẹ, không xoay mạnh
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    display: "inline-block",
                    transformOrigin: "30% 80%", // xoay quanh cổ tay nhẹ thôi
                  }}
                >
                  <WavingHandIcon
                    sx={{
                      fontSize: 40,
                      color: "#F59E0B",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                    }}
                  />
                </motion.div>
              </Box>

              <Typography color="text.secondary">{today}</Typography>
              <Chip
                label="Bạn có 8 yêu cầu chờ duyệt và 3 đề thi cần xem hôm nay"
                sx={{
                  mt: 1,
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
          <Grid container spacing={2} mb={4}>
            {summaryData.map((item, i) => {
              const cfg = summaryConfig[item.key as keyof typeof summaryConfig];
              return (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      p: 3,
                      border: `2px solid ${cfg.borderColor}`,
                      borderRadius: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography color="text.secondary" fontWeight={600}>
                        {cfg.title}
                      </Typography>
                      {cfg.icon}
                    </Stack>
                    <Typography variant="h2" fontWeight={700}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.change}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* BAR + LINE CHART */}
          <Grid container spacing={3} mb={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h3" mb={3} fontWeight={700}>
                  Thống kê tạo mới theo tuần
                </Typography>
                <BarChart
                  height={300}
                  xAxis={[
                    {
                      data: barChartData.map((d) => d.week),
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
                <Typography variant="h3" mb={3} fontWeight={700}>
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
                  <Typography variant="h3" mb={2} fontWeight={700}>
                    {key === "examStatus" && "Trạng thái đề thi"}
                    {key === "lessonParts" && "Phân bổ bài học"}
                    {key === "studentLevels" && "Phân bố trình độ"}
                  </Typography>
                  <PieChart height={220} series={[{ data }]} />
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ACTIVITY TABLE + ALERTS */}
          <Grid container spacing={3} alignItems="stretch" mb={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ p: 3, height: "100%", borderRadius: 3 }}>
                <Typography variant="h3" mb={3} fontWeight={700}>
                  Hoạt động gần đây
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Loại</TableCell>
                        <TableCell>Tên</TableCell>
                        <TableCell>Người tạo</TableCell>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activityData.map((row, i) => {
                        const c = getStatusColor(row.status);
                        return (
                          <TableRow key={i} hover>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.creator}</TableCell>
                            <TableCell>{row.date}</TableCell>
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
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, height: "100%", borderRadius: 3 }}>
                <Typography variant="h3" mb={3} fontWeight={700}>
                  Nhiệm vụ cần làm
                </Typography>
                <Stack spacing={2}>
                  {alerts.map((a, i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${a.color}`,
                        background: a.bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        "&:hover": {
                          boxShadow: 3,
                          transform: "translateX(4px)",
                        },
                        transition: "0.3s",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        {a.icon}
                        <Typography fontWeight={600}>{a.title}</Typography>
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
                      />
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* PROGRESS MULTI-LINE CHART */}
          <motion.div variants={itemVariants}>
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <ShowChart sx={{ fontSize: 32, color: "#2563EB" }} />
                <Typography variant="h3" fontWeight={700}>
                  Tiến độ tổng thể theo tuần
                </Typography>
              </Stack>

              <LineChart
                height={340}
                grid={{ vertical: true, horizontal: true }}
                xAxis={[
                  {
                    scaleType: "point",
                    dataKey: "week",
                    label: "Tuần",
                    tickLabelStyle: { fontWeight: 600 },
                  },
                ]}
                yAxis={[
                  {
                    label: "Tỷ lệ (%)",
                    tickLabelStyle: { fontWeight: 600 },
                    min: 0,
                    max: 100,
                  },
                ]}
                series={[
                  {
                    curve: "monotoneX",
                    dataKey: "lessons",
                    label: "Hoàn thành bài học",
                    color: "#2563EB",
                    showMark: true,
                  },
                  {
                    curve: "monotoneX",
                    dataKey: "learningPaths",
                    label: "Lộ trình hoàn thành",
                    color: "#16A34A",
                    showMark: true,
                  },
                  {
                    curve: "monotoneX",
                    dataKey: "participation",
                    label: "Tỷ lệ tham gia học viên",
                    color: "#F59E0B",
                    showMark: true,
                  },
                ]}
                dataset={progressByWeek}
                sx={{
                  ".MuiLineElement-root": { strokeWidth: 3 },
                  ".MuiMarkElement-root": {
                    r: 4,
                    strokeWidth: 2,
                    stroke: "#fff",
                  },
                }}
              />
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
