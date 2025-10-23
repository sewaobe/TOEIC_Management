import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  AccessTime,
  Layers,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import quizService from "./services/quiz.service";
import { toast } from "sonner";

/* ────────────────────────────────
   TRANG CHI TIẾT QUIZ (Model mới)
──────────────────────────────── */
export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getById(id!);
        setQuiz(res.data);
      } catch {
        toast.error("Không tải được dữ liệu quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading)
    return (
      <Box className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <CircularProgress />
        <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
      </Box>
    );

  if (!quiz)
    return (
      <Typography align="center" color="text.secondary" mt={4}>
        Không tìm thấy quiz
      </Typography>
    );

  const handleDelete = async () => {
    if (!confirm("Xác nhận xóa quiz này?")) return;
    try {
      await quizService.delete(quiz._id);
      toast.success("Quiz đã được xóa!");
      navigate(-1);
    } catch {
      toast.error("Không thể xóa quiz!");
    }
  };

  return (
    <Box className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* 🟦 Header */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 2,
          background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
          color: theme.palette.getContrastText(theme.palette.primary.light),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Chi tiết Quiz
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Edit />}
            onClick={() => navigate(`/ctv/quiz/edit/${quiz._id}`)}
          >
            Sửa
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </Box>
      </Paper>

      {/* 🧾 Thông tin Quiz */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h5" color="primary" fontWeight="bold">
          {quiz.title}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={3}>
          <Box>
            <InfoRow
              icon={<Layers color="primary" />}
              label="Phần thi"
              value={quiz.part_type ? `Part ${quiz.part_type}` : "—"}
            />
            <InfoRow
              icon={<AccessTime color="primary" />}
              label="Thời gian"
              value={quiz.planned_completion_time + " phút"}
            />
            <InfoRow label="Trạng thái" value={quiz.status === "draft" ? "Nháp" : "Công khai"} />
          </Box>

          <Box>
            <InfoRow label="Trình độ (Level)" value={quiz.level || "—"} />
            <InfoRow label="Trọng số" value={quiz.weight?.toString() || "—"} />
            <Typography variant="body2" color="text.secondary" mt={1}>
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
        </Box>
      </Paper>

      {/* 🧩 Danh sách câu hỏi */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
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
                border: "1px solid #e0e0e0",
                bgcolor: "#fafafa",
              }}
            >
              <Typography fontWeight="bold" mb={1}>
                Câu {i + 1}: {q.textQuestion || "—"}
              </Typography>

              <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
                {["A", "B", "C", "D"].map((opt) => (
                  <Typography
                    key={opt}
                    variant="body2"
                    color={q.correctAnswer === opt ? "primary" : "text.secondary"}
                    fontWeight={q.correctAnswer === opt ? 700 : 400}
                  >
                    {opt}. {q.choices?.[opt] || ""}
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
    </Box>
  );
}

/* ────────────────────────────────
   COMPONENT PHỤ DÙNG LẠI (InfoRow)
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
