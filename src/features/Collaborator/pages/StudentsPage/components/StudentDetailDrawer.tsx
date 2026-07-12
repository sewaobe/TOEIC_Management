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
  LinearProgress,
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
              <Paper sx={{ p: 1.5, borderRadius: 2, height: "100%" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                >
                  <TrackChangesIcon fontSize="small" />
                  <Typography variant="caption">Điểm ước tính</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {student.currentScore}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {student.estimatedListeningScore != null && student.estimatedReadingScore != null
                    ? `L: ${student.estimatedListeningScore} · R: ${student.estimatedReadingScore}`
                    : `/ ${student.targetScore}`}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {getScoreSourceLabel(student.scoreSource)}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 1.5, borderRadius: 2, height: "100%" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                >
                  <TrendingUpIcon fontSize="small" />
                  <Typography variant="caption">Lộ trình hiện tại</Typography>
                </Box>
                {(() => {
                  const route = getLearningRouteDisplay(student);
                  return (
                    <>
                      <Typography variant="h6" fontWeight={600}>
                        {route.primary}
                      </Typography>
                      {route.secondary && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {route.secondary}
                        </Typography>
                      )}
                      {route.caption && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {route.caption}
                        </Typography>
                      )}
                    </>
                  );
                })()}
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 1.5, borderRadius: 2, height: "100%" }}>
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
              <Paper sx={{ p: 1.5, borderRadius: 2, height: "100%" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  color="text.secondary"
                >
                  <TrackChangesIcon fontSize="small" />
                  <Typography variant="caption">Mục tiêu</Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {student.targetScore || "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  điểm TOEIC
                </Typography>
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
                  {/* Thống kê feedback */}
                  {feedbackStats && feedbackStats.totalFeedbacks > 0 && (
                    <Paper sx={{ p: 2 }}>
                      <Typography fontWeight={600} gutterBottom>
                        <FeedbackIcon
                          fontSize="small"
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />
                        Thống kê đánh giá
                      </Typography>
                      <Grid container spacing={2} mt={1}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box textAlign="center">
                            <Typography variant="h4" fontWeight={700} color="primary">
                              {feedbackStats.averageRating.toFixed(1)}
                            </Typography>
                            <Rating
                              value={feedbackStats.averageRating}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography variant="caption" color="text.secondary">
                              Trung bình
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box textAlign="center">
                            <Typography variant="h4" fontWeight={700}>
                              {feedbackStats.totalFeedbacks}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tổng đánh giá
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box textAlign="center">
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              color="success.main"
                            >
                              {feedbackStats.positiveFeedbacks}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tích cực (4-5⭐)
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box textAlign="center">
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              color="warning.main"
                            >
                              {feedbackStats.negativeFeedbacks}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Cần cải thiện
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Rating Distribution */}
                      <Box mt={2}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Phân bố đánh giá
                        </Typography>
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count =
                            feedbackStats.ratingDistribution[
                              star as keyof typeof feedbackStats.ratingDistribution
                            ];
                          const percentage =
                            feedbackStats.totalFeedbacks > 0
                              ? (count / feedbackStats.totalFeedbacks) * 100
                              : 0;
                          return (
                            <Box
                              key={star}
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={0.5}
                            >
                              <Typography variant="caption" sx={{ width: 20 }}>
                                {star}⭐
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{
                                  flex: 1,
                                  height: 8,
                                  borderRadius: 1,
                                  bgcolor: "grey.200",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor:
                                      star >= 4
                                        ? "success.main"
                                        : star === 3
                                          ? "warning.main"
                                          : "error.main",
                                  },
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ width: 30, textAlign: "right" }}
                              >
                                {count}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Paper>
                  )}

                  {/* Danh sách feedback */}
                  <Paper sx={{ p: 2 }}>
                    <Typography fontWeight={600} gutterBottom>
                      Lịch sử đánh giá ({feedbacks.length})
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
                              p: 1.5,
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                              bgcolor: fb.is_positive
                                ? "success.lighter"
                                : "warning.lighter",
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box display="flex" alignItems="center" gap={1}>
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
                              <Typography variant="caption" color="text.secondary">
                                {format(
                                  new Date(fb.created_at),
                                  "dd/MM/yyyy HH:mm",
                                  { locale: vi }
                                )}
                              </Typography>
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
                                color="text.secondary"
                                sx={{ mt: 1, fontStyle: "italic" }}
                              >
                                "{fb.comment}"
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
