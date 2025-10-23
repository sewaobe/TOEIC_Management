import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Button,
  Divider,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import quizService from "./services/quiz.service";
import { lessonManagerService } from "../../../../services/lesson_manager.service";
import { useQuizBuilderViewModel } from "./viewmodel/useQuizBuilderViewModel";

export default function EditQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vm = useQuizBuilderViewModel();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({
    title: "",
    topic: [],
    part_type: "",
    level: "",
    status: "draft",
    planned_completion_time: 0,
    weight: 0.1,
  });
  const [topicOptions, setTopicOptions] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topics = await lessonManagerService.getAllTopicTitles();
        setTopicOptions(topics);
      } catch (error) {
        console.error("❌ Lỗi khi tải topic:", error);
        toast.error("Không thể tải danh sách chủ đề!");
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getById(id!);
        const quiz = res.data!;
        setForm({
          title: quiz.title || "",
          topic: quiz.topic?.map((t: any) => t._id || t.id) || [],
          part_type: quiz.part_type || "",
          level: quiz.level || "",
          status: quiz.status || "draft",
          planned_completion_time: quiz.planned_completion_time || 0,
          weight: quiz.weight || 0.1,
        });
        vm.initFromQuiz(quiz);
      } catch (error) {
        console.error(error);
        toast.error("Không tải được quiz!");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (!form.title.trim()) {
        toast.error("Vui lòng nhập tên quiz!");
        return;
      }
      if (vm.questions.length === 0) {
        toast.error("Cần ít nhất 1 câu hỏi!");
        return;
      }

      const { status, ...formWithoutStatus } = form; // 🟢 bỏ status khỏi payload

      const payload = {
        ...formWithoutStatus,
        part_type: form.part_type ? Number(form.part_type) : undefined,
        topic: form.topic,
        question_ids: vm.questions,
      };

      await quizService.update(id!, payload);
      toast.success("🎉 Cập nhật quiz thành công!");
      navigate("/ctv/quiz");
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi cập nhật quiz!");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        ✏️ Chỉnh sửa Quiz
      </Typography>

      {/* 🔹 Form thông tin cơ bản */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: "#fafafa" }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Tên Quiz"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              sx={{ bgcolor: "white" }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2.5 }}>
            <TextField
              fullWidth
              label="Trạng thái"
              value={
                form.status === "approved"
                  ? "Đã duyệt"
                  : form.status === "pending"
                  ? "Chờ duyệt"
                  : "Nháp"
              }
              disabled
              sx={{ bgcolor: "white" }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2.5 }}>
            <TextField
              select
              fullWidth
              label="Trình độ (Level)"
              value={form.level}
              onChange={(e) => handleChange("level", e.target.value)}
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="">Chưa chọn</MenuItem>
              <MenuItem value="A2">A2</MenuItem>
              <MenuItem value="B1">B1</MenuItem>
              <MenuItem value="B2">B2</MenuItem>
              <MenuItem value="C1">C1</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Phần thi (Part Type)"
              value={form.part_type}
              onChange={(e) => handleChange("part_type", e.target.value)}
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="">Chưa chọn</MenuItem>
              {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                <MenuItem key={p} value={p}>
                  Part {p}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              options={topicOptions}
              getOptionLabel={(option) => option.title}
              value={topicOptions.filter((t) => form.topic.includes(t.id))}
              onChange={(_, newValue) =>
                handleChange("topic", newValue.map((t) => t.id))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chủ đề (Topic)"
                  placeholder="Chọn 1 hoặc nhiều chủ đề"
                />
              )}
              sx={{ bgcolor: "white" }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Thời gian dự kiến (phút)"
              value={form.planned_completion_time}
              onChange={(e) =>
                handleChange("planned_completion_time", Number(e.target.value))
              }
              sx={{ bgcolor: "white" }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Trọng số (weight)"
              value={form.weight}
              onChange={(e) => handleChange("weight", Number(e.target.value))}
              sx={{ bgcolor: "white" }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 🔸 Danh sách câu hỏi */}
      {vm.questions.map((q, qi) => (
        <Paper
          key={qi}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            bgcolor: "#fff",
          }}
        >
          <Typography fontWeight={600} mb={1}>
            Câu hỏi {qi + 1}
          </Typography>

          <TextField
            fullWidth
            label="Nội dung câu hỏi"
            value={q.textQuestion}
            onChange={(e) => vm.updateQuestion(qi, "textQuestion", e.target.value)}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            {["A", "B", "C", "D"].map((opt) => (
              <Grid key={opt} size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label={`Đáp án ${opt}`}
                  value={q.choices?.[opt] || ""}
                  onChange={(e) =>
                    vm.updateQuestion(qi, "choices", {
                      ...q.choices,
                      [opt]: e.target.value,
                    })
                  }
                />
              </Grid>
            ))}
          </Grid>

          <TextField
            fullWidth
            select
            label="Đáp án đúng"
            value={q.correctAnswer}
            onChange={(e) => vm.updateQuestion(qi, "correctAnswer", e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">Chưa chọn</MenuItem>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="D">D</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Giải thích"
            value={q.explanation}
            onChange={(e) => vm.updateQuestion(qi, "explanation", e.target.value)}
            sx={{ mt: 2 }}
          />

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => vm.removeQuestion(qi)}
            >
              🗑️ Xóa câu hỏi
            </Button>
          </Box>
        </Paper>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* ➕ Thêm câu hỏi + Lưu thay đổi */}
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          onClick={vm.addQuestion}
          sx={{
            borderColor: "#2563eb",
            color: "#2563eb",
            ":hover": { bgcolor: "#eff6ff" },
          }}
        >
          ➕ Thêm câu hỏi
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          sx={{ bgcolor: "#2563eb", ":hover": { bgcolor: "#1e40af" } }}
        >
          💾 Lưu thay đổi
        </Button>
      </Box>
    </Box>
  );
}
