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
} from "@mui/material";
import { Add, Search, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import fullTestService from "../../../../services/fullTest.service";
import { FullTest, TestStatus } from "../../../../types/fullTest";

// Map trạng thái BE → tiếng Việt
const mapStatus = (status: string) => {
  switch (status.toLowerCase()) {
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

const FullTestPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tests, setTests] = useState<FullTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [meta, setMeta] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fullTestService.getAll(1, 10);
        setTests(res.data);
        setMeta(res.meta);
      } catch (err) {
        console.error("Lỗi load tests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateNew = () => {
    navigate("/ctv/full-tests/create");
  };

  const handleEdit = (id: string) => {
    navigate(`/ctv/full-tests/${id}/edit`);
  };

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "";
    return new Date(isoDate).toLocaleDateString("vi-VN");
  };

  const renderSkeletonRows = () =>
    Array.from(new Array(5)).map((_, idx) => (
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

  return (
    <Box sx={{ p: 3, width: "100%", height: "100%", bgcolor: theme.palette.background.default }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Đề thi lớn (Full test)
      </Typography>

      {/* Thanh công cụ */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm đề thi..."
          size="small"
          sx={{ bgcolor: theme.palette.background.paper, borderRadius: 1, boxShadow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleCreateNew}>
            Tạo mới
          </Button>
        </motion.div>
      </Box>

      {/* Bảng danh sách */}
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Chủ đề</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? renderSkeletonRows()
                : tests.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.topic || "—"}</TableCell>
                      <TableCell>{mapStatus(item.status)}</TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell>
                        <Tooltip title="Sửa">
                          <IconButton size="small" color="primary" onClick={() => handleEdit(item._id)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton size="small" color="secondary">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              {!loading && tests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Meta info (phân trang sau này) */}
      {meta && (
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Trang {meta.page}/{meta.totalPages} – Tổng cộng {meta.total} đề
        </Typography>
      )}
    </Box>
  );
};

export default FullTestPage;
