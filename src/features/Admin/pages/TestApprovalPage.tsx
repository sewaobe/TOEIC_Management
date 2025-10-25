import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Tooltip,
  TablePagination,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// 🔹 Loại & Trạng thái
type TestStatus = "pending" | "approved" | "rejected";
type TestType = "FULL_TEST" | "MINI_TEST";

interface TestItem {
  id: number;
  title: string;
  topic: string;
  type: TestType;
  creator: string;
  created_at: string;
  status: TestStatus;
  countComment: number;
  countSubmit: number;
}

// 🔹 Mock data
const tests: TestItem[] = [
  { id: 1, title: "Full Test 001", topic: "Office", type: "FULL_TEST", creator: "Trần Minh Quân", created_at: "2024-09-01", status: "pending", countComment: 2, countSubmit: 58 },
  { id: 2, title: "Mini Test 02", topic: "Travel", type: "MINI_TEST", creator: "Lê Thị Hà", created_at: "2024-09-05", status: "approved", countComment: 5, countSubmit: 102 },
  { id: 3, title: "Full Test 003", topic: "Meetings", type: "FULL_TEST", creator: "Phạm Thảo My", created_at: "2024-09-12", status: "pending", countComment: 1, countSubmit: 34 },
  { id: 4, title: "Mini Test 04", topic: "Shopping", type: "MINI_TEST", creator: "Nguyễn Văn An", created_at: "2024-09-15", status: "rejected", countComment: 3, countSubmit: 12 },
];

const statusConfig = {
  pending: { color: "warning", label: "Chờ duyệt" },
  approved: { color: "success", label: "Đã duyệt" },
  rejected: { color: "error", label: "Từ chối" },
} as const;

const typeConfig = {
  FULL_TEST: { color: "#2563EB", label: "Đề thi lớn" },
  MINI_TEST: { color: "#F59E0B", label: "Đề thi nhỏ" },
} as const;

export default function TestApprovalPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [creator, setCreator] = useState("");
  const [topic, setTopic] = useState("");
  const [showPending, setShowPending] = useState(true);

  // 🔍 Lấy danh sách người tạo & chủ đề (unique)
  const creatorOptions = Array.from(new Set(tests.map((t) => t.creator)));
  const topicOptions = Array.from(new Set(tests.map((t) => t.topic)));

  // ✅ Bộ lọc tổng hợp
  const filtered = tests.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (status ? t.status === status : true) &&
      (type ? t.type === type : true) &&
      (creator ? t.creator === creator : true) &&
      (topic ? t.topic === topic : true)
  );

  const pendingList = tests.filter(
    (t) =>
      t.status === "pending" &&
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (type ? t.type === type : true) &&
      (creator ? t.creator === creator : true) &&
      (topic ? t.topic === topic : true)
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Duyệt đề thi
      </Typography>

      {/* Toolbar */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap" }}>
          <TextField
            label="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "40%" }}
          />

          <TextField
            label="Trạng thái"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="rejected">Từ chối</MenuItem>
          </TextField>

          <TextField
            label="Loại đề"
            select
            value={type}
            onChange={(e) => setType(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="FULL_TEST">Đề thi lớn</MenuItem>
            <MenuItem value="MINI_TEST">Đề thi nhỏ</MenuItem>
          </TextField>

          <TextField
            label="Chủ đề"
            select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {topicOptions.map((tp) => (
              <MenuItem key={tp} value={tp}>
                {tp}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Người tạo"
            select
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            sx={{ width: 180 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {creatorOptions.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {!status && (
          <Tooltip title={showPending ? "Ẩn bảng cần duyệt" : "Hiện bảng cần duyệt"}>
            <IconButton
              onClick={() => setShowPending((prev) => !prev)}
              sx={{
                bgcolor: "action.hover",
                "&:hover": { bgcolor: "primary.main", color: "white" },
              }}
            >
              {showPending ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Tooltip>
        )}
      </Paper>

      {/* Bảng */}
      {!status && showPending && <SectionTable title="Cần duyệt" items={pendingList} />}
      <SectionTable title="Tất cả đề thi" items={filtered} />
    </Box>
  );
}

// ==========================
// 🔧 Sub-component hiển thị bảng
// ==========================
function SectionTable({ title, items }: { title: string; items: TestItem[] }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const paginated = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: 32 }}
    >
      <Typography fontWeight={600} mb={1}>
        {title}
      </Typography>
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell>#</TableCell>
                <TableCell>Tên đề</TableCell>
                <TableCell>Chủ đề</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Bình luận</TableCell>
                <TableCell>Lượt nộp</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((t, i) => (
                <TableRow key={t.id} hover>
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.topic}</TableCell>
                  <TableCell>
                    <Chip
                      label={typeConfig[t.type].label}
                      sx={{
                        bgcolor: `${typeConfig[t.type].color}15`,
                        color: typeConfig[t.type].color,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{t.creator}</TableCell>
                  <TableCell>{t.created_at}</TableCell>
                  <TableCell>{t.countComment}</TableCell>
                  <TableCell>{t.countSubmit}</TableCell>
                  <TableCell>
                    <Tooltip title={statusConfig[t.status].label}>
                      <Chip label={statusConfig[t.status].label} color={statusConfig[t.status].color} />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={items.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số dòng mỗi trang:"
          sx={{ borderTop: "1px solid #e0e0e0" }}
        />
      </Paper>
    </motion.div>
  );
}
