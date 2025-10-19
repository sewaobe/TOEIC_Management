import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
  useTheme,
  MenuItem,
  Select,
  Pagination,
  Stack,
} from "@mui/material";
import { Add, Search, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GrammarModal from "./components/GrammarModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import lessonService from "../../services/lesson.service";
import { Lesson } from "../../types/lesson";

const renderStatusLabel = (status?: string) => {
  const colorMap: Record<string, string> = {
    draft: "#9e9e9e", // xám
    pending: "#ff9800", // cam
    approved: "#4caf50", // xanh lá
    rejected: "#f44336", // đỏ
  };
  const labelMap: Record<string, string> = {
    draft: "Nháp",
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
  };

  return (
    <Typography
      variant="body2"
      sx={{
        color: colorMap[status ?? ""] || "text.secondary",
        fontWeight: 600,
      }}
    >
      {labelMap[status ?? ""] || "—"}
    </Typography>
  );
};

export default function GrammarPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState<Lesson | null>(null);
  const [deleteItem, setDeleteItem] = useState<Lesson | null>(null);

  // ⚙️ Bộ lọc và phân trang
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [partType, setPartType] = useState<number | "">("");

  // 🕓 Debounce 500ms cho ô tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 🟢 Lấy danh sách
  const fetchLessons = async () => {
    try {
      setLoading(true);
      const res = await lessonService.getAll({
        page,
        limit,
        search: debouncedSearch,
        part_type: partType || undefined,
        status: status || undefined,
      });

      const data = res.data;
      if (data?.items) {
        setLessons(data.items);
        setTotalPages(data.totalPages);
      } else {
        setLessons([]);
        setTotalPages(1);
      }
    } catch {
      toast.error("Không thể tải danh sách bài học!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [page, debouncedSearch, partType, status]);

  // ➕ Tạo mới
  const handleAdd = () => {
    setEditItem(null);
    setOpenModal(true);
  };

  // ✏️ Sửa cơ bản
  const handleEdit = (item: Lesson, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditItem(item);
    setOpenModal(true);
  };

  // 💾 Lưu (tạo mới hoặc sửa cơ bản)
  const handleSave = async (formData: Partial<Lesson>) => {
    try {
      if (editItem && editItem._id) {
        await lessonService.updateBasic(editItem._id, formData);
        toast.success("Cập nhật bài học thành công!");
      } else {
        await lessonService.create({
          ...formData,
          status: formData.status || "draft",
          planned_completion_time: formData.planned_completion_time || 0,
          weight: formData.weight || 0.1,
        });
        toast.success("Tạo bài học mới thành công!");
      }
      setOpenModal(false);
      fetchLessons();
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu bài học!");
    }
  };

  // 🗑️ Xóa
  const handleDelete = (item: Lesson, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteItem(item);
  };

  const confirmDelete = async () => {
    if (!deleteItem?._id) return;
    try {
      await lessonService.delete(deleteItem._id);
      toast.success("Đã xóa bài học!");
      setDeleteItem(null);
      fetchLessons();
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  // 📖 Xem chi tiết
  const handleRowClick = (item: Lesson) =>
    navigate(`/ctv/grammar/${item._id}`, { state: { grammar: item } });

  return (
    <Box
      sx={{ p: 3, width: "100%", bgcolor: theme.palette.background.default }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Lý thuyết & Ngữ pháp
      </Typography>

      {/* 🔍 Thanh tìm kiếm + lọc + tạo mới */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between" // 👈 Chia trái-phải
        mb={2}
      >
        {/* Nhóm bên trái: Tìm kiếm + Lọc */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm ngữ pháp..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              bgcolor: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: 1,
              width: "35%",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Lọc Part */}
          <Select
            size="small"
            displayEmpty
            value={partType}
            onChange={(e) =>
              setPartType(e.target.value ? Number(e.target.value) : "")
            }
            sx={{ width: 120 }}
          >
            <MenuItem value="">Tất cả Part</MenuItem>
            {[1, 2, 3, 4, 5, 6, 7].map((p) => (
              <MenuItem key={p} value={p}>
                Part {p}
              </MenuItem>
            ))}
          </Select>

          {/* Lọc trạng thái */}
          <Select
            size="small"
            displayEmpty
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ width: 140 }}
          >
            <MenuItem value="">Tất cả trạng thái</MenuItem>
            <MenuItem value="draft">Nháp</MenuItem>
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="rejected">Từ chối</MenuItem>
          </Select>
        </Stack>

        {/* Nhóm bên phải: Nút tạo mới */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{ minWidth: 120 }}
          >
            Tạo mới
          </Button>
        </motion.div>
      </Stack>

      {/* 📋 Danh sách bài học */}
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : lessons.length === 0 ? (
          <Typography align="center" color="text.secondary" py={3}>
            Không có bài học nào.
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Part</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lessons.map((item, index) => (
                    <TableRow
                      key={item._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>Part {item.part_type}</TableCell>
                      <TableCell>{renderStatusLabel(item.status)}</TableCell>

                      <TableCell>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              "vi-VN"
                            )
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Sửa cơ bản">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => handleEdit(item, e)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => handleDelete(item, e)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 🔢 Phân trang */}
            <Stack alignItems="center" mt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          </>
        )}
      </Paper>

      {/* ✏️ Modal Thêm / Sửa */}
      <GrammarModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        initialData={
          editItem
            ? {
                title: editItem.title,
                summary: editItem.summary,
                part_type: editItem.part_type,
                status: editItem.status,
                planned_completion_time: editItem.planned_completion_time || 0,
                weight: editItem.weight || 0.1,
              }
            : undefined
        }
      />

      {/* ❌ Modal Xác nhận xóa */}
      <ConfirmDeleteModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemTitle={deleteItem?.title}
      />
    </Box>
  );
}
