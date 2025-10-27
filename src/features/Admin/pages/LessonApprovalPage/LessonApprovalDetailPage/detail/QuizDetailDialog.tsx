import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Close, Layers, AccessTime } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import quizService from "../../../../../Collaborator/pages/QuizPage/services/quiz.service";
import { toast } from "sonner";

export default function QuizDetailDialog({
  open,
  onClose,
  quizId,
}: {
  open: boolean;
  onClose: () => void;
  quizId: string | null;
}) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any | null>(null);

  useEffect(() => {
    if (!quizId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await quizService.getById(quizId);
        setQuiz(res.data);
      } catch {
        toast.error("Không tải được dữ liệu quiz");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [quizId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[6],
        },
        component: motion.div,
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 40 },
        transition: { duration: 0.3 },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
              : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: "white",
          py: 2.5,
          px: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Chi tiết Quiz
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Loading / Error / Content */}
      {loading ? (
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
        </DialogContent>
      ) : !quiz ? (
        <DialogContent sx={{ py: 4 }}>
          <Typography align="center" color="text.secondary">
            Không tìm thấy quiz
          </Typography>
        </DialogContent>
      ) : (
        <DialogContent sx={{ py: 4, px: 4 }}>
          {/* 🧾 Thông tin Quiz */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[2],
            }}
          >
            <Typography variant="h5" color="primary" fontWeight="bold">
              {quiz.title}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
              gap={3}
            >
              <Box>
                <InfoRow
                  icon={<Layers color="primary" />}
                  label="Phần thi"
                  value={quiz.part_type ? `Part ${quiz.part_type}` : "—"}
                />
                <InfoRow
                  icon={<AccessTime color="primary" />}
                  label="Thời gian"
                  value={`${quiz.planned_completion_time || 0} phút`}
                />
                <InfoRow
                  label="Trạng thái"
                  value={quiz.status === "draft" ? "Nháp" : "Công khai"}
                />
              </Box>

              <Box>
                <InfoRow label="Trình độ" value={quiz.level || "—"} />
                <InfoRow
                  label="Trọng số"
                  value={quiz.weight?.toFixed(2) || "—"}
                />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Chủ đề:
                </Typography>
                {quiz.topic?.length ? (
                  <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                    {quiz.topic.map((t: any) => (
                      <Chip
                        key={t._id || t.id}
                        label={t.title}
                        color="primary"
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                          borderColor: theme.palette.primary.light,
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    Không có chủ đề
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>

          {/* 🧩 Danh sách câu hỏi */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography variant="h6" color="primary" fontWeight="bold" mb={2}>
              Danh sách câu hỏi
            </Typography>

            {quiz.question_ids?.length ? (
              quiz.question_ids.map((q: any, i: number) => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : theme.palette.grey[50],
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.06)"
                          : theme.palette.grey[100],
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <Typography fontWeight="bold" mb={1}>
                    Câu {i + 1}: {q.textQuestion || "—"}
                  </Typography>

                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={1}
                  >
                    {["A", "B", "C", "D"].map((opt) => (
                      <Typography
                        key={opt}
                        variant="body2"
                        color={
                          q.correctAnswer === opt
                            ? "primary"
                            : "text.secondary"
                        }
                        fontWeight={q.correctAnswer === opt ? 700 : 400}
                      >
                        {opt}. {q.choices?.[opt] || ""}
                      </Typography>
                    ))}
                  </Box>

                  {q.explanation && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mt={1}
                      sx={{ whiteSpace: "pre-wrap" }}
                    >
                      <strong>Giải thích:</strong> {q.explanation}
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">
                Chưa có câu hỏi nào.
              </Typography>
            )}
          </Paper>
        </DialogContent>
      )}

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" onClick={onClose} sx={{ fontWeight: 600 }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ────────────────────────────────
   InfoRow (hàng hiển thị thông tin)
──────────────────────────────── */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography
        variant="body2"
        fontWeight="bold"
        sx={{ color: theme.palette.text.primary }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
}
