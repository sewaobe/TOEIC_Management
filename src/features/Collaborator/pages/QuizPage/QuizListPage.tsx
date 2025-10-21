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
  Chip,
} from "@mui/material";
import { Edit, Delete, Visibility, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import quizService from "./services/quiz.service";
import QuizDetailDialog from "./QuizDetailDialog";
import { lessonManagerService } from "../../../../services/lesson_manager.service";

export default function QuizListPage() {
  const navigate = useNavigate();

  // 🧩 State cơ bản
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  // 🔍 Bộ lọc + phân trang
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // ✅ thêm state debounce
  const [topicId, setTopicId] = useState("");
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);

  // 📚 Danh sách topic thật
  const [topics, setTopics] = useState<{ id: string; title: string }[]>([]);

  // 🧭 Lấy topic thật từ LessonManager
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await lessonManagerService.getAllTopicTitles();
        setTopics(data);
      } catch (error) {
        console.error("❌ Lỗi khi tải topic:", error);
        toast.error("Không thể tải danh sách topic!");
      }
    };
    fetchTopics();
  }, []);

  // ⏳ Debounce input tìm kiếm (chỉ gọi API sau 500ms khi dừng gõ)
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);

  // 📊 Gọi API lấy quiz
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await quizService.getAll({
        page: page + 1,
        limit,
        query: debouncedSearch, // ✅ dùng "query" đúng key với BE
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

  // 🔁 Fetch lại khi đổi filter / phân trang / debounce search
  useEffect(() => {
    fetchData();
  }, [debouncedSearch, topicId, level, status, page, limit]);

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
        <Button
          variant="contained"
          onClick={() => navigate("/ctv/quiz/create")}
        >
          + Tạo Quiz
        </Button>
      </Box>

      {/* 🔍 Bộ lọc */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
          {/* Ô tìm kiếm */}
          <TextField
            label="Tìm kiếm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // reset về trang đầu khi tìm kiếm mới
            }}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <Search fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
              ),
            }}
          />

          {/* Lọc theo topic */}
          <TextField
            select
            label="Topic"
            size="small"
            value={topicId}
            onChange={(e) => {
              setTopicId(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {topics.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.title}
              </MenuItem>
            ))}
          </TextField>

          {/* Lọc theo level */}
          <TextField
            select
            label="Level"
            size="small"
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="A2">A2</MenuItem>
            <MenuItem value="B1">B1</MenuItem>
            <MenuItem value="B2">B2</MenuItem>
            <MenuItem value="C1">C1</MenuItem>
          </TextField>

          {/* Lọc theo trạng thái */}
          <TextField
            select
            label="Trạng thái"
            size="small"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
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
                {quizzes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  quizzes.map((q) => (
                    <TableRow
                      key={q._id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#f5f9ff" },
                      }}
                      onClick={() => navigate(`/ctv/quiz/${q._id}/detail`)} // ✅ Điều hướng tới trang chi tiết
                    >
                      <TableCell>{q.title}</TableCell>

                      {/* 🔹 Hiển thị nhiều topic */}
                      <TableCell>
                        {Array.isArray(q.topic) && q.topic.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {q.topic.map((t: any) => (
                              <Chip
                                key={t._id || t.id}
                                label={t.title}
                                size="small"
                                sx={{
                                  bgcolor: "#e3f2fd",
                                  color: "#0d47a1",
                                  fontWeight: 500,
                                }}
                              />
                            ))}
                          </Stack>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell>{q.level ?? "—"}</TableCell>
                      <TableCell>{q.status ?? "draft"}</TableCell>

                      <TableCell
                        align="right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* ✏️ Nút chỉnh sửa màu xanh */}
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/ctv/quiz/edit/${q._id}`)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>

                        {/* 🗑️ Nút xóa giữ nguyên */}
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(q._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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

      {/* 🔍 Modal chi tiết */}
      <QuizDetailDialog
        open={!!selected}
        quiz={selected}
        onClose={() => setSelected(null)}
      />
    </Box>
  );
}
