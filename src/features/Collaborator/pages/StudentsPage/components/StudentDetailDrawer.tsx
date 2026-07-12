import { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
  Paper,
  Collapse,
  IconButton,
  Rating,
  Alert,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FeedbackIcon from "@mui/icons-material/Feedback";

import type { StudentDetail } from "../../../../../types/student";
import studentService from "../services/studentService"; // ✅ Dùng service thật
import feedbackService, {
  ILessonFeedback,
  IFeedbackStats,
} from "../services/feedbackService";
import {
  formatDate,
  formatDuration,
  getLearningRouteDisplay,
  getScoreSourceLabel,
} from "../utils/formatters";
import { ActivityList } from "./ActivityList";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
// use server-provided status from student object
import mailService from "../../../../../services/mail.service";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AbilityInterventionPanel } from "./AbilityInterventionPanel";

// ====================
// 🧩 Chip trạng thái
// ====================
function StatusChip({ status }: { status: string }) {
  const colorMap: Record<
    string,
    "default" | "success" | "warning" | "info" | "error"
  > = {
    not_started: "default",
    active: "success",
    inactive: "default",
    paused: "warning",
    completed: "info",
    at_risk: "error",
  };
  const labelMap: Record<string, string> = {
    not_started: "Chưa bắt đầu",
    active: "Đang học",
    inactive: "Không hoạt động",
    paused: "Tạm dừng",
    completed: "Hoàn thành",
    at_risk: "Nguy cơ bỏ học",
  };
  return (
    <Chip
      label={labelMap[status] || "Không xác định"}
      color={colorMap[status] || "default"}
      size="small"
    />
  );
}

function formatFeedbackDateTime(value?: string) {
  if (!value) return "Không rõ thời gian";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Không rõ thời gian";
  return format(date, "HH:mm dd/MM/yyyy", { locale: vi });
}

function getFeedbackDateParts(value?: string) {
  if (!value) {
    return { time: "Chưa có", date: "" };
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { time: "Không rõ", date: "thời gian" };
  }
  return {
    time: format(date, "HH:mm", { locale: vi }),
    date: format(date, "dd/MM/yyyy", { locale: vi }),
  };
}

function getFeedbackStageLabel(feedback: ILessonFeedback) {
  const parts: string[] = [];
  if (feedback.dayStudy?.cycleNo) parts.push(`Cycle ${feedback.dayStudy.cycleNo}`);
  if (feedback.dayStudy?.stageNo) parts.push(`Stage ${feedback.dayStudy.stageNo}`);
  return parts.length > 0 ? parts.join(" · ") : "Stage chưa xác định";
}

function getFeedbackLessonText(feedback: ILessonFeedback) {
  const titles = feedback.dayStudy?.lessonTitles ?? [];
  if (titles.length === 0) return "Chưa có thông tin bài học";
  if (titles.length <= 2) return titles.join(", ");
  return `${titles.slice(0, 2).join(", ")} và ${titles.length - 2} bài khác`;
}

