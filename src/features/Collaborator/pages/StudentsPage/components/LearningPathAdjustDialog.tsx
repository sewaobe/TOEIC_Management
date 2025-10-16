import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import type { StudentDetail } from "../../../../../types/student";

// 🎯 Vì BE chưa có loại “LearningPathAdjustment”, ta tự định nghĩa tạm
export interface LearningPathAdjustment {
  lessonsPerWeekDelta: number;
  hoursPerDayDelta: number;
  addFocusAreas: string[];
  removeFocusAreas: string[];
  extendDays: number;
  reason: string;
}

// Mock focus areas — sau này có thể lấy từ backend
const availableFocusAreas = [
  "Listening",
  "Reading",
  "Speaking",
  "Writing",
  "Vocabulary",
  "Grammar",
  "Pronunciation",
];

interface LearningPathAdjustDialogProps {
  student: StudentDetail | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (adjustment: LearningPathAdjustment) => Promise<void>;
}

export function LearningPathAdjustDialog({
  student,
  open,
  onClose,
  onSubmit,
}: LearningPathAdjustDialogProps) {
  const [lessonsPerWeekDelta, setLessonsPerWeekDelta] = useState(0);
  const [hoursPerDayDelta, setHoursPerDayDelta] = useState(0);
  const [addFocusAreas, setAddFocusAreas] = useState<string[]>([]);
  const [removeFocusAreas, setRemoveFocusAreas] = useState<string[]>([]);
  const [extendDays, setExtendDays] = useState(0);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 🧹 Reset form khi mở dialog
  useEffect(() => {
    if (open) {
      setLessonsPerWeekDelta(0);
      setHoursPerDayDelta(0);
      setAddFocusAreas([]);
      setRemoveFocusAreas([]);
      setExtendDays(0);
      setReason("");
      setErrors([]);
    }
  }, [open]);

  // 🧠 Validate cơ bản (demo tạm, sau này có thể tách ra utils)
  useEffect(() => {
    const newErrors: string[] = [];

    if (lessonsPerWeekDelta < -3)
      newErrors.push("Giảm số buổi/tuần quá nhiều.");
    if (hoursPerDayDelta < -2)
      newErrors.push("Giảm số giờ/ngày quá nhiều.");
    if (extendDays > 60)
      newErrors.push("Gia hạn không được vượt quá 60 ngày.");
    if (!reason.trim()) newErrors.push("Vui lòng nhập lý do điều chỉnh.");

    setErrors(newErrors);
  }, [lessonsPerWeekDelta, hoursPerDayDelta, extendDays, reason]);

  if (!student) return null;

  // ⚙️ Các giá trị hiện tại của học viên
  const currentLessonsPerWeek = 5;
  const currentHoursPerDay = 1.5;
  const currentFocusAreas = [
    "Listening",
    "Reading",
    "Grammar",
  ]; // giả định, vì BE chưa có field này

  const newLessonsPerWeek = currentLessonsPerWeek + lessonsPerWeekDelta;
  const newHoursPerDay = currentHoursPerDay + hoursPerDayDelta;

  const newFocusAreas = currentFocusAreas
    .filter((a) => !removeFocusAreas.includes(a))
    .concat(addFocusAreas.filter((a) => !currentFocusAreas.includes(a)));

  const availableToAdd = availableFocusAreas.filter(
    (a) => !currentFocusAreas.includes(a) && !addFocusAreas.includes(a)
  );

  const toggleAdd = (area: string) =>
    setAddFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );

  const toggleRemove = (area: string) =>
    setRemoveFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );

  const handleSubmit = async () => {
    if (errors.length > 0) return;
    const adjustment: LearningPathAdjustment = {
      lessonsPerWeekDelta,
      hoursPerDayDelta,
      addFocusAreas,
      removeFocusAreas,
      extendDays,
      reason,
    };
    setSubmitting(true);
    try {
      await onSubmit(adjustment);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // 🧱 RENDER
  // =========================
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Điều chỉnh lộ trình học</DialogTitle>
      <DialogContent dividers>
        <DialogContentText mb={2}>
          Điều chỉnh lộ trình học cho học viên{" "}
          <Typography component="span" fontWeight={600}>
            {student.name || "—"}
          </Typography>
          . Sử dụng nút +/- để thay đổi giá trị.
        </DialogContentText>

        <Box display="flex" flexDirection="column" gap={3}>
          {/* Số buổi mỗi tuần */}
          <Box>
            <Typography fontWeight={600}>Số buổi học mỗi tuần</Typography>
            <Box display="flex" alignItems="center" gap={2} mt={1}>
              <IconButton
                color="primary"
                onClick={() => setLessonsPerWeekDelta((d) => d - 1)}
              >
                <RemoveIcon />
              </IconButton>
              <Box flex={1} textAlign="center">
                <Typography variant="h5" fontWeight={700}>
                  {currentLessonsPerWeek}
                  {lessonsPerWeekDelta !== 0 && (
                    <Typography
                      component="span"
                      color={
                        lessonsPerWeekDelta > 0 ? "success.main" : "error.main"
                      }
                    >
                      {" "}
                      {lessonsPerWeekDelta > 0 ? "+" : ""}
                      {lessonsPerWeekDelta}
                    </Typography>
                  )}
                  {lessonsPerWeekDelta !== 0 && (
                    <Typography component="span" color="text.secondary">
                      {" "}
                      = {newLessonsPerWeek}
                    </Typography>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  buổi/tuần
                </Typography>
              </Box>
              <IconButton
                color="primary"
                onClick={() => setLessonsPerWeekDelta((d) => d + 1)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Số giờ mỗi ngày */}
          <Box>
            <Typography fontWeight={600}>Số giờ học mỗi ngày</Typography>
            <Box display="flex" alignItems="center" gap={2} mt={1}>
              <IconButton
                color="primary"
                onClick={() =>
                  setHoursPerDayDelta(
                    Math.round((hoursPerDayDelta - 0.5) * 10) / 10
                  )
                }
              >
                <RemoveIcon />
              </IconButton>
              <Box flex={1} textAlign="center">
                <Typography variant="h5" fontWeight={700}>
                  {currentHoursPerDay}
                  {hoursPerDayDelta !== 0 && (
                    <Typography
                      component="span"
                      color={
                        hoursPerDayDelta > 0 ? "success.main" : "error.main"
                      }
                    >
                      {" "}
                      {hoursPerDayDelta > 0 ? "+" : ""}
                      {hoursPerDayDelta}
                    </Typography>
                  )}
                  {hoursPerDayDelta !== 0 && (
                    <Typography component="span" color="text.secondary">
                      {" "}
                      = {newHoursPerDay}
                    </Typography>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  giờ/ngày
                </Typography>
              </Box>
              <IconButton
                color="primary"
                onClick={() =>
                  setHoursPerDayDelta(
                    Math.round((hoursPerDayDelta + 0.5) * 10) / 10
                  )
                }
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Lĩnh vực hiện tại */}
          <Box>
            <Typography fontWeight={600}>Lĩnh vực tập trung hiện tại</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {currentFocusAreas.map((a) => (
                <Chip
                  key={a}
                  label={a}
                  color={removeFocusAreas.includes(a) ? "error" : "default"}
                  onClick={() => toggleRemove(a)}
                  deleteIcon={
                    removeFocusAreas.includes(a) ? (
                      <CloseIcon fontSize="small" />
                    ) : undefined
                  }
                  variant={
                    removeFocusAreas.includes(a) ? "outlined" : "filled"
                  }
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Nhấn vào lĩnh vực để xóa
            </Typography>
          </Box>

          {/* Thêm lĩnh vực mới */}
          {availableToAdd.length > 0 && (
            <Box>
              <Typography fontWeight={600}>Thêm lĩnh vực tập trung</Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {availableToAdd.map((a) => (
                  <Chip
                    key={a}
                    label={a}
                    color={addFocusAreas.includes(a) ? "primary" : "default"}
                    onClick={() => toggleAdd(a)}
                    icon={
                      addFocusAreas.includes(a) ? (
                        <AddIcon fontSize="small" />
                      ) : undefined
                    }
                    variant={addFocusAreas.includes(a) ? "filled" : "outlined"}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Nhấn để thêm lĩnh vực mới
              </Typography>
            </Box>
          )}

          {/* Lĩnh vực sau khi điều chỉnh */}
          {(addFocusAreas.length > 0 || removeFocusAreas.length > 0) && (
            <Box>
              <Typography fontWeight={600}>
                Lĩnh vực sau khi điều chỉnh
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {newFocusAreas.map((a) => (
                  <Chip key={a} label={a} variant="outlined" color="info" />
                ))}
              </Box>
            </Box>
          )}

          {/* Gia hạn thời gian */}
          <Box>
            <Typography fontWeight={600}>Gia hạn thời gian (ngày)</Typography>
            <TextField
              type="number"
              size="small"
              fullWidth
              value={extendDays}
              onChange={(e) => setExtendDays(parseInt(e.target.value) || 0)}
              placeholder="Số ngày gia hạn"
            />
          </Box>

          {/* Lý do điều chỉnh */}
          <Box>
            <Typography fontWeight={600}>Lý do điều chỉnh</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Nhập lý do điều chỉnh lộ trình..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Box>

          {/* Validation */}
          {errors.length > 0 && (
            <Alert severity="error">
              <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={errors.length > 0 || submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : undefined}
        >
          {submitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
