"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import type { StudentDetail } from "../../../../../types/student";
import type { IAdjustmentRequest } from "../../../../../types/adjustment";
import studentService from "../services/studentService"; // ✅ Dùng service thật
import { adjustmentService } from "../services/adjustmentService";
import {
  formatDate,
  formatDuration,
  getLearningPathLabel,
} from "../utils/formatters";
import { ProgressCharts } from "./ProgressCharts";
import { ActivityList } from "./ActivityList";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AdjustmentHistoryDialog } from "./AdjustmentHistoryDialog";

// ====================
// 🧩 Chip trạng thái
// ====================
function StatusChip({ status }: { status: string }) {
  const colorMap: Record<
    string,
    "default" | "success" | "warning" | "info" | "error"
  > = {
    active: "success",
    inactive: "default",
    paused: "warning",
    completed: "info",
  };
  const labelMap: Record<string, string> = {
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
    />
  );
}

interface StudentDetailDrawerProps {
  studentId: string | null;
  open: boolean;
  onClose: () => void;
  onAdjustLearningPath?: (studentId: string) => void;
}

export function StudentDetailDrawer({
  studentId,
  open,
  onClose,
  onAdjustLearningPath,
}: StudentDetailDrawerProps) {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [adjustmentHistory, setAdjustmentHistory] = useState<
    IAdjustmentRequest[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("info");
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (studentId && open) {
      loadStudentDetail();
      loadAdjustmentHistory();
    }
  }, [studentId, open]);

  // ======================
  // 📡 Lấy dữ liệu từ API
  // ======================
  async function loadStudentDetail() {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await studentService.getById(studentId);
      setStudent(res);
    } catch (error) {
      console.error("Error loading student detail:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAdjustmentHistory() {
    if (!studentId) return;
    try {
      const history = await adjustmentService.getByStudentId(studentId);
      setAdjustmentHistory(history);
    } catch (error) {
      console.error("Error loading adjustment history:", error);
      setAdjustmentHistory([]);
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDrawer-paper": { width: "600px", p: 3 } }}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : student ? (
        <Box>
          {/* 🧭 Header */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Chi tiết học viên
          </Typography>

          {/* 🧑 Thông tin cơ bản */}
          <Box display="flex" alignItems="flex-start" gap={2} mt={2}>
            <Avatar
              src={student.avatar}
              alt={student.name}
              sx={{ width: 72, height: 72, fontSize: 28 }}
            >
              {student.name.charAt(0)}
            </Avatar>

            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold">
                {student.name}
              </Typography>
              {/* <Typography variant="body2" color="text.secondary">
                {student.id}
              </Typography> */}

              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                <StatusChip status={student.status} />
                <Chip
                  label={getLearningPathLabel(student.learningPath)}
                  variant="outlined"
                  size="small"
                />
                <Chip label={student.currentLevel} color="info" size="small" />
              </Box>
            </Box>
          </Box>

          {/* 📊 Chỉ số nhanh */}
          <Grid container spacing={1} mt={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 1.5, borderRadius: 2 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                >
                  <TrackChangesIcon fontSize="small" />
                  <Typography variant="caption">Điểm</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {student.currentScore}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  / {student.targetScore}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 1.5, borderRadius: 2 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                >
                  <TrendingUpIcon fontSize="small" />
                  <Typography variant="caption">Tiến độ</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {Math.round(
                    (student.completedLessons / student.totalLessons) * 100
                  )}
                  %
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {student.completedLessons}/{student.totalLessons}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 1.5, borderRadius: 2 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                >
                  <LocalFireDepartmentIcon
                    sx={{ color: "orange" }}
                    fontSize="small"
                  />
                  <Typography variant="caption">Streak</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {student.studyStreak}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ngày
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 1.5, borderRadius: 2 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                >
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="caption">Thời gian</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {formatDuration(student.totalStudyTime)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  tổng
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* 🧭 Tabs */}
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{ mt: 3, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Thông tin" value="info" />
            <Tab label="Lộ trình" value="learning-path" />
            <Tab label="Tiến độ" value="progress" />
            <Tab label="Hoạt động" value="activities" />
          </Tabs>

          {/* 📂 Nội dung các tab */}
          {tab === "info" && (
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600}>Thông tin liên hệ</Typography>
                <Box display="flex" flexDirection="column" gap={1} mt={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <MailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{student.email}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{student.phone}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Ngày đăng ký: {formatDate(student.enrollDate)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600}>Ghi chú</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {student.notes || "Không có ghi chú"}
                </Typography>
              </Paper>

              {student.tags.length > 0 && (
                <Paper sx={{ p: 2 }}>
                  <Typography fontWeight={600}>Tags</Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                    {student.tags.map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              )}
            </Box>
          )}

          {tab === "learning-path" && student.learningPathConfig && (
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <Paper sx={{ p: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontWeight={600}>Cấu hình lộ trình</Typography>
                  <Button
                    size="small"
                    onClick={() => onAdjustLearningPath?.(student.id)}
                  >
                    Điều chỉnh
                  </Button>
                </Box>
                <Box mt={1.5} display="flex" flexDirection="column" gap={0.5}>
                  <Typography variant="body2">
                    <b>Số buổi/tuần:</b>{" "}
                    {student.learningPathConfig.lessonsPerWeek}
                  </Typography>
                  <Typography variant="body2">
                    <b>Số giờ/ngày:</b> {student.learningPathConfig.hoursPerDay}
                  </Typography>
                  <Typography variant="body2">
                    <b>Ngày bắt đầu:</b>{" "}
                    {formatDate(student.learningPathConfig.startDate)}
                  </Typography>
                  <Typography variant="body2">
                    <b>Ngày mục tiêu:</b>{" "}
                    {formatDate(student.learningPathConfig.targetDate)}
                  </Typography>
                </Box>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600}>Lĩnh vực tập trung</Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                  {student.learningPathConfig.focusAreas.map((area, i) => (
                    <Chip
                      key={i}
                      label={area}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Paper>

              {/* Lịch sử điều chỉnh */}
              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600} gutterBottom>
                  Lịch sử điều chỉnh ({adjustmentHistory.length})
                </Typography>
                {adjustmentHistory.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2 }}
                  >
                    Chưa có yêu cầu điều chỉnh nào
                  </Typography>
                ) : (
                  <Box sx={{ mt: 1 }}>
                    {adjustmentHistory.map((request) => {
                      const isApproved = request.status === "APPROVED";
                      const isRejected = request.status === "REJECTED";
                      const isPending = request.status === "PENDING";

                      return (
                        <Box
                          key={request._id}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: isPending
                              ? "action.hover"
                              : isApproved
                              ? "success.lighter"
                              : "error.lighter",
                          }}
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {request.reason}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {format(
                                  new Date(request.createdAt),
                                  "dd/MM/yyyy HH:mm",
                                  { locale: vi }
                                )}
                              </Typography>
                            </Box>
                            <Chip
                              label={
                                isPending
                                  ? "Đang chờ"
                                  : isApproved
                                  ? "Đã duyệt"
                                  : "Từ chối"
                              }
                              color={
                                isPending
                                  ? "warning"
                                  : isApproved
                                  ? "success"
                                  : "error"
                              }
                              size="small"
                            />
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={0.5}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {request.changes.length} thay đổi
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedRequestId(request._id);
                                setHistoryDialogOpen(true);
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </Box>
                          {isRejected && request.rejectionReason && (
                            <Typography
                              variant="caption"
                              color="error.main"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              Lý do từ chối: {request.rejectionReason}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Paper>
            </Box>
          )}

          {tab === "progress" && (
            <Box mt={2}>
              <ProgressCharts data={student.progressHistory} />
            </Box>
          )}

          {tab === "activities" && (
            <Box mt={2}>
              <ActivityList activities={student.recentActivities} />
            </Box>
          )}
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Typography color="text.secondary">
            Không tìm thấy thông tin học viên
          </Typography>
        </Box>
      )}

      {/* Dialog xem chi tiết adjustment request */}
      {student && (
        <AdjustmentHistoryDialog
          open={historyDialogOpen}
          onClose={() => {
            setHistoryDialogOpen(false);
            setSelectedRequestId(null);
          }}
          studentId={student.id}
          studentName={student.name}
          initialRequestId={selectedRequestId}
        />
      )}
    </Drawer>
  );
}