function isFeedbackNeedingAttention(feedback: ILessonFeedback) {
  return feedback.rating <= 3 || !feedback.is_positive;
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
}: StudentDetailDrawerProps) {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("info");
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<ILessonFeedback[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<IFeedbackStats | null>(
    null
  );
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  useEffect(() => {
    if (studentId && open) {
      loadStudentDetail();
      loadFeedbacks();
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
      loadEmailLogs();
    } catch (error) {
      console.error("Error loading student detail:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadEmailLogs(page = 1) {
    if (!studentId) return;
    setLoadingEmails(true);
    try {
      const resp: any = await mailService.getEmailLogs(studentId, page);
      const items = resp?.data?.items || resp?.items || [];
      setEmailLogs(items);
    } catch (err) {
      console.error('Error loading email logs', err);
      setEmailLogs([]);
    } finally {
      setLoadingEmails(false);
    }
  }

  async function loadFeedbacks() {
    if (!studentId) return;
    setLoadingFeedbacks(true);
    try {
      const [feedbackList, stats] = await Promise.all([
        feedbackService.getByUserId(studentId),
        feedbackService.getStatsByUserId(studentId),
      ]);
      setFeedbacks(feedbackList);
      setFeedbackStats(stats);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
      setFeedbacks([]);
      setFeedbackStats(null);
    } finally {
      setLoadingFeedbacks(false);
    }
  }

  const feedbacksNeedingAttention = feedbacks.filter(isFeedbackNeedingAttention);
  const latestFeedbackDate = getFeedbackDateParts(feedbacks[0]?.created_at);

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
                <StatusChip status={student.status || 'inactive'} />
              </Box>
            </Box>
          </Box>

          {/* 📊 Chỉ số nhanh */}
          <Grid container spacing={1} mt={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  height: "100%",
                  minHeight: 118,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                  sx={{ minHeight: 20 }}
                >
                  <TrackChangesIcon fontSize="small" />
                  <Typography variant="caption" noWrap>
                    Điểm ước tính
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 1, lineHeight: 1.2 }}>
                  {student.currentScore}
                </Typography>
                <Box sx={{ mt: "auto", pt: 0.5, minHeight: 36 }}>
                  <Typography variant="caption" color="text.secondary" display="block" noWrap>
                    {student.estimatedListeningScore != null && student.estimatedReadingScore != null
                      ? `L: ${student.estimatedListeningScore} · R: ${student.estimatedReadingScore}`
                      : `/ ${student.targetScore}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" noWrap>
                    {getScoreSourceLabel(student.scoreSource)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  height: "100%",
                  minHeight: 118,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                  sx={{ minHeight: 20 }}
                >
                  <TrendingUpIcon fontSize="small" />
                  <Typography variant="caption" noWrap>
                    Lộ trình
                  </Typography>
                </Box>
                {(() => {
                  const route = getLearningRouteDisplay(student);
                  return (
                    <>
                      <Typography variant="h6" fontWeight={600} sx={{ mt: 1, lineHeight: 1.2 }} noWrap>
                        {route.primary}
                      </Typography>
                      <Box sx={{ mt: "auto", pt: 0.5, minHeight: 36 }}>
                        {route.secondary && (
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            {route.secondary}
                          </Typography>
                        )}
                        {route.caption && (
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            {route.caption}
                          </Typography>
                        )}
                      </Box>
                    </>
                  );
                })()}
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  height: "100%",
                  minHeight: 118,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                  sx={{ minHeight: 20 }}
                >
                  <LocalFireDepartmentIcon
                    sx={{ color: "orange" }}
                    fontSize="small"
                  />
                  <Typography variant="caption" noWrap>
                    Streak
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 1, lineHeight: 1.2 }}>
                  {student.studyStreak}
                </Typography>
                <Box sx={{ mt: "auto", pt: 0.5, minHeight: 36 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    ngày
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  height: "100%",
                  minHeight: 118,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                  sx={{ minHeight: 20 }}
                >
                  <TrackChangesIcon fontSize="small" />
                  <Typography variant="caption" noWrap>
                    Mục tiêu
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 1, lineHeight: 1.2 }}>
                  {student.targetScore || "—"}
                </Typography>
                <Box sx={{ mt: "auto", pt: 0.5, minHeight: 36 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    điểm TOEIC
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* 🧭 Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mt: 3, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Thông tin" value="info" />
            <Tab label="Lộ trình" value="learning-path" />
            <Tab label="Tiến độ" value="progress" />
            <Tab label="Hoạt động" value="activities" />
            <Tab label="Feedback" value="feedback" />
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
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Ngày đăng ký: {formatDate(student.enrollDate)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600}>Lịch sử email</Typography>
                {loadingEmails ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={20} />
                  </Box>
                ) : emailLogs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    Chưa có email nhắc nhở nào
                  </Typography>
                ) : (
                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {emailLogs.map((log) => (
                      <Box key={String(log._id)} sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 1 }}>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{log.subject}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(log.sent_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <IconButton size="small" onClick={() => setExpandedLogId(expandedLogId === String(log._id) ? null : String(log._id))} aria-label="expand">
                              <ExpandMoreIcon sx={{ transform: expandedLogId === String(log._id) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms' }} />
                            </IconButton>
                          </Box>
                        </Box>
                        <Collapse in={expandedLogId === String(log._id)} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
                            <div dangerouslySetInnerHTML={{ __html: log.body_html }} />
                          </Box>
                        </Collapse>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
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
                  <Chip
                    label="IRT tự tối ưu"
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                </Box>
                <Box mt={1.5} display="flex" flexDirection="column" gap={0.5}>
                  <Typography variant="body2">
                    <b>Ngày bắt đầu:</b>{" "}
                    {formatDate(student.learningPathConfig.startDate)}
                  </Typography>
                  <Typography variant="body2">
                    <b>Ngày kết thúc dự kiến:</b>{" "}
                    {formatDate(student.learningPathConfig.targetDate)}
                  </Typography>
                  <Typography variant="body2">
                    <b>Mục tiêu điểm:</b> {student.targetScore || "Chưa có"}
                  </Typography>
                  <Typography variant="body2">
                    <b>Nhịp học đăng ký:</b>{" "}
                    {student.learningPathConfig.lessonsPerWeek} buổi/tuần ·{" "}
                    {student.learningPathConfig.hoursPerDay} giờ/ngày
                  </Typography>
                </Box>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600}>Vị trí hiện tại</Typography>
                {(() => {
                  const route = getLearningRouteDisplay(student);
                  return (
                    <Box mt={1.5} display="flex" flexDirection="column" gap={0.5}>
                      <Typography variant="body2">
                        <b>{route.primary}</b>
                        {route.secondary ? ` · ${route.secondary}` : ""}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Roadmap là kế hoạch thích nghi; IRT có thể thêm, bớt hoặc đổi trọng tâm sau checkpoint.
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                        <Chip
                          label={`Hoàn thành ${student.completedCycles ?? 0}/${student.totalCycles ?? 0} cycle`}
                          size="small"
                          variant="outlined"
                        />
                        {student.currentCycleProgress && (
                          <Chip
                            label={`Stage hiện tại ${student.currentCycleProgress.completedStages}/${student.currentCycleProgress.totalStages}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        <Chip label="IRT tự điều chỉnh" size="small" color="info" variant="outlined" />
                      </Box>
                    </Box>
                  );
                })()}
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography fontWeight={600}>Theo dõi từ CTV</Typography>
                <Box mt={1.5} display="flex" flexDirection="column" gap={0.5}>
                  <Typography variant="body2">
                    <b>Điểm ước tính:</b> {student.currentScore}
                    {student.estimatedListeningScore != null && student.estimatedReadingScore != null
                      ? ` (Listening ${student.estimatedListeningScore}, Reading ${student.estimatedReadingScore})`
                      : ""}
                  </Typography>
                  <Typography variant="body2">
                    <b>Hoạt động gần nhất:</b> {formatDate(student.lastActive)}
                  </Typography>
                  <Typography variant="body2">
                    <b>Tổng thời gian học:</b> {formatDuration(student.totalStudyTime)}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}

          {tab === "progress" && (
            <Box mt={2}>
              <AbilityInterventionPanel student={student} onChanged={loadStudentDetail} />
            </Box>
          )}

          {tab === "activities" && (
            <Box mt={2}>
              <ActivityList activities={student.recentActivities} />
            </Box>
          )}

          {tab === "feedback" && (
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              {loadingFeedbacks ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  py={4}
                >
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  <Paper sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                      <FeedbackIcon fontSize="small" color="primary" />
                      <Box>
                        <Typography fontWeight={700}>Phản hồi từ học viên</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Học viên gửi sau khi hoàn thành từng stage trong lộ trình.
                        </Typography>
                      </Box>
                    </Box>

                    {feedbackStats && feedbackStats.totalFeedbacks > 0 ? (
                      <>
                        <Grid container spacing={1.5} alignItems="stretch">
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 1,
                                height: "100%",
                                minHeight: 104,
                                bgcolor: "rgba(25, 118, 210, 0.08)",
                                border: "1px solid",
                                borderColor: "divider",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Box>
                                <Typography variant="h5" fontWeight={700} color="primary" lineHeight={1.2}>
                                  {feedbackStats.averageRating.toFixed(1)}
                                </Typography>
                                <Rating
                                  value={feedbackStats.averageRating}
                                  precision={0.1}
                                  readOnly
                                  size="small"
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: "auto" }}>
                                Số sao TB
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 1,
                                height: "100%",
                                minHeight: 104,
                                border: "1px solid",
                                borderColor: "divider",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                                {feedbackStats.totalFeedbacks}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: "auto" }}>
                                Tổng phản hồi
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 1,
                                height: "100%",
                                minHeight: 104,
                                border: "1px solid",
                                borderColor:
                                  feedbacksNeedingAttention.length > 0
                                    ? "warning.main"
                                    : "divider",
                                bgcolor:
                                  feedbacksNeedingAttention.length > 0
                                    ? "rgba(255, 152, 0, 0.08)"
                                    : "transparent",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                variant="h5"
                                fontWeight={700}
                                lineHeight={1.2}
                                color={feedbacksNeedingAttention.length > 0 ? "warning.main" : "text.primary"}
                              >
                                {feedbacksNeedingAttention.length}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: "auto" }}>
                                Cần chú ý
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 3 }}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 1,
                                height: "100%",
                                minHeight: 104,
                                border: "1px solid",
                                borderColor: "divider",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                                {latestFeedbackDate.time}
                              </Typography>
                              {latestFeedbackDate.date && (
                                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                  {latestFeedbackDate.date}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary" sx={{ mt: "auto" }}>
                                Phản hồi gần nhất
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {feedbacksNeedingAttention.length > 0 && (
                          <Alert severity="warning" sx={{ mt: 1.5 }}>
                            Có {feedbacksNeedingAttention.length} phản hồi từ 1-3 sao hoặc bị đánh dấu cần cải thiện.
                            CTV nên xem lý do và hỏi thêm nếu học viên không ghi chú rõ.
                          </Alert>
                        )}

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                          Số sao trung bình phản ánh cảm nhận của riêng học viên này sau các stage đã hoàn thành.
                          Xem từng phản hồi bên dưới để biết stage nào làm học viên hài lòng hoặc bị vướng.
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Chưa có dữ liệu thống kê phản hồi.
                      </Typography>
                    )}
                  </Paper>

                  <Paper sx={{ p: 2 }}>
                    <Typography fontWeight={700} gutterBottom>
                      Lịch sử phản hồi ({feedbacks.length})
                    </Typography>
                    {feedbacks.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ py: 2 }}
                      >
                        Học viên chưa gửi đánh giá nào
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          mt: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          maxHeight: 400,
                          overflowY: "auto",
                        }}
                      >
                        {feedbacks.map((fb, index) => (
                          <Box
                            key={fb._id || index}
                            sx={{
                              p: 1.75,
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: isFeedbackNeedingAttention(fb)
                                ? "warning.main"
                                : "divider",
                              bgcolor: isFeedbackNeedingAttention(fb)
                                ? "rgba(255, 152, 0, 0.06)"
                                : "background.paper",
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              gap={1}
                            >
                              <Box>
                                <Typography variant="body2" fontWeight={700}>
                                  {getFeedbackStageLabel(fb)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {getFeedbackLessonText(fb)}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {formatFeedbackDateTime(fb.created_at)}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                                <Rating
                                  value={fb.rating}
                                  readOnly
                                  size="small"
                                />
                                <Chip
                                  label={
                                    fb.is_positive ? "Tích cực" : "Cần cải thiện"
                                  }
                                  color={fb.is_positive ? "success" : "warning"}
                                  size="small"
                                />
                            </Box>

                            {fb.reasons.length > 0 && (
                              <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                                {fb.reasons.map((reason, i) => (
                                  <Chip
                                    key={i}
                                    label={reason}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: "0.7rem" }}
                                  />
                                ))}
                              </Box>
                            )}

                            {fb.comment && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: "rgba(15, 23, 42, 0.04)",
                                  color: "text.primary",
                                }}
                              >
                                "{fb.comment}"
                              </Typography>
                            )}

                            {isFeedbackNeedingAttention(fb) && !fb.comment && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                Học viên không ghi chú thêm. CTV nên hỏi ngắn để biết vướng ở nội dung, thời lượng hay độ khó.
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                </>
              )}
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

    </Drawer>
  );
}
