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
import { Edit, Delete, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import miniTestService from "./services/miniTest.service";
import { useFetchList } from "../../../../hooks/useFetchList";

// ✅ Khai báo kiểu tham số cho API mini test
interface MiniTestParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export default function MiniTestListPage() {
  const navigate = useNavigate();

  // ✅ Dùng custom hook quản lý fetch / CRUD
  const {
    items: tests,
    total,
    isLoading,
    refresh,
    deleteItem,
  } = useFetchList<any, MiniTestParams>({
    fetchFn: async (params) => {
      const res = await miniTestService.getAll(params);
      return {
        items: res.items || [],
        total: res.total || 0,
        pageCount: Math.ceil((res.total || 0) / (params?.limit || 10)),
      };
    },
    deleteFn: async (id) => {
      await miniTestService.delete(id);
    },
  });

  // 🔍 Bộ lọc + phân trang
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  // ⏳ Debounce input tìm kiếm
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);

  // 🔁 Gọi API lại khi filter / page đổi
  useEffect(() => {
    refresh({
      page: page + 1,
      limit,
      search: debouncedSearch,
      status,
    });
  }, [page, limit, debouncedSearch, status]);

  // 🗑️ Xóa Mini Test
  const handleDelete = (id: string) => {
    if (!confirm("Xác nhận xóa mini test này?")) return;
    deleteItem(id, {
      page: page + 1,
      limit,
      search: debouncedSearch,
      status,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 🔹 Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4" fontWeight={700}>
          Danh sách Mini Test
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/ctv/minitests/create")}
        >
          + Tạo Mini Test
        </Button>
      </Box>

      {/* 🔍 Bộ lọc */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="Tìm kiếm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <Search fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
              ),
            }}
          />

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
        {isLoading ? (
          <Typography p={2}>Đang tải...</Typography>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Chủ đề</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Lượt nộp</TableCell>
                  <TableCell>Bình luận</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  tests.map((t) => (
                    <TableRow
                      key={t.id || t._id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#f5f9ff" },
                      }}
                      onClick={() =>
                        navigate(`/ctv/minitests/${t.id || t._id}/detail`)
                      }
                    >
                      <TableCell>{t.title}</TableCell>
                      <TableCell>{t.topic || "—"}</TableCell>
                      <TableCell>
                        <Chip
                          label={t.status}
                          size="small"
                          sx={{
                            bgcolor:
                              t.status === "published"
                                ? "#E8F5E9"
                                : "#FFF3E0",
                            color:
                              t.status === "published"
                                ? "#2E7D32"
                                : "#F57C00",
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>{t.countSubmit ?? 0}</TableCell>
                      <TableCell>{t.countComment ?? 0}</TableCell>
                      <TableCell
                        align="right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate(`/ctv/minitests/edit/${t.id || t._id}`)
                            }
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(t.id || t._id)}
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
    </Box>
  );
}
