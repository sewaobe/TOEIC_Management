import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Breadcrumbs,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { examParts } from "../../../../constants/examParts";
import GroupForm from "../../components/GroupForm";

const CreateQuestionPage = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState<any[]>([]);
  const [testType, setTestType] = useState<"TEST" | "LESSON" | "QUIZ">("TEST");
  const [partIndex, setPartIndex] = useState<number | null>(null);

  const getGroupSize = (part: number | null) => {
    if (part === null) return 1;
    if ([1, 2, 5].includes(part)) return 1;
    if ([3, 4].includes(part)) return 3;
    if (part === 6) return 4;
    if (part === 7) return 2;
    return 1;
  };

  const getTagOptions = (part: number | null) =>
    part !== null && part > 0 && examParts[part]?.tags
      ? examParts[part].tags.map((t: any) => t.name)
      : [];

  const makeEmptyQuestion = (part: number | null) => ({
    textQuestion: "",
    choices: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A",
    planned_time: 0,
    explanation: "",
    tags: [] as string[],
    choiceLabels: part === 2 ? ["A", "B", "C"] : ["A", "B", "C", "D"],
  });

  const makeEmptyGroup = (type: string, part: number | null) => {
    const groupSize = getGroupSize(part);
    return {
      type,
      partIndex: part,
      transcriptEnglish: "",
      transcriptTranslation: "",
      audioFile: null,
      imageFiles: [],
      questions: Array.from({ length: groupSize }, () =>
        makeEmptyQuestion(part)
      ),
    };
  };

  // 🔹 Reset group khi đổi type hoặc part
  useEffect(() => {
    setGroups([makeEmptyGroup(testType, partIndex)]);
  }, [testType, partIndex]);

  const handleChangeGroup = (groupIndex: number, field: string, value: any) => {
    setGroups((prev) =>
      prev.map((g, idx) => (idx === groupIndex ? { ...g, [field]: value } : g))
    );
  };

  const handleChangeQuestion = (
    groupIndex: number,
    questionIndex: number,
    field: string,
    value: any
  ) => {
    setGroups((prev) =>
      prev.map((g, idx) =>
        idx === groupIndex
          ? {
              ...g,
              questions: g.questions.map((q: any, qIdx: number) =>
                qIdx === questionIndex ? { ...q, [field]: value } : q
              ),
            }
          : g
      )
    );
  };

  const handleAddQuestion = (groupIndex: number) => {
    setGroups((prev) =>
      prev.map((g, idx) =>
        idx === groupIndex
          ? g.questions.length < 5
            ? { ...g, questions: [...g.questions, makeEmptyQuestion(7)] }
            : g
          : g
      )
    );
  };

  const handleRemoveQuestion = (groupIndex: number, questionIndex: number) => {
    setGroups((prev) =>
      prev.map((g, idx) =>
        idx === groupIndex
          ? {
              ...g,
              questions: g.questions.filter(
                (_: any, qIdx: number) => qIdx !== questionIndex
              ),
            }
          : g
      )
    );
  };

  const handleSave = () => {
    console.log("📌 Payload gửi BE:", groups);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          to="/ctv/questions"
          style={{ textDecoration: "none", color: "#1976d2", fontWeight: 500 }}
        >
          Ngân hàng câu hỏi
        </Link>
        <Typography color="text.primary">Thêm mới</Typography>
      </Breadcrumbs>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        Thêm câu hỏi mới
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 1000, mx: "auto" }}>
        <Grid container spacing={2} mb={3}>
          {/* Chọn Type */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Loại"
              fullWidth
              value={testType}
              onChange={(e) =>
                setTestType(e.target.value as "TEST" | "LESSON" | "QUIZ")
              }
            >
              <MenuItem value="TEST">Test</MenuItem>
              <MenuItem value="LESSON">Lesson</MenuItem>
              <MenuItem value="QUIZ">Quiz</MenuItem>
            </TextField>
          </Grid>

          {/* Chọn Part */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Part"
              fullWidth
              value={partIndex ?? ""}
              onChange={(e) =>
                setPartIndex(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">Không chọn</MenuItem>
              {examParts.map((part, idx) =>
                idx > 0 ? (
                  <MenuItem key={idx} value={idx}>
                    {part.label}
                  </MenuItem>
                ) : null
              )}
            </TextField>
          </Grid>
        </Grid>

        {groups.map((g, idx) => (
          <GroupForm
            key={idx}
            groupIndex={idx}
            group={g}
            tagOptions={getTagOptions(g.partIndex)}
            onChange={handleChangeGroup}
            onChangeQuestion={handleChangeQuestion}
            onRemoveQuestion={handleRemoveQuestion}
            onAddQuestion={handleAddQuestion}
          />
        ))}

        <Box textAlign="center" mt={2}>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateQuestionPage;
