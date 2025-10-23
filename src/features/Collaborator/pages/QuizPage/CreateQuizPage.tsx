import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  MenuItem,
  Grid,
  Autocomplete,
} from "@mui/material";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import quizService from "./services/quiz.service";
import { lessonManagerService } from "../../../../services/lesson_manager.service";
import { useQuizBuilderViewModel } from "./viewmodel/useQuizBuilderViewModel";

export default function CreateQuizPage() {
  const vm = useQuizBuilderViewModel();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    topic: [] as string[],
    part_type: "",
    level: "",
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
        console.error("❌ Lỗi khi tải danh sách topic:", error);
      }
    };
    fetchTopics();
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (!form.title.trim()) {
        toast.error("Vui lòng nhập tên quiz!");
        return;
      }
      if (vm.questions.length === 0) {
        toast.error("Cần ít nhất 1 câu hỏi!");
        return;
      }

      const payload = {
        ...form,
        part_type: form.part_type ? Number(form.part_type) : undefined,
        topic: form.topic,
        question_ids: vm.questions, // ✅ Gửi danh sách câu hỏi trực tiếp
      };

      await quizService.create(payload);
      toast.success("🎉 Tạo quiz thành công!");
      navigate("/ctv/quiz");
    } catch (error) {
      console.error(error);
      toast.error("❌ Lưu quiz thất bại!");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        🧩 Tạo Quiz Mới
      </Typography>

      {/* 🔹 Thông tin cơ bản */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: "#fafafa", borderRadius: 3 }}>
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
              {[1, 2, 3, 4, 5, 6, 7].map((part) => (
                <MenuItem key={part} value={part}>
                  Part {part}
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
                <TextField {...params} label="Chủ đề (Topic)" placeholder="Chọn chủ đề" />
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
            <Button variant="outlined" color="error" onClick={() => vm.removeQuestion(qi)}>
              🗑️ Xóa câu hỏi
            </Button>
          </Box>
        </Paper>
      ))}

      <Divider sx={{ my: 3 }} />

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
          onClick={handleSave}
          sx={{ bgcolor: "#2563eb", ":hover": { bgcolor: "#1e40af" } }}
        >
          💾 Lưu Quiz
        </Button>
      </Box>
    </Box>
  );
}
