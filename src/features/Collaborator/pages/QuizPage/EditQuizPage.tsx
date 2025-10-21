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
import GroupForm from "../../components/GroupForm";

export default function EditQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🧠 ViewModel phải được khởi tạo ở đầu component
  const vm = useQuizBuilderViewModel();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({
    title: "",
    topic: [],
    part_type: "",
    level: "",
    status: "",
    planned_completion_time: 0,
    weight: 0.1,
  });
  const [topicOptions, setTopicOptions] = useState<{ id: string; title: string }[]>([]);

  // 🧭 Lấy danh sách topic thật
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

  // 🧠 Lấy quiz hiện có
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getById(id!);
        const quiz = res.data!;

        // Gán vào form
        setForm({
          title: quiz.title || "",
          topic: quiz.topic?.map((t: any) => t._id || t.id) || [],
          part_type: quiz.part_type || "",
          level: quiz.level || "",
          status: quiz.status || "draft",
          planned_completion_time: quiz.planned_completion_time || 0,
          weight: quiz.weight || 0.1,
        });

        // Gán dữ liệu quiz vào ViewModel
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

  // 🖊️ Cập nhật giá trị form
  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  // 💾 Lưu quiz sau chỉnh sửa
  const handleUpdate = async () => {
    try {
      const payload = {
        ...form,
        part_type: form.part_type ? Number(form.part_type) : undefined,
        topic: form.topic,
        group_ids: vm.groups,
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
          {/* Tên quiz */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Tên Quiz"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              sx={{ bgcolor: "white" }}
            />
          </Grid>

          {/* Trạng thái */}
          <Grid size={{ xs: 12, md: 2.5 }}>
            <TextField
              select
              fullWidth
              label="Trạng thái"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="draft">Nháp</MenuItem>
              <MenuItem value="published">Công khai</MenuItem>
            </TextField>
          </Grid>

          {/* Level */}
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

          {/* Part Type */}
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

          {/* Chủ đề (topic) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              options={topicOptions}
              getOptionLabel={(option) => option.title}
              value={topicOptions.filter((t) => form.topic.includes(t.id))}
              onChange={(event, newValue) =>
                handleChange("topic", newValue.map((t) => t.id))
              }
              renderInput={(params) => (
                <TextField {...params} label="Chủ đề (Topic)" placeholder="Chọn 1 hoặc nhiều chủ đề" />
              )}
              sx={{ bgcolor: "white" }}
            />
          </Grid>

          {/* Planned completion */}
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

          {/* Weight */}
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

      {/* 🔸 Danh sách nhóm câu hỏi */}
      {vm.groups.map((g: any, gi: number) => (
        <Box key={gi} mb={3}>
          <GroupForm
            groupIndex={gi}
            group={g}
            tagOptions={["grammar", "vocabulary"]}
            onChange={vm.updateGroup}
            onChangeQuestion={vm.updateQuestion}
            onAddQuestion={vm.addQuestion}
            onRemoveQuestion={vm.removeQuestion}
            isQuiz={true}
          />
          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={() => vm.removeGroup(gi)}
            sx={{ mt: 1 }}
          >
            🗑️ Xóa nhóm {gi + 1}
          </Button>
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* ➕ Thêm nhóm + Lưu thay đổi */}
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          onClick={vm.addGroup}
          sx={{
            borderColor: "#2563eb",
            color: "#2563eb",
            ":hover": { bgcolor: "#eff6ff" },
          }}
        >
          ➕ Thêm nhóm mới
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
