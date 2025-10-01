import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Breadcrumbs,
  Autocomplete,
  Chip,
  Grid,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { examParts } from "../../../../constants/examParts";

const EditQuestionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    textQuestion: "",
    choices: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A",
    explanation: "",
    audioUrl: "",
    audioFile: null as File | null, // 👈 thêm field file
    partIndex: 0,
    tags: [] as string[],
  });

  // Lấy dữ liệu câu hỏi theo id
  useEffect(() => {
    // TODO: call API lấy dữ liệu thật
    const mockData = {
      id,
      name: "Question 1",
      textQuestion: "What does TOEIC stand for?",
      choices: {
        A: "Test of Engineering in Communication",
        B: "Teaching of English for International Companies",
        C: "Test of English for International Communication",
        D: "Training of English in College",
      },
      correctAnswer: "C",
      explanation: "TOEIC = Test of English for International Communication.",
      audioUrl: "",
      partIndex: 2,
      tags: ["[Part 2] Câu hỏi WHAT"],
    };
    setForm((prev) => ({ ...prev, ...mockData }));
  }, [id]);

  const currentTags =
    form.partIndex > 0 ? examParts[form.partIndex].tags.map((t) => t.name) : [];

  const choiceLabels =
    form.partIndex === 2 ? ["A", "B", "C"] : ["A", "B", "C", "D"];

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChoiceChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      choices: { ...prev.choices, [key]: value },
    }));
  };

  // chọn file audio
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((prev) => ({
        ...prev,
        audioFile: file,
        audioUrl: URL.createObjectURL(file), // preview tạm
      }));
    }
  };

  const handleUpdate = () => {
    const finalChoices =
      form.partIndex === 2
        ? { A: form.choices.A, B: form.choices.B, C: form.choices.C }
        : form.choices;

    const payload = {
      id,
      ...form,
      choices: finalChoices,
    };

    console.log("📌 Payload update:", payload);
    // TODO: call API update câu hỏi + upload audio lên Cloudinary
    navigate("/ctv/questions");
  };

  return (
    <Box sx={{ p: 3, height: "100%" }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          to="/ctv/questions"
          style={{
            textDecoration: "none",
            color: "#1976d2",
            fontWeight: 500,
          }}
        >
          Ngân hàng câu hỏi
        </Link>
        <Typography color="text.primary">Chỉnh sửa</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Sửa câu hỏi
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 1000, mx: "auto" }}>
        <Grid container spacing={2}>
          {/* Part */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Part"
              fullWidth
              value={form.partIndex}
              onChange={(e) => handleChange("partIndex", Number(e.target.value))}
            >
              {examParts.map((part, idx) =>
                idx > 0 ? (
                  <MenuItem key={idx} value={idx}>
                    {part.label}
                  </MenuItem>
                ) : null
              )}
            </TextField>
          </Grid>

          {/* Tags */}
          <Grid size={{ xs: 12, md: 8 }}>
            {form.partIndex > 0 && (
              <Autocomplete
                multiple
                options={currentTags}
                value={form.tags}
                onChange={(_, newValue) => handleChange("tags", newValue)}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Tags" />
                )}
              />
            )}
          </Grid>

          {/* Tên câu hỏi */}
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Tên câu hỏi"
              fullWidth
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid>

          {/* Nội dung */}
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nội dung"
              fullWidth
              multiline
              rows={3}
              value={form.textQuestion}
              onChange={(e) => handleChange("textQuestion", e.target.value)}
            />
          </Grid>

          {/* Đáp án A & B */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Đáp án A"
              fullWidth
              value={form.choices.A}
              onChange={(e) => handleChoiceChange("A", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Đáp án B"
              fullWidth
              value={form.choices.B}
              onChange={(e) => handleChoiceChange("B", e.target.value)}
            />
          </Grid>

          {/* Đáp án C & D */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Đáp án C"
              fullWidth
              value={form.choices.C}
              onChange={(e) => handleChoiceChange("C", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {form.partIndex === 2 ? (
              <Box sx={{ height: "100%" }} />
            ) : (
              <TextField
                label="Đáp án D"
                fullWidth
                value={form.choices.D}
                onChange={(e) => handleChoiceChange("D", e.target.value)}
              />
            )}
          </Grid>

          {/* Đáp án đúng */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Đáp án đúng"
              fullWidth
              value={form.correctAnswer}
              onChange={(e) => handleChange("correctAnswer", e.target.value)}
            >
              {choiceLabels.map((label) => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Upload Audio */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                height: "56px",
                justifyContent: "flex-start",
                textTransform: "none",
              }}
            >
              {form.audioFile
                ? form.audioFile.name
                : form.audioUrl
                ? "Đã có audio"
                : "Chọn file audio"}
              <input
                type="file"
                hidden
                accept="audio/*"
                onChange={handleFileChange}
              />
            </Button>
          </Grid>

          {/* Giải thích */}
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Giải thích"
              fullWidth
              multiline
              rows={4}
              value={form.explanation}
              onChange={(e) => handleChange("explanation", e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Nút hành động */}
        <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate("/ctv/questions")}>
            Trở lại
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditQuestionPage;
