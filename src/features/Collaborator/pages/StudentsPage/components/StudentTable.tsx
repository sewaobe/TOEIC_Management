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
  Box,
  Button,
} from "@mui/material";

import { Student } from "../../../../../types/student";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
// Mail icon removed — action column replaces the inline icon
import { motion, AnimatePresence } from "framer-motion";
import {
  formatRelativeTime,
  getLearningRouteDisplay,
  getScoreSourceLabel,
} from "../utils/formatters";
import mailService from "../../../../../services/mail.service";
import { toast } from "sonner";

// =============================
// 🧩 Component con: Trạng thái
// =============================
function StatusChip({ status }: { status: string }) {
  const getColor = () => {
    switch (status) {
      case "not_started":
        return "default";
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
      case "not_started":
        return "Chưa bắt đầu";
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

const LEARNING_PATH_DELETION_RISK_DAYS = 14;
const REMINDER_SCHEDULE_DAYS = [5, 9, 13] as const;

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

function getInactiveDays(student: Student) {
  const days = daysBetween(student.lastActive, new Date());
  return Number.isFinite(days) ? days : null;
}

function getNextReminderTargetDay(sentCount: number) {
  return REMINDER_SCHEDULE_DAYS[Math.min(Math.max(sentCount, 0), 2)];
}

function getReminderStep(sentCount: number): 1 | 2 | 3 {
  return Math.min(Math.max(sentCount + 1, 1), 3) as 1 | 2 | 3;
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

const reminderStepLabel: Record<1 | 2 | 3, string> = {
  1: "lần 1",
  2: "lần 2",
  3: "lần 3",
};

function buildStepMessage(student: Student, reminderStep: 1 | 2 | 3) {
  const inactiveDays = getInactiveDays(student);
  const daysText = inactiveDays === null ? "nhiều" : String(inactiveDays);
  const daysLeft =
    inactiveDays === null
      ? null
      : Math.max(0, LEARNING_PATH_DELETION_RISK_DAYS - inactiveDays);

  if (reminderStep === 1) {
    return `Chào ${student.name},\n\nHệ thống ghi nhận bạn đã ${daysText} ngày chưa quay lại học. Bạn nên học một phiên ngắn hôm nay để giữ nhịp và tránh bị gián đoạn lộ trình.\n\nNếu bạn đang gặp khó khăn về thời gian hoặc nội dung học, hãy phản hồi email này để CTV hỗ trợ.\n\nThân mến,\nPhòng Quản lý học viên.`;
  }

  if (reminderStep === 2) {
    return `Chào ${student.name},\n\nBạn đã ${daysText} ngày chưa có hoạt động học mới. Lộ trình học có thể bị ảnh hưởng nếu tình trạng này tiếp tục kéo dài.\n\nBạn vui lòng quay lại học trong hôm nay hoặc phản hồi email này nếu cần hỗ trợ điều chỉnh cách học.\n\nTrân trọng,\nPhòng Quản lý học viên.`;
  }

  return `Chào ${student.name},\n\nĐây là nhắc nhở sát mốc 14 ngày không học. Bạn đã ${daysText} ngày chưa có hoạt động học mới${daysLeft !== null ? `, còn ${daysLeft} ngày trước mốc xóa lộ trình` : ""}.\n\nBạn vui lòng quay lại học sớm nhất có thể. Nếu bạn đang gặp khó khăn, hãy phản hồi email này để CTV hỗ trợ kịp thời.\n\nTrân trọng,\nPhòng Quản lý học viên.`;
}

const EMAIL_TEMPLATES: Record<
  ToneType,
  (s: Student, reminderStep: 1 | 2 | 3) => EmailTemplate
> = {
  gentle: (s, reminderStep) => ({
    subject: `Nhắc học ${reminderStepLabel[reminderStep]} - ${s.name}`,
    body: buildStepMessage(s, reminderStep),
  }),
  professional: (s, reminderStep) => ({
    subject: `[TOEIC Smart] Nhắc tiến độ học ${reminderStepLabel[reminderStep]} - ${s.name}`,
    body: buildStepMessage(s, reminderStep),
  }),
  urgent: (s, reminderStep) => ({
    subject: `[TOEIC Smart] Cảnh báo sát mốc 14 ngày - ${s.name}`,
    body: buildStepMessage(s, reminderStep),
  }),
};

function EmailModal({
  student,
  reminderStep,
  open,
  onClose,
  onConfirm,
}: {
  student: Student | null;
  reminderStep: 1 | 2 | 3;
  open: boolean;
  onClose: () => void;
  onConfirm: (template: EmailTemplate) => void;
}) {
  const [tone, setTone] = useState<ToneType>("gentle");
  const [template, setTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    if (student) setTemplate(EMAIL_TEMPLATES[tone](student, reminderStep));
  }, [student, reminderStep, tone]);

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
  const [modalReminderStep, setModalReminderStep] = useState<1 | 2 | 3>(1);
  const [emailSummaries, setEmailSummaries] = useState<Record<string, { count: number; lastSent?: string | null; daysSince?: number | null }>>({});
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
          reminderStep={modalReminderStep}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalStudent(null);
            setModalReminderStep(1);
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
              <TableCell sx={{ fontWeight: 600 }}>Lộ trình hiện tại</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Điểm ước tính</TableCell>
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

                  {/* Cột lộ trình hiện tại */}
                  <TableCell sx={{ minWidth: 200 }}>
                    {(() => {
                      const route = getLearningRouteDisplay(student);
                      return (
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {route.primary}
                          </Typography>
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
                  </TableCell>

                  {/* Cột điểm ước tính */}
                  <TableCell>
                    <Box textAlign="center">
                      <Typography variant="body1" fontWeight={600}>
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
                    </Box>
                  </TableCell>

                  {/* Cột hoạt động gần nhất */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {formatRelativeTime(student.lastActive)}
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
                          const inactiveDays = getInactiveDays(student);
                          const status = student.status || 'inactive';
                          // only students in 'at_risk' should have the send button
                          if (status !== 'at_risk') {
                            return <StatusChip status={status} />;
                          }

                          if (inactiveDays !== null && inactiveDays >= LEARNING_PATH_DELETION_RISK_DAYS) {
                            return <Chip label="Nguy cơ xóa lộ trình" color="error" variant="outlined" />;
                          }

                          if (count >= 3) {
                            return <Chip label="Đã nhắc 3/3" color="warning" variant="outlined" />;
                          }

                          const targetDay = getNextReminderTargetDay(count);
                          const canSend = inactiveDays !== null && inactiveDays >= targetDay;
                          if (canSend) {
                            const reminderStep = getReminderStep(count);
                            const label = `Gửi lần ${reminderStep}/3`;
                            return (
                              <Button
                                size="small"
                                variant="contained"
                                color={count >= 2 ? 'warning' : 'primary'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalStudent(student);
                                  setModalReminderStep(reminderStep);
                                  setModalOpen(true);
                                }}
                                disabled={!!sendingMap[student.id]}
                              >
                                {sendingMap[student.id] ? <CircularProgress size={14} color="inherit" /> : label}
                              </Button>
                            );
                          }

                          const currentDays = inactiveDays ?? 0;
                          const wait = Math.max(0, targetDay - currentDays);
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
