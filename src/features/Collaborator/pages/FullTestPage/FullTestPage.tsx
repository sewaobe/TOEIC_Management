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
  Skeleton,
  useTheme,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Search, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFetchList } from "../../../../hooks/useFetchList";
import useDebounce from "../QuestionPage/useDebounce"; // ✅ dùng debounce có sẵn
import fullTestService from "../../../../services/fullTest.service";
import { FullTest, TestStatus } from "../../../../types/fullTest";

// ======================
// 🧭 Map trạng thái BE → tiếng Việt
// ======================
const mapStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case TestStatus.DRAFT:
      return "Bản nháp";
    case TestStatus.PENDING:
      return "Chờ duyệt";
    case TestStatus.APPROVED:
      return "Đã duyệt";
    case TestStatus.OPEN:
      return "Đang mở";
    case TestStatus.CLOSED:
      return "Đã đóng";
    default:
      return status;
  }
};

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: TestStatus.DRAFT, label: "Bản nháp" },
  { value: TestStatus.PENDING, label: "Chờ duyệt" },
  { value: TestStatus.APPROVED, label: "Đã duyệt" },
  { value: TestStatus.OPEN, label: "Đang mở" },
  { value: TestStatus.CLOSED, label: "Đã đóng" },
];

// ======================
// 📄 Component chính
// ======================
const FullTestPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");

  // ✅ Debounce để tránh reload nhiều lần
  const debouncedSearch = useDebounce(search, 400);
  const debouncedStatus = useDebounce(statusFilter, 400);
  const debouncedTopic = useDebounce(topicFilter, 400);

  // ======================
  // 🔁 Dùng hook useFetchList
  // ======================
  const {
    items: tests,
    total,
    isLoading,
    deleteItem,
    refresh,
  } = useFetchList<
    FullTest,
    {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      topic?: string;
    }
  >({
    fetchFn: async (params) => {
      const res = await fullTestService.getAll({
        page: params?.page || page + 1,
        limit: params?.limit || rowsPerPage,
        search: debouncedSearch,
        status: debouncedStatus,
        topic: debouncedTopic,
      });
      return {
        items: res.items,
        pageCount: res.pageCount,
        total: res.total,
      };
    },
    deleteFn: async (id: string) => {
      await fullTestService.delete(id);
    },
  });

  // ✅ Chỉ reload 1 lần duy nhất khi page, limit, hoặc filter thay đổi (sau debounce)
  useEffect(() => {
    refresh({ page: page + 1, limit: rowsPerPage });
  }, [page, rowsPerPage, debouncedSearch, debouncedStatus, debouncedTopic]);

  // ======================
  // ✨ Handlers
  // ======================
  const handleCreateNew = () => navigate("/ctv/full-tests/create");
  const handleEdit = (id: string) => navigate(`/ctv/full-tests/${id}/edit`);
  const handleViewDetail = (id: string) =>
    navigate(`/ctv/full-tests/${id}/detail`);
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đề thi này?")) return;
    await deleteItem(id);
  };

  const formatDate = (isoDate: string) =>
    isoDate ? new Date(isoDate).toLocaleDateString("vi-VN") : "—";

  // ======================
  // ⏳ Skeleton Rows
  // ======================
  const renderSkeletonRows = () =>
    Array.from({ length: 5 }).map((_, idx) => (
      <TableRow key={idx}>
        <TableCell>
          <Skeleton variant="text" width={300} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={200} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={120} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={120} />
        </TableCell>
        <TableCell>
          <Skeleton variant="circular" width={32} height={32} />
        </TableCell>
      </TableRow>
    ));

  // ======================
  // 💅 Render
  // ======================
  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Đề thi lớn (Full test)
      </Typography>

      {/* Bộ lọc & thanh công cụ */}
      <Paper
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        {/* Ô tìm kiếm */}
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm đề thi..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: 220,
            bgcolor: theme.palette.background.paper,
            borderRadius: 1,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Lọc theo trạng thái */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
          >
            {statusOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Lọc theo chủ đề */}
        <TextField
          variant="outlined"
          placeholder="Chủ đề..."
          size="small"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          sx={{
            minWidth: 180,
            bgcolor: theme.palette.background.paper,
            borderRadius: 1,
          }}
        />

        {/* Nút tạo mới */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateNew}
          sx={{ ml: "auto" }}
        >
          Tạo mới
        </Button>
      </Paper>

      {/* Bảng danh sách */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          overflow: "hidden", // ✅ tránh bảng tràn layout
        }}
      >
        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto", // ✅ bảng cuộn ngang riêng
          }}
        >
          <Table
            sx={{
              width: "100%",
              tableLayout: "fixed", // ✅ cột chia đều, không đẩy layout
              minWidth: 500,
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Chủ đề</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              component={motion.tbody}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading
                ? renderSkeletonRows()
                : tests.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: theme.palette.action.hover },
                      }}
                      onClick={() => handleViewDetail(item.id)}
                    >
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.topic || "—"}</TableCell>
                      <TableCell>{mapStatus(item.status)}</TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Tooltip
                          title={
                            item.status === TestStatus.DRAFT
                              ? "Sửa"
                              : "Chỉ bản nháp mới sửa được"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              disabled={item.status !== TestStatus.DRAFT}
                              onClick={() => handleEdit(item.id)}
                            >
                              <Edit />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={
                            item.status === TestStatus.DRAFT
                              ? "Xóa"
                              : "Chỉ bản nháp mới xóa được"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="secondary"
                              disabled={item.status !== TestStatus.DRAFT}
                              onClick={() => handleDelete(item.id)}
                            >
                              <Delete />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              {!isLoading && tests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            const newLimit = parseInt(e.target.value, 10);
            setRowsPerPage(newLimit);
            setPage(0);
          }}
          labelRowsPerPage="Số dòng mỗi trang"
        />
      </Paper>
    </Box>
  );
};

export default FullTestPage;
