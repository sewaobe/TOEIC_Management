import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Breadcrumbs,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { examParts } from "../../../../constants/examParts";
import GroupForm from "../../components/GroupForm";
import groupService from "../../../../services/group.service";
import { useFetchList } from "../../../../hooks/useFetchList";
import { Group } from "../../../../types/group";

const EditQuestionPage = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Hook CRUD - chỉ dùng update
  const { updateItem } = useFetchList<Group>({
    fetchFn: async () => ({ items: [], pageCount: 1, total: 0 }),
    updateFn: async (id, data) => {
      const res = await groupService.update(id, data);
      return res.data;
    },
  });

  // ✅ Lấy group theo id từ BE
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!groupId) return;
        const res = await groupService.getById(groupId);
        if (res.data) {
          setGroups([res.data]); // giữ nguyên 1 group
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải group:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [groupId]);

  // ✅ Helpers
  const getTagOptions = (part: number | null) =>
    part && part > 0 && examParts[part]?.tags
      ? examParts[part].tags.map((t: any) => t.name)
      : [];

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
          ? {
              ...g,
              questions: [
                ...g.questions,
                {
                  id: `temp-${Date.now()}`, // 🔹 fake id tạm cho React key
                  name: `Question ${g.questions.length + 1}`,
                  textQuestion: "",
                  choices: { A: "", B: "", C: "", D: "" },
                  correctAnswer: "A",
                  planned_time: 0,
                  explanation: "",
                  tags: [],
                  created_at: new Date().toISOString(),
                },
              ],
            }
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

  // ✅ Cập nhật group
  const handleSave = async () => {
    if (!groups[0]) return;
    await updateItem(groupId!, groups[0]);
    navigate("/ctv/questions");
  };

  // ✅ Loading / Error
  if (isLoading)
    return (
      <Box className="flex justify-center py-20">
        <CircularProgress />
      </Box>
    );

  if (!groups.length)
    return (
      <Box className="p-6 text-center">
        <Typography color="error">Không tìm thấy nhóm câu hỏi này.</Typography>
      </Box>
    );

  // ✅ group hiện tại
  const currentGroup = groups[0];
  const partIndex = currentGroup.part ?? null;

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          to="/ctv/questions"
          style={{ textDecoration: "none", color: "#1976d2", fontWeight: 500 }}
        >
          Ngân hàng câu hỏi
        </Link>
        <Typography color="text.primary">Chỉnh sửa</Typography>
      </Breadcrumbs>

      <Typography variant="h5" fontWeight="bold" mb={3}>
        Sửa câu hỏi
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 1000, mx: "auto" }}>
        <Grid container spacing={2} mb={3}>
          {/* Type (ẩn hoặc disable) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Loại"
              fullWidth
              value={currentGroup.type}
              disabled
            />
          </Grid>

          {/* Chọn Part */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Part"
              fullWidth
              value={partIndex ?? ""}
              onChange={(e) =>
                handleChangeGroup(0, "part", Number(e.target.value))
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

        {/* Form Group (giống Create) */}
        <GroupForm
          groupIndex={0}
          group={currentGroup}
          tagOptions={getTagOptions(currentGroup.part ?? null)}
          onChange={handleChangeGroup}
          onChangeQuestion={handleChangeQuestion}
          onRemoveQuestion={handleRemoveQuestion}
          onAddQuestion={handleAddQuestion}
        />

        <Box textAlign="center" mt={2}>
          <Button variant="contained" onClick={handleSave}>
            Cập nhật
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditQuestionPage;
