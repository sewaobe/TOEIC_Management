import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  AbilityPart,
  AbilitySkill,
  CareConversationSummary,
  CareSignal,
  StudentDetail,
} from "../../../../../types/student";
import { formatDate } from "../utils/formatters";
import { ProgressCharts } from "./ProgressCharts";
import studentService from "../services/studentService";
import { toast } from "sonner";

interface AbilityInterventionPanelProps {
  student: StudentDetail;
  onChanged?: () => void;
}
const statusColorMap: Record<string, "error" | "warning" | "success" | "default"> = {
  weak: "error",
  medium: "warning",
  strong: "success",
};

const statusLabelMap: Record<string, string> = {
  weak: "Yếu",
  medium: "Trung bình",
  strong: "Tốt",
};

const trendLabelMap: Record<string, string> = {
  improving: "Đang cải thiện",
  stable: "Chưa thay đổi rõ",
  declining: "Đang giảm",
};

const conversationStatusLabel: Record<string, string> = {
  waiting_for_response: "Chờ học viên trả lời",
  responded: "Đã phản hồi",
  needs_support: "Cần hỗ trợ",
  solution_provided: "Đã ghi nhận hỗ trợ",
  follow_up_due: "Đến hạn theo dõi",
  resolved: "Đã xử lý",
};

function AbilityBar({ value }: { value: number }) {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <LinearProgress
        variant="determinate"
        value={Math.max(0, Math.min(100, value))}
        sx={{ flex: 1, height: 8, borderRadius: 1 }}
      />
      <Typography variant="body2" fontWeight={600} sx={{ width: 42 }}>
        {value}%
      </Typography>
    </Box>
  );
}

function PartRow({ part }: { part: AbilityPart }) {
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {part.label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {part.section === "listening" ? "Listening" : "Reading"} -{" "}
            {part.weakSkillCount}/{part.skillCount} skill yếu
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <Chip
            label={statusLabelMap[part.status] || part.status}
            color={statusColorMap[part.status] || "default"}
            size="small"
            variant="outlined"
          />
          {part.trend && (
            <Chip label={trendLabelMap[part.trend] || part.trend} size="small" variant="outlined" />
          )}
        </Stack>
      </Box>
      <AbilityBar value={part.abilityPercent} />
    </Box>
  );
}

function SkillRow({ skill }: { skill: AbilitySkill }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1 }}>
      <Box display="flex" justifyContent="space-between" gap={1}>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {skill.label || skill.skillKey}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Part {skill.partType} - {skill.itemCount || 0} câu - {skill.correctCount || 0} đúng
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5} flexShrink={0}>
          <Chip
            label={statusLabelMap[skill.status] || skill.status}
            color={statusColorMap[skill.status] || "default"}
            size="small"
            variant="outlined"
          />
          {skill.trend && (
            <Chip label={trendLabelMap[skill.trend] || skill.trend} size="small" variant="outlined" />
          )}
        </Stack>
      </Box>
      <Box mt={1}>
        <AbilityBar value={skill.abilityPercent} />
      </Box>
    </Paper>
  );
}

