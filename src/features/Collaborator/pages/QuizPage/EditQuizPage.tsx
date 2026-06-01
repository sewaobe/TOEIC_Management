import { useEffect, useMemo, useState } from "react";
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
  Alert,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import quizService from "./services/quiz.service";
import { lessonManagerService } from "../../../../services/lesson_manager.service";
import { uploadToCloudinary } from "../../../../services/cloudinary.service";
import { useQuizBuilderViewModel } from "./viewmodel/useQuizBuilderViewModel";
import {
  TOEIC_PARTS,
  getQuestionCountRuleText,
  getSuggestedPlannedTime,
  validateQuizMediaForPart,
} from "./quizPartRules";

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;

export default function EditQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vm = useQuizBuilderViewModel();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timeTouched, setTimeTouched] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [form, setForm] = useState<any>({
    title: "",
    topic: [],
    part_type: "",
    level: "",
    status: "draft",
    planned_completion_time: 0,
    weight: 0.1,
    content_html: "",
    image_url: "",
    audio_url: "",
  });
  const [topicOptions, setTopicOptions] = useState<{ id: string; title: string }[]>([]);

  const part = Number(form.part_type || 5);
  const countError = useMemo(
    () => vm.validateQuestionCountForPart(part),
    [part, vm.questions.length]
  );

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topics = await lessonManagerService.getAllTopicTitles();
        setTopicOptions(topics);
      } catch (error) {
        console.error("Failed to load topics:", error);
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
          topic: quiz.topic?.map((t: any) => t._id || t.id || t) || [],
          part_type: quiz.part_type || "",
          level: quiz.level || "",
          status: quiz.status || "draft",
          planned_completion_time: quiz.planned_completion_time || 0,
          weight: quiz.weight || 0.1,
          content_html: quiz.content_html || "",
          image_url: quiz.image_url || "",
          audio_url: quiz.audio_url || "",
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

  useEffect(() => {
    if (timeTouched || loading || form.planned_completion_time > 0) return;
    setForm((prev: any) => ({
      ...prev,
      planned_completion_time: getSuggestedPlannedTime(part, vm.questions.length),
    }));
  }, [part, vm.questions.length, timeTouched, loading, form.planned_completion_time]);

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

  const prepareMediaPayload = async () => {
    const [uploadedImage, uploadedAudio] = await Promise.all([
      imageFile ? uploadToCloudinary(imageFile) : Promise.resolve(null),
      audioFile ? uploadToCloudinary(audioFile) : Promise.resolve(null),
    ]);

    return {
      image_url: uploadedImage?.url || form.image_url?.trim() || "",
      audio_url: uploadedAudio?.url || form.audio_url?.trim() || "",
      content_html: form.content_html || "",
    };
  };

  const handleUpdate = async () => {
    try {
      if (!form.title.trim()) {
        toast.error("Vui lòng nhập tên quiz!");
        return;
      }

      if (countError) {
        toast.error(countError);
        return;
      }

      setSaving(true);
      const mediaPayload = await prepareMediaPayload();
      const mediaError = validateQuizMediaForPart(part, mediaPayload);
      if (mediaError) {
        toast.error(mediaError);
        return;
      }

      const { status, ...formWithoutStatus } = form;
      await quizService.update(id!, {
        ...formWithoutStatus,
        ...mediaPayload,
        part_type: part,
        topic: form.topic,
        question_ids: vm.questions,
      });

      toast.success("Cập nhật quiz thành công!");
      navigate("/ctv/quiz");
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Lỗi khi cập nhật quiz!"));
    } finally {
      setSaving(false);
    }
  };

  const showImageField = [1, 3, 4, 5, 6, 7].includes(part);
  const showAudioField = [1, 2, 3, 4, 5].includes(part);
  const showContentField = [3, 4, 5, 6, 7].includes(part);

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Chỉnh sửa Quiz
      </Typography>

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
              label="Phần thi (Part)"
              value={form.part_type}
              onChange={(e) => handleChange("part_type", e.target.value)}
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="">Chưa chọn</MenuItem>
              {TOEIC_PARTS.map((p) => (
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
              onChange={(e) => {
                setTimeTouched(true);
                handleChange("planned_completion_time", Number(e.target.value));
              }}
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

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Alert severity={countError ? "warning" : "info"}>
            Quy định Part: {getQuestionCountRuleText(part)}. Số câu hiện tại: {vm.questions.length}
          </Alert>

          <Button variant="outlined" onClick={() => vm.ensureQuestionCountForPart(part)}>
            Tạo đủ số câu theo Part
          </Button>

          {showAudioField && (
            <Box>
              <TextField
                fullWidth
                label="Audio bài nghe URL"
                value={form.audio_url}
                onChange={(e) => handleChange("audio_url", e.target.value)}
                helperText={audioFile ? `Sẽ upload file: ${audioFile.name}` : "Không chọn file thì giữ URL hiện tại"}
              />
              <Button component="label" sx={{ mt: 1 }}>
                Chọn file audio
                <input
                  hidden
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                />
              </Button>
            </Box>
          )}

          {showImageField && (
            <Box>
              <TextField
                fullWidth
                label="Ảnh minh họa URL"
                value={form.image_url}
                onChange={(e) => handleChange("image_url", e.target.value)}
                helperText={imageFile ? `Sẽ upload file: ${imageFile.name}` : "Không chọn file thì giữ URL hiện tại"}
              />
              <Button component="label" sx={{ mt: 1 }}>
                Chọn file ảnh
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </Button>
            </Box>
          )}

          {showContentField && (
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Nội dung đoạn văn / passage"
              value={form.content_html}
              onChange={(e) => handleChange("content_html", e.target.value)}
            />
          )}
        </Stack>
      </Paper>

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
              Xóa câu hỏi
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
          Thêm câu hỏi
        </Button>
        <Button
          variant="contained"
          disabled={saving}
          onClick={handleUpdate}
          sx={{ bgcolor: "#2563eb", ":hover": { bgcolor: "#1e40af" } }}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </Box>
    </Box>
  );
}
