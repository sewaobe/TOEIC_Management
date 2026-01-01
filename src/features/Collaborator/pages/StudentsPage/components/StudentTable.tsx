"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Avatar,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Box,
  Button,
} from "@mui/material";

import { Student } from "../../../../../types/student";
import { useState, useEffect } from "react";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
// Mail icon removed — action column replaces the inline icon
import { motion, AnimatePresence } from "framer-motion";
import { formatRelativeTime, getLearningPathLabel } from "../utils/formatters";
import mailService from "../../../../../services/mail.service";
import axiosClient from "../../../../../services/axiosClient";
import { toast } from "sonner";

// =============================
// 🧩 Component con: Tiến độ
// =============================
function ProgressBar({
  value,
  max,
  showPercentage = true,
}: {
  value: number;
  max: number;
  showPercentage?: boolean;
}) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: "action.hover",
          "& .MuiLinearProgress-bar": {
            borderRadius: 1,
          },
        }}
      />
      {showPercentage && (
        <Typography variant="caption" color="text.secondary">
          {percent}%
        </Typography>
      )}
    </Box>
  );
}

// =============================
// 🧩 Component con: Trạng thái
// =============================
function StatusChip({ status }: { status: string }) {
  const getColor = () => {
    switch (status) {
      case "active":
        return "success";
      case "at_risk":
        return "error";
      case "inactive":
        return "default";
      case "paused":
        return "warning";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };
  const getLabel = () => {
    switch (status) {
      case "active":
        return "Đang học";
      case "at_risk":
        return "Nguy cơ bỏ học";
      case "inactive":
        return "Không hoạt động";
      case "paused":
        return "Tạm dừng";
      case "completed":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };
  return (
    <Chip
      label={getLabel()}
      color={getColor() as any}
      size="small"
      variant="outlined"
    />
  );
}

// Client-side helpers: determine at-risk (no backend changes)
const AT_RISK_DAYS = 7; // threshold days to consider at-risk

export function startOfDayUTC(d?: string | Date | null) {
  if (!d) return null;
  const dt = new Date(d);
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
}

export function daysBetween(d1?: string | Date | null, d2?: Date | Date | null) {
  if (!d1 || !d2) return Infinity;
  const a = startOfDayUTC(d1)!.getTime();
  const b = startOfDayUTC(d2 as any)!.getTime();
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

function getDisplayStatus(student: Student) {
  const completionRate = (student.completedLessons && student.totalLessons)
    ? Math.round((student.completedLessons / student.totalLessons) * 100)
    : student.currentScore >= student.targetScore
    ? 100
    : 0;

  if (completionRate >= 100) return "completed";

  const last = student.lastActive || null;
  if (!last) return completionRate > 0 ? "active" : "inactive";

  const gap = daysBetween(last, new Date());
  if (gap === 0 || gap === 1) return "active";
  if (gap >= AT_RISK_DAYS) return "at_risk";
  return completionRate > 0 ? "active" : "inactive";
}

// Send reminder (FE only). Calls backend endpoint which may be implemented later.
interface EmailTemplate {
  subject: string;
  body: string;
}

async function sendReminderRequest(studentId: string, template?: EmailTemplate) {
  if (!template) throw new Error('Missing email template');
  return mailService.sendReminder(studentId, template);
}

// -----------------------
// Email modal (embedded)
// -----------------------
type ToneType = "gentle" | "professional" | "urgent";

const EMAIL_TEMPLATES: Record<ToneType, (s: Student) => EmailTemplate> = {
  gentle: (s) => ({
    subject: `Nhớ bạn quá, ${s.name} ơi!`,
    body: `Chào ${s.name},\n\nChúng mình nhận thấy đã ${daysBetween(s.lastActive, new Date()) || "nhiều"} ngày rồi bạn chưa ghé thăm lớp học.\n\nHọc tập là một hành trình dài, đôi khi chúng ta cần nghỉ ngơi một chút nhưng đừng quên quay lại để hoàn thành mục tiêu nhé. Nếu có khó khăn gì, hãy nhắn tin ngay cho đội ngũ hỗ trợ nha!\n\nThân mến,\nPhòng Quản lý học viên.`,
  }),
  professional: (s) => ({
    subject: `[Thông báo] Nhắc nhở tiến độ học tập - Học viên ${s.name}`,
    body: `Kính gửi anh/chị ${s.name},\n\nTheo hệ thống theo dõi, chúng tôi ghi nhận anh/chị đã không truy cập vào khóa học trong vòng ${daysBetween(s.lastActive, new Date()) || "nhiều"} ngày qua.\n\nĐể đảm bảo tiến độ và chất lượng đầu ra, anh/chị vui lòng sắp xếp thời gian quay lại học tập sớm nhất có thể. Nếu anh/chị gặp vấn đề kỹ thuật hoặc cần gia hạn, vui lòng phản hồi email này.\n\nTrân trọng,\nPhòng Quản lý học viên.`,
  }),
  urgent: (s) => ({
    subject: `CẢNH BÁO: Nguy cơ bỏ lỡ khóa học - ${s.name}`,
    body: `Chào ${s.name},\n\nBạn đã nghỉ học ${daysBetween(s.lastActive, new Date()) || "nhiều"} ngày! Đây là mức thời gian đáng báo động có thể dẫn đến việc mất kiến thức nền tảng.\n\nNếu bạn không đăng nhập và hoạt động trong 48 giờ tới, tài khoản của bạn có thể bị chuyển sang trạng thái "Ngừng hoạt động". Hãy quay lại ngay để bảo vệ quyền lợi học tập của mình!\n\nTrân trọng,\nPhòng Quản lý học viên.`,
  }),
};

function EmailModal({
  student,
  open,
  onClose,
  onConfirm,
}: {
  student: Student | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (template: EmailTemplate) => void;
}) {
  const [tone, setTone] = useState<ToneType>("gentle");
  const [template, setTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    if (student) setTemplate(EMAIL_TEMPLATES[tone](student));
  }, [student, tone]);

  const displayDays = student?.lastActive ? daysBetween(student.lastActive, new Date()) : 'nhiều';

  if (!open || !student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl md:max-w-4xl overflow-hidden mx-4 sm:mx-0 max-h-[90vh]"
        >
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-indigo-50/20">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Gửi Email Nhắc nhở</h3>
              <p className="text-sm text-gray-500">Người nhận: {student.name} • Nghỉ {displayDays} ngày</p>
            </div>
            <div className="self-end sm:self-auto">
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white rounded-full shadow-sm">
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Chọn tông giọng phù hợp:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {( ["gentle","professional","urgent"] as ToneType[] ).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${tone === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'}`}
                  >
                    {t === 'gentle' && '🍃 Nhẹ nhàng'}
                    {t === 'professional' && '💼 Chuyên nghiệp'}
                    {t === 'urgent' && '⚡ Cấp bách'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tiêu đề email</label>
                <input
                  type="text"
                  value={template?.subject || ''}
                  onChange={(e) => setTemplate(prev => prev ? {...prev, subject: e.target.value} : null)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nội dung (Có thể chỉnh sửa thêm)</label>
                <textarea
                  rows={8}
                  value={template?.body || ''}
                  onChange={(e) => setTemplate(prev => prev ? {...prev, body: e.target.value} : null)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 bg-gray-50 flex flex-col sm:flex-row sm:justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">Hủy bỏ</button>
            <button
              disabled={!template}
              onClick={() => template && onConfirm(template)}
              className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition-all flex items-center gap-2"
            >
              Xác nhận gửi
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// =============================
// 🧩 Component chính: Bảng học viên
// =============================
interface StudentTableProps {
  students: Student[];
  onStudentClick: (studentId: string) => void;
}

export function StudentTable({ students, onStudentClick }: StudentTableProps) {
  const [sendingMap, setSendingMap] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState<Student | null>(null);
  const [emailSummaries, setEmailSummaries] = useState<Record<string, { count: number; lastSent?: string | null; daysSince?: number | null }>>({});
  const [markingMap, setMarkingMap] = useState<Record<string, boolean>>({});
  const [localStudents, setLocalStudents] = useState<Student[]>(students);


  async function handleSendReminder(studentId: string, template?: { subject: string; body: string }) {
    setSendingMap((s) => ({ ...s, [studentId]: true }));
    try {
      await sendReminderRequest(studentId, template);
      toast.success("Email nhắc nhở đã được gửi thành công");
      // refresh summary for this student
      try {
        const res = await mailService.getEmailLogs(studentId, 1, 10);
        const data = res?.data ?? res;
        let logs: any[] = [];
        if (Array.isArray(data)) logs = data;
        else if (Array.isArray(data?.items)) logs = data.items;
        else if (Array.isArray(data?.docs)) logs = data.docs;
        else if (Array.isArray(data?.data)) logs = data.data;
        else if (Array.isArray(data?.data?.items)) logs = data.data.items;
        else if (Array.isArray(data?.data?.docs)) logs = data.data.docs;
        // fallback: try to read top-level docs-like fields
        logs = logs ?? [];
        const count = logs.length;
        const last = logs[0]?.sent_at || logs[0]?.sentAt || logs[0]?.createdAt || null;
        setEmailSummaries((m) => ({ ...m, [studentId]: { count, lastSent: last, daysSince: last ? daysBetween(last, new Date()) : null } }));
      } catch (err) {
        // ignore
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Gửi email nhắc nhở thất bại");
    } finally {
      setSendingMap((s) => ({ ...s, [studentId]: false }));
    }
  }

  async function handleMarkInactive(studentId: string) {
    setMarkingMap(m => ({ ...m, [studentId]: true }));
    try {
      const res = await axiosClient.post(`/ctv/students/${studentId}/mark-inactive`);
      toast.success("Học viên đã được chuyển sang Inactive");
      // reflect immediately in UI
      setEmailSummaries(m => ({ ...m, [studentId]: { ...(m[studentId] || { count: 3 }), count: 3 } }));
      // also update local students list so status shows inactive
      setLocalStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'inactive' } : s));
    } catch (err) {
      console.error(err);
      toast.error("Không thể chuyển trạng thái");
    } finally {
      setMarkingMap(m => ({ ...m, [studentId]: false }));
    }
  }

  // load email logs summary for visible students
  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      const entries: Record<string, { count: number; lastSent?: string | null; daysSince?: number | null }> = {};
      // use the current students list (local copy) to load summaries
      await Promise.all(localStudents.map(async (stu) => {
        try {
          const res = await mailService.getEmailLogs(stu.id, 1, 10);
          const data = res?.data ?? res;
          let logs: any[] = [];
          if (Array.isArray(data)) logs = data;
          else if (Array.isArray(data?.items)) logs = data.items;
          else if (Array.isArray(data?.docs)) logs = data.docs;
          else if (Array.isArray(data?.data)) logs = data.data;
          else if (Array.isArray(data?.data?.items)) logs = data.data.items;
          else if (Array.isArray(data?.data?.docs)) logs = data.data.docs;
          logs = logs ?? [];
          const count = logs.length;
          const last = logs[0]?.sent_at || logs[0]?.sentAt || logs[0]?.createdAt || null;
          const days = last ? daysBetween(last, new Date()) : null;
          entries[stu.id] = { count, lastSent: last, daysSince: days };
        } catch (err) {
          entries[stu.id] = { count: 0, lastSent: null, daysSince: null };
        }
      }));
      if (!mounted) return;
      setEmailSummaries(entries);
    }
    loadAll();
    return () => { mounted = false; };
  }, [localStudents]);

  // keep localStudents in sync with incoming prop
  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <TableContainer sx={{ maxHeight: 600 }}>
        {/* Email modal */}
        <EmailModal
          student={modalStudent}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalStudent(null);
          }}
          onConfirm={async (template) => {
            if (!modalStudent) return;
            setModalOpen(false);
            await handleSendReminder(modalStudent.id, template as any);
          }}
        />
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Học viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              {/* <TableCell sx={{ fontWeight: 600 }}>Lộ trình</TableCell> */}
              <TableCell sx={{ fontWeight: 600 }}>Tiến độ</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Điểm hiện tại</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hoạt động gần nhất</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Lịch sử nhắc</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy học viên nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              localStudents.map((student) => (
                <TableRow
                  key={student.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  }}
                  onClick={() => onStudentClick(student.id)}
                >
                  {/* Cột Học viên */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={student.avatar || undefined}
                        alt={student.name}
                        sx={{ width: 40, height: 40 }}
                      >
                        {student.name?.charAt(0) || "?"}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={500}>
                          {student.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {student.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Cột trạng thái */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StatusChip status={student.status || "inactive"} />
                    </Box>
                  </TableCell>

                  {/* Cột lộ trình */}
                  {/* <TableCell>
                    <Chip
                      label={getLearningPathLabel(student.learningPath)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell> */}

                  {/* Cột tiến độ */}
                  <TableCell sx={{ minWidth: 200 }}>
                    <ProgressBar
                      value={student.completedLessons ?? 0}
                      max={student.totalLessons ?? 100}
                      showPercentage
                    />
                  </TableCell>

                  {/* Cột điểm hiện tại */}
                  <TableCell>
                    <Box textAlign="center">
                      <Typography variant="body1" fontWeight={600}>
                        {student.currentScore}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        / {student.targetScore}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Cột hoạt động gần nhất */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {formatRelativeTime(student.lastActive || "")}
                    </Typography>
                  </TableCell>

                  {/* Cột: Lịch sử nhắc (tóm tắt) */}
                  <TableCell>
                    <Box>
                      <Typography fontWeight={600}>
                        {emailSummaries[student.id]?.count ?? 0}/3 Email
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {emailSummaries[student.id]?.lastSent
                          ? `Lần cuối: ${new Date(emailSummaries[student.id]!.lastSent!).toLocaleDateString()}`
                          : "Lần cuối: -"}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Cột: Hành động */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      {
                        (() => {
                          const summary = emailSummaries[student.id] ?? { count: 0, lastSent: null, daysSince: null };
                          const count = summary.count ?? 0;
                          const days = summary.daysSince ?? Infinity;
                          const status = student.status || 'inactive';
                          // only students in 'at_risk' should have the send button
                          if (status !== 'at_risk') {
                            return <StatusChip status={status} />;
                          }
                          // already maxed out
                          if (count >= 3) {
                            return (
                              <Button
                                size="small"
                                variant="outlined"
                                color="warning"
                                onClick={(e) => { e.stopPropagation(); handleMarkInactive(student.id); }}
                                disabled={!!markingMap[student.id]}
                              >
                                {markingMap[student.id] ? <CircularProgress size={14} /> : 'Chuyển Inactive'}
                              </Button>
                            );
                          }
                          // can send now (>=7 days since last) or no last
                          if (!summary.lastSent || days === null || days >= AT_RISK_DAYS) {
                            const label = count > 0 ? `Gửi lần ${count + 1}/3` : 'Gửi nhắc nhở';
                            return (
                              <Button
                                size="small"
                                variant="contained"
                                color={count >= 2 ? 'warning' : 'primary'}
                                onClick={(e) => { e.stopPropagation(); setModalStudent(student); setModalOpen(true); }}
                                disabled={!!sendingMap[student.id]}
                              >
                                {sendingMap[student.id] ? <CircularProgress size={14} color="inherit" /> : label}
                              </Button>
                            );
                          }
                          // otherwise show wait badge
                          const wait = Math.max(0, AT_RISK_DAYS - (typeof days === 'number' && isFinite(days) ? days : 0));
                          return <Chip label={`Đợi ${wait} ngày`} variant="outlined" />;
                        })()
                      }
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
