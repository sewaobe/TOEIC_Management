import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Button,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import miniTestService from "./services/miniTest.service";
import { useMiniTestBuilderViewModel } from "./viewmodel/useMinitestBuilderViewModel";
import GroupForm from "../../components/GroupForm";

export default function EditMiniTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vm = useMiniTestBuilderViewModel();
  const theme = useTheme();

  const [form, setForm] = useState({
    title: "",
    topic: "",
    status: "draft",
  });

  const [loading, setLoading] = useState(true);
  const [activePart, setActivePart] = useState<number | null>(null);
  const [addedParts, setAddedParts] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await miniTestService.getById(`${id}?full=true`);
        const data = res.data!;
        setForm({
          title: data.title,
          topic: data.topic,
          status: data.status,
        });
        vm.initFromMiniTest(data);
        const parts = Array.from(
          new Set((data.groups || []).map((g: any) => g.part))
        );
        setAddedParts(parts);
        setActivePart(parts[0] || null);
      } catch (error) {
        console.error(error);
        toast.error("❌ Không tải được Mini Test!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }));

  const handleAddPart = (part: number) => {
    if (addedParts.includes(part)) {
      toast.warning(`Part ${part} đã tồn tại.`);
      return;
    }
    vm.addGroup(part);
    setAddedParts((prev) => [...prev, part]);
    setActivePart(part);
  };

  const handleUpdate = async () => {
    try {
      const payload = vm.buildPayload(form);
      await miniTestService.update(id!, payload as any);
      toast.success("🎉 Cập nhật Mini Test thành công!");
      navigate("/ctv/minitests");
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi cập nhật!");
    }
  };

  if (loading)
    return (
      <Typography sx={{ textAlign: "center", mt: 5 }}>
        ⏳ Đang tải Mini Test...
      </Typography>
    );

  const groupedByPart = vm.groupsByPart;

  // 🌗 Màu động theo theme
  const bgForm =
    theme.palette.mode === "light"
      ? theme.palette.background.paper
      : theme.palette.background.default;
  const borderColor = theme.palette.divider;

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
      {/* 🔹 Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 500,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => navigate("/ctv/minitests")}
        >
          Mini Test
        </Typography>
        <Typography sx={{ mx: 1, color: theme.palette.text.disabled }}>
          /
        </Typography>
        <Typography sx={{ fontWeight: 600 }}>Chỉnh sửa</Typography>
      </Box>

      <Typography variant="h4" fontWeight={700} mb={3}>
        ✏️ Chỉnh sửa Mini Test
      </Typography>

      {/* 🔹 Form cơ bản */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: bgForm, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              label="Tên Mini Test"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              sx={{ bgcolor: theme.palette.background.paper }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Trạng thái"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              sx={{ bgcolor: theme.palette.background.paper }}
            >
              <MenuItem value="draft">Nháp</MenuItem>
              <MenuItem value="published">Công khai</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Chủ đề (nhập tay)"
              value={form.topic}
              onChange={(e) => handleChange("topic", e.target.value)}
              sx={{ bgcolor: theme.palette.background.paper }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 🔸 Tabs các Part */}
      <Box mb={2} display="flex" gap={2}>
        <TextField
          select
          label="Thêm Part"
          size="small"
          sx={{ minWidth: 180 }}
          onChange={(e) => handleAddPart(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
            <MenuItem key={p} value={p}>
              Part {p}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {addedParts.length > 0 && (
        <>
          <Tabs
            value={activePart}
            onChange={(_, v) => setActivePart(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            {addedParts.map((p) => (
              <Tab key={p} value={p} label={`Part ${p}`} />
            ))}
          </Tabs>

          {addedParts.map((p) => (
            <Box
              key={p}
              sx={{ display: activePart === p ? "block" : "none", mt: 2 }}
            >
              {groupedByPart[p]?.map((g: any, gi: number) => (
                <Paper
                  key={`${p}-${gi}`}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: `1px solid ${borderColor}`,
                    bgcolor: bgForm,
                  }}
                >
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight={600}>
                        Group {gi + 1} — Part {p}
                      </Typography>
                      <Button
                        color="error"
                        size="small"
                        variant="outlined"
                        sx={{ ml: "auto" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          vm.removeGroup(p, gi);
                        }}
                      >
                        🗑️ Xóa
                      </Button>
                    </AccordionSummary>

                    <AccordionDetails
                      sx={{
                        bgcolor:
                          theme.palette.mode === "light"
                            ? theme.palette.background.paper
                            : theme.palette.background.default,
                      }}
                    >
                      <GroupForm
                        groupIndex={gi}
                        group={g}
                        tagOptions={["grammar", "vocabulary"]}
                        onChange={(gi, f, v) => vm.updateGroup(p, gi, f, v)}
                        onChangeQuestion={(gi, qi, f, v) =>
                          vm.updateQuestion(p, gi, qi, f, v)
                        }
                        onAddQuestion={(gi) => vm.addQuestion(p, gi)}
                        onRemoveQuestion={(gi, qi) =>
                          vm.removeQuestion(p, gi, qi)
                        }
                        isQuiz={true}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              ))}

              <Button
                variant="outlined"
                onClick={() => vm.addGroup(p)}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  ":hover": { bgcolor: theme.palette.action.hover },
                }}
              >
                ➕ Thêm Group mới cho Part {p}
              </Button>
            </Box>
          ))}
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleUpdate}
          sx={{
            bgcolor: theme.palette.primary.main,
            ":hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          💾 Lưu thay đổi
        </Button>
      </Box>
    </Box>
  );
}
