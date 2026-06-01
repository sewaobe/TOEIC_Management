import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import type { ReactNode } from "react";
import { Close, AccessTime, BarChart, Layers, Quiz as QuizIcon } from "@mui/icons-material";

const getChoiceValue = (choices: any, key: string) => {
  if (!choices) return "";
  if (typeof choices.get === "function") return choices.get(key) || "";
  return choices[key] || "";
};

export default function QuizDetailDialog({
  open,
  quiz,
  onClose,
}: {
  open: boolean;
  quiz: any;
  onClose: () => void;
}) {
  if (!quiz) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          boxShadow: 8,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          {quiz.title}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: "#fafafa" }}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600} color="primary" mb={1.5}>
            Thông tin Quiz
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={2}>
            <Box flex={1} minWidth={220}>
              <InfoRow
                icon={<Layers color="primary" fontSize="small" />}
                label="Phần thi"
                value={quiz.part_type ? `Part ${quiz.part_type}` : "—"}
              />
              <InfoRow
                icon={<AccessTime color="primary" fontSize="small" />}
                label="Thời gian"
                value={`${quiz.planned_completion_time || 0} phút`}
              />
              <InfoRow
                icon={<QuizIcon color="primary" fontSize="small" />}
                label="Số câu hỏi"
                value={`${quiz.question_ids?.length || 0}`}
              />
            </Box>

            <Box flex={1} minWidth={220}>
              <InfoRow
                icon={<BarChart color="primary" fontSize="small" />}
                label="Trình độ"
                value={quiz.level || "—"}
              />
              <InfoRow
                icon={<BarChart color="primary" fontSize="small" />}
                label="Trạng thái"
                value={quiz.status === "draft" ? "Nháp" : quiz.status || "—"}
              />
            </Box>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Chủ đề:
            </Typography>
            {quiz.topic?.length ? (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {quiz.topic.map((t: any) => (
                  <Chip
                    key={t._id || t.id}
                    label={t.title}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.disabled">
                Không có chủ đề
              </Typography>
            )}
          </Box>
        </Paper>

        {(quiz.audio_url || quiz.image_url || quiz.content_html) && (
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} color="primary" mb={2}>
              Media / Passage
            </Typography>

            {quiz.audio_url && (
              <Box mb={2}>
                <Typography variant="body2" fontWeight={600} mb={0.5}>
                  Audio bài nghe
                </Typography>
                <audio controls src={quiz.audio_url} style={{ width: "100%" }} />
              </Box>
            )}

            {quiz.image_url && (
              <Box mb={2}>
                <Typography variant="body2" fontWeight={600} mb={0.5}>
                  Ảnh minh họa
                </Typography>
                <Box
                  component="img"
                  src={quiz.image_url}
                  alt={quiz.title}
                  sx={{ maxWidth: "100%", maxHeight: 360, borderRadius: 2, objectFit: "contain" }}
                />
              </Box>
            )}

            {quiz.content_html && (
              <Box>
                <Typography variant="body2" fontWeight={600} mb={0.5}>
                  Nội dung đoạn văn / passage
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "white" }}>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>{quiz.content_html}</Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        )}

        <Divider sx={{ my: 3 }} />

        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600} color="primary" mb={2}>
            Danh sách câu hỏi
          </Typography>

          {quiz.question_ids?.length ? (
            quiz.question_ids.map((q: any, i: number) => (
              <Box
                key={q._id || i}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  bgcolor: "#fff",
                }}
              >
                <Typography fontWeight={700} mb={1}>
                  Câu {i + 1}: {q.textQuestion || "—"}
                </Typography>

                <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={1}>
                  {["A", "B", "C", "D"].map((opt) => (
                    <Typography
                      key={opt}
                      variant="body2"
                      color={q.correctAnswer === opt ? "primary" : "text.secondary"}
                      fontWeight={q.correctAnswer === opt ? 700 : 400}
                    >
                      {opt}. {getChoiceValue(q.choices, opt)}
                    </Typography>
                  ))}
                </Box>

                {q.explanation && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    <strong>Giải thích:</strong> {q.explanation}
                  </Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">Chưa có câu hỏi nào.</Typography>
          )}
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight="bold">
        {value || "—"}
      </Typography>
    </Box>
  );
}
