import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  MenuItem,
  Stack,
  Autocomplete,
} from "@mui/material";
import { Edit, Delete, Visibility, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import quizService from "./services/quiz.service";
import { lessonManagerService } from "../../../../services/lesson_manager.service";
import QuizDetailDialog from "./QuizDetailDialog";

export default function QuizListPage() {
  const navigate = useNavigate();

  // 🧠 State dữ liệu chính
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  // 🔍 Bộ lọc + phân trang
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [topicId, setTopicId] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);

  // 📚 Danh sách topic thật
  const [topicOptions, setTopicOptions] = useState<{ id: string; title: string }[]>([]);

  // 🕐 Debounce tìm kiếm (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔄 Lấy danh sách Topic từ LessonManager
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topics = await lessonManagerService.getAllTopicTitles();
        setTopicOptions(topics);
      } catch (error) {
        console.error("❌ Lỗi khi tải topic:", error);
      }
    };
    fetchTopics();
  }, []);

  // 📥 Lấy danh sách quiz
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await quizService.getAll({
        page: page + 1,
        limit,
        query: debouncedSearch,
        topic: topicId,
        level,
        status,
      });

      const result = res.data!;
      setQuizzes(result.items || []);
      setTotal(result.total || 0);
    } catch (err) {
      toast.error("Không tải được danh sách quiz!");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Load khi thay đổi filter / trang
  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearch, topicId, level, status]);

  // 🗑️ Xóa quiz
  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa quiz này?")) return;
    try {
      await quizService.delete(id);
      toast.success("Xóa quiz thành công!");
      fetchData();
    } catch {
      toast.error("Không thể xóa quiz!");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 🔹 Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight={700}>
          Danh sách Quiz
        </Typography>
        <Button variant="contained" onClick={() => navigate("/ctv/quiz/create")}>
          + Tạo Quiz
        </Button>
      </Box>

      {/* 🔍 Bộ lọc */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
            InputProps={{ endAdornment: <Search fontSize="small" /> }}
          />

          <Autocomplete
            options={topicOptions}
            getOptionLabel={(option) => option.title}
            value={topicOptions.find((t) => t.id === topicId) || null}
            onChange={(event, newValue) => setTopicId(newValue ? newValue.id : "")}
            renderInput={(params) => (
              <TextField {...params} label="Topic" size="small" sx={{ minWidth: 180 }} />
            )}
          />

          <TextField
            select
            label="Level"
            size="small"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="A2">A2</MenuItem>
            <MenuItem value="B1">B1</MenuItem>
            <MenuItem value="B2">B2</MenuItem>
            <MenuItem value="C1">C1</MenuItem>
          </TextField>

          <TextField
            select
            label="Trạng thái"
            size="small"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="draft">Nháp</MenuItem>
            <MenuItem value="published">Đã xuất bản</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* 🧮 Bảng danh sách */}
      <Paper>
        {loading ? (
          <Typography p={2}>Đang tải...</Typography>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên Quiz</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map((q) => (
                  <TableRow key={q._id}>
                    <TableCell>{q.title}</TableCell>
                    <TableCell>
                      {q.topic?.map((t: any) => t.title).join(", ") || "—"}
                    </TableCell>
                    <TableCell>{q.level ?? "—"}</TableCell>
                    <TableCell>{q.status ?? "draft"}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem chi tiết">
                        <IconButton onClick={() => setSelected(q)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sửa">
                        <IconButton onClick={() => navigate(`/ctv/quiz/edit/${q._id}`)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton color="error" onClick={() => handleDelete(q._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={limit}
              onRowsPerPageChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>

      <QuizDetailDialog open={!!selected} quiz={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