function CareConversationCard({
  conversation,
  onChanged,
}: {
  conversation: CareConversationSummary;
  onChanged?: () => void;
}) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const canAct = conversation.status !== "waiting_for_response";

  async function handleSolution() {
    setSaving(true);
    try {
      await studentService.addCareConversationSolution(conversation.id, {
        solutionCodes: ["manual_support"],
        note,
      });
      toast.success("Đã ghi nhận hướng hỗ trợ");
      setNote("");
      onChanged?.();
    } catch (error) {
      console.error(error);
      toast.error("Không ghi nhận được hỗ trợ");
    } finally {
      setSaving(false);
    }
  }

  async function handleResolve() {
    setSaving(true);
    try {
      await studentService.resolveCareConversation(conversation.id);
      toast.success("Đã đóng trao đổi");
      onChanged?.();
    } catch (error) {
      console.error(error);
      toast.error("Không đóng được trao đổi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1 }}>
      <Box display="flex" justifyContent="space-between" gap={1}>
        <Typography variant="body2" fontWeight={700}>
          {conversation.signalTitle}
        </Typography>
        <Chip
          label={conversationStatusLabel[conversation.status] || conversation.status}
          color={conversation.status === "needs_support" ? "warning" : "default"}
          size="small"
          variant="outlined"
        />
      </Box>
      <Typography variant="body2" color="text.secondary" mt={0.75}>
        {conversation.questionText}
      </Typography>
      {conversation.primaryAnswer && (
        <Alert severity={conversation.status === "needs_support" ? "warning" : "info"} sx={{ mt: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            Học viên trả lời: {conversation.primaryAnswer.label}
          </Typography>
          {conversation.secondaryAnswer && (
            <Typography variant="body2">{conversation.secondaryAnswer.label}</Typography>
          )}
          {conversation.studentNote && (
            <Typography variant="body2">Ghi chú: {conversation.studentNote}</Typography>
          )}
        </Alert>
      )}
      {canAct && (
        <Box mt={1}>
          <TextField
            value={note}
            onChange={(event) => setNote(event.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={2}
            placeholder="Ghi nhận CTV đã hỗ trợ gì cho học viên..."
          />
          <Stack direction="row" spacing={1} mt={1}>
            <Button size="small" variant="contained" onClick={handleSolution} disabled={saving}>
              Ghi nhận hỗ trợ
            </Button>
            <Button size="small" variant="outlined" onClick={handleResolve} disabled={saving}>
              Đóng case
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}

function SignalCard({
  studentId,
  signal,
  onChanged,
}: {
  studentId: string;
  signal: CareSignal;
  onChanged?: () => void;
}) {
  const [question, setQuestion] = useState(signal.suggestedQuestion?.text || "");
  const [sending, setSending] = useState(false);
  const canCreate = signal.actionMode === "care_conversation" && !signal.hasOpenConversation;

  async function handleCreate() {
    setSending(true);
    try {
      await studentService.createCareConversation(studentId, {
        signalType: signal.signalType,
        signalScopeKey: signal.signalScopeKey,
        sentText: question,
      });
      toast.success("Đã gửi câu hỏi hỗ trợ cho học viên");
      onChanged?.();
    } catch (error) {
      console.error(error);
      toast.error("Không tạo được trao đổi học tập");
    } finally {
      setSending(false);
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1 }}>
      <Box display="flex" justifyContent="space-between" gap={1}>
        <Typography variant="body2" fontWeight={700}>
          {signal.title}
        </Typography>
        <Chip
          label={
            signal.severity === "high"
              ? "Ưu tiên cao"
              : signal.severity === "warning"
                ? "Cần theo dõi"
                : "Nội bộ"
          }
          color={signal.severity === "high" ? "error" : signal.severity === "warning" ? "warning" : "default"}
          size="small"
          variant="outlined"
        />
      </Box>
      <Stack direction="row" flexWrap="wrap" gap={0.75} mt={1}>
        {signal.contextSummary.map((item) => (
          <Chip
            key={item.code}
            size="small"
            variant="outlined"
            label={`${item.label}: ${item.value ?? "-"}`}
          />
        ))}
      </Stack>
      {signal.internalHypotheses.length > 0 && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          CTV nên hỏi để xác nhận: {signal.internalHypotheses[0]}
        </Typography>
      )}
      {signal.hasOpenConversation ? (
        <Alert severity="info" sx={{ mt: 1 }}>
          Đã có trao đổi đang chờ xử lý cho vấn đề này.
        </Alert>
      ) : canCreate ? (
        <Box mt={1}>
          <TextField
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={2}
            label="Câu hỏi gửi cho học viên"
          />
          <Button
            size="small"
            variant="contained"
            sx={{ mt: 1 }}
            onClick={handleCreate}
            disabled={sending || !question.trim()}
          >
            {sending ? "Đang gửi..." : "Hỏi học viên"}
          </Button>
        </Box>
      ) : (
        <Alert severity="info" sx={{ mt: 1 }}>
          Signal này chỉ dùng để CTV theo dõi nội bộ.
        </Alert>
      )}
    </Paper>
  );
}

function CareSupportPanel({
  student,
  onChanged,
}: {
  student: StudentDetail;
  onChanged?: () => void;
}) {
  const careProfile = student.careProfile;
  if (!careProfile) return null;

  const active = [...careProfile.activeCareConversations].sort((a, b) => {
    const rank: Record<string, number> = {
      needs_support: 0,
      responded: 1,
      follow_up_due: 2,
      waiting_for_response: 3,
      solution_provided: 4,
    };
    return (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
  });
  const signals = careProfile.signals.filter((signal) => signal.signalType !== "continue_monitoring");

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Typography fontWeight={600} mb={1}>
        Hỗ trợ học viên
      </Typography>
      <Stack spacing={1}>
        {active.map((conversation) => (
          <CareConversationCard key={conversation.id} conversation={conversation} onChanged={onChanged} />
        ))}
        {signals.map((signal) => (
          <SignalCard
            key={`${signal.signalType}-${signal.signalScopeKey}`}
            studentId={student.id}
            signal={signal}
            onChanged={onChanged}
          />
        ))}
        {active.length === 0 && signals.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Chưa có vấn đề cần hỏi học viên. CTV tiếp tục theo dõi sau checkpoint tiếp theo.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export function AbilityInterventionPanel({ student, onChanged }: AbilityInterventionPanelProps) {
  const ability = student.abilityProfile;
  const weakSkills = (ability?.skills ?? [])
    .filter((skill) => skill.status === "weak" || skill.trend === "declining")
    .slice(0, 8);

  if (!ability?.hasData) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <Alert severity="info">
          Chưa có dữ liệu năng lực IRT. CTV nên hỏi học viên làm Entry Test, Mini Test hoặc Full Test để hệ thống đo lại năng lực.
        </Alert>
        <CareSupportPanel student={student} onChanged={onChanged} />
        <ProgressCharts data={student.progressHistory} />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Grid container spacing={1.5}>
        {ability.sections.map((section) => (
          <Grid key={section.key} size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {section.label}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {section.abilityPercent}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {section.weakPartCount} part cần chú ý
              </Typography>
              <Box mt={1}>
                <AbilityBar value={section.abilityPercent} />
              </Box>
            </Paper>
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Part yếu nhất
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {ability.summary.weakestPart?.label || "Chưa có"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {ability.summary.weakestPart
                ? `${ability.summary.weakestPart.abilityPercent}% năng lực`
                : "Thiếu dữ liệu"}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Skill yếu nhất
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {ability.summary.weakestSkill?.label || "Chưa có"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {ability.summary.weakestSkill
                ? `Part ${ability.summary.weakestSkill.partType} - ${ability.summary.weakestSkill.abilityPercent}%`
                : "Thiếu dữ liệu"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {ability.currentFocus && (
        <Alert severity="info">
          Cycle {ability.currentFocus.cycleNo || "-"} đang tập trung Part{" "}
          {ability.currentFocus.partType || "-"} -{" "}
          {ability.currentFocus.primarySkillLabel || "chưa xác định skill"}.
        </Alert>
      )}

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography fontWeight={600} mb={1.5}>
          Năng lực theo Part
        </Typography>
        <Stack spacing={1.5}>
          {ability.parts.map((part) => (
            <PartRow key={part.partType} part={part} />
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography fontWeight={600} mb={1.5}>
          Skill cần chú ý
        </Typography>
        {weakSkills.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Chưa có skill yếu hoặc đang giảm rõ rệt.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {weakSkills.map((skill) => (
              <SkillRow key={`${skill.partType}-${skill.skillKey}`} skill={skill} />
            ))}
          </Stack>
        )}
      </Paper>

      <CareSupportPanel student={student} onChanged={onChanged} />

      <Divider />
      <Box>
        <Typography fontWeight={600} mb={1}>
          Lịch sử điểm
        </Typography>
        {ability.lastEvaluatedAt && (
          <Typography variant="caption" color="text.secondary">
            Cập nhật năng lực gần nhất: {formatDate(ability.lastEvaluatedAt)}
          </Typography>
        )}
        <Box mt={1.5}>
          <ProgressCharts data={student.progressHistory} />
        </Box>
      </Box>
    </Box>
  );
}
