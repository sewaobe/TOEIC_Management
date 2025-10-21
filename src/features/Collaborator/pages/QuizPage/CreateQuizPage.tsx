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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useQuizBuilderViewModel } from "./viewmodel/useQuizBuilderViewModel";
import GroupForm from "../../components/GroupForm";
import { toast } from "sonner";
import quizService from "./services/quiz.service";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { lessonManagerService } from "../../../../services/lesson_manager.service";

export default function CreateQuizPage() {
  const vm = useQuizBuilderViewModel();
  const navigate = useNavigate();

  // 🧩 Form cơ bản của Quiz
  const [form, setForm] = useState({
    title: "",
    topic: [] as string[], // lưu danh sách id topic
    part_type: "",
    level: "",
    status: "draft",
    planned_completion_time: 0,
    weight: 0.1,
  });

  // 🧠 Danh sách topic thật lấy từ LessonManager
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

  // Cập nhật giá trị form
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Lưu Quiz
  const handleSave = async () => {
    try {
      if (!form.title.trim()) {
        toast.error("Vui lòng nhập tên quiz!");
        return;
      }
      if (vm.groups.length === 0) {
        toast.error("Cần ít nhất 1 nhóm câu hỏi!");
        return;
      }

      const payload = {
        ...form,
        part_type: form.part_type ? Number(form.part_type) : undefined,
        topic: form.topic, // ✅ gửi mảng id topic
        group_ids: vm.groups,
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
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "#fafafa",
          borderRadius: 3,
        }}
      >
        <Grid container spacing={2}>
          {/* Hàng 1 */}
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
              label="Trạng thái"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="draft">Nháp</MenuItem>
              <MenuItem value="published">Công khai</MenuItem>
            </TextField>
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
              <MenuItem value={1}>Part 1</MenuItem>
              <MenuItem value={2}>Part 2</MenuItem>
              <MenuItem value={3}>Part 3</MenuItem>
              <MenuItem value={4}>Part 4</MenuItem>
              <MenuItem value={5}>Part 5</MenuItem>
              <MenuItem value={6}>Part 6</MenuItem>
              <MenuItem value={7}>Part 7</MenuItem>
            </TextField>
          </Grid>

          {/* Hàng 2 */}
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
              sx={{
                bgcolor: "white",
                "& .MuiAutocomplete-inputRoot": {
                  flexWrap: "nowrap !important",
                  overflowX: "auto",
                  overflowY: "hidden",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": {
                    height: 6,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "transparent",
                  },
                  "&:hover::-webkit-scrollbar-thumb": {
                    backgroundColor: "#bbb",
                  },
                },
                "& .MuiAutocomplete-tag": {
                  fontSize: "0.85rem",
                  backgroundColor: "#f1f3f4",
                  color: "#333",
                  borderRadius: "20px",
                  padding: "2px 8px",
                  marginRight: "4px",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                },
              }}
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

      {/* 🔸 Danh sách nhóm câu hỏi */}
      {vm.groups.map((g, gi) => (
        <Paper
          key={gi}
          sx={{
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e0e0e0",
          }}
        >
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                bgcolor: "#f9fafb",
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              }}
            >
              <Typography fontWeight={600}>Nhóm {gi + 1}</Typography>
              <Button
                color="error"
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  vm.removeGroup(gi);
                }}
              >
                🗑️ Xóa
              </Button>
            </AccordionSummary>

            <AccordionDetails sx={{ bgcolor: "#fff" }}>
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
            </AccordionDetails>
          </Accordion>
        </Paper>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* ➕ Nút thêm nhóm + Lưu Quiz */}
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
          onClick={handleSave}
          sx={{ bgcolor: "#2563eb", ":hover": { bgcolor: "#1e40af" } }}
        >
          💾 Lưu Quiz
        </Button>
      </Box>
    </Box>
  );
}
