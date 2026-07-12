"use client";

import {
  Avatar,
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import type { Student } from "../../../../../types/student";
import {
  formatRelativeTime,
  getLearningPathLabel,
  formatDuration,
  getLearningRouteDisplay,
  getScoreSourceLabel,
} from "../utils/formatters";

// =====================
// 🟩 Component con: Trạng thái
// =====================
function StatusChip({ status }: { status: string }) {
  const colorMap: Record<
    string,
    "default" | "success" | "warning" | "info" | "error"
  > = {
    not_started: "default",
    active: "success",
    at_risk: "error",
    inactive: "default",
    paused: "warning",
    completed: "info",
  };

  const labelMap: Record<string, string> = {
    not_started: "Chưa bắt đầu",
    at_risk: "Cần chú ý",
    active: "Đang học",
    inactive: "Không hoạt động",
    paused: "Tạm dừng",
    completed: "Hoàn thành",
  };

  return (
    <Chip
      label={labelMap[status] || "Không xác định"}
      color={colorMap[status] || "default"}
      size="small"
      variant="outlined"
    />
  );
}

// =====================
// 🧩 Component chính: Lưới học viên
// =====================
interface StudentGridProps {
  students: Student[];
  onStudentClick: (studentId: string) => void;
}

export function StudentGrid({ students, onStudentClick }: StudentGridProps) {
  const theme = useTheme();

  if (students.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
        }}
      >
        <Typography color="text.secondary">
          Không tìm thấy học viên nào
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {students.map((student) => (
        <Grid key={student.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-3px)",
              },
            }}
            onClick={() => onStudentClick(student.id)}
          >
            {/* Header */}
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              mb={2}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={student.avatar || undefined}
                  alt={student.name}
                  sx={{ width: 48, height: 48 }}
                >
                  {student.name?.charAt(0) || "?"}
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{student.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {student.email}
                  </Typography>
                </Box>
              </Stack>

              <StatusChip status={student.status || "inactive"} />
            </Stack>

            {/* Lộ trình & level */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Chip
                label={getLearningPathLabel(student.learningPath)}
                variant="outlined"
                size="small"
              />
              <Chip
                label={student.currentLevel || student.currentLevel || "A2"}
                variant="filled"
                color="info"
                size="small"
              />
            </Stack>

            {/* Lộ trình hiện tại */}
            {(() => {
              const route = getLearningRouteDisplay(student);
              return (
                <Box mb={1.5}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Lộ trình hiện tại
                  </Typography>
                  <Typography fontWeight={600}>{route.primary}</Typography>
                  {route.secondary && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {route.secondary}
                    </Typography>
                  )}
                  {route.caption && (
                    <Chip
                      label={route.caption}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              );
            })()}

            {/* Thống kê nhanh */}
            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid size={{ xs: 6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrackChangesIcon fontSize="small" color="action" />
                  <Box>
                    <Typography fontWeight={600}>
                      {student.currentScore}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Điểm ước tính
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {getScoreSourceLabel(student.scoreSource)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalFireDepartmentIcon
                    fontSize="small"
                    sx={{ color: theme.palette.warning.main }}
                  />
                  <Box>
                    <Typography fontWeight={600}>
                      {student.studyStreak ?? 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ngày liên tiếp
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" fontWeight={500}>
                      {formatDuration(student.totalStudyTime ?? 0)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tổng thời gian
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrendingUpIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" fontWeight={500}>
                      {formatRelativeTime(student.lastActive)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hoạt động
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
