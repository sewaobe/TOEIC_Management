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
import { useNavigate } from "react-router-dom";

type LessonStatus = "pending" | "approved" | "rejected";

interface LessonManager {
  id: number;
  title: string;
  part: string;
  level: string;
  creator: string;
  created_at: string;
  status: LessonStatus;
}

const lessons: LessonManager[] = [
  { id: 1, title: "Unit 3 - Office Communication", part: "Part 3", level: "B1", creator: "Trần Minh Quân", created_at: "2024-09-01", status: "pending" },
  { id: 2, title: "Unit 5 - Grammar Focus", part: "Part 5", level: "B1", creator: "Lê Thị Hà", created_at: "2024-09-08", status: "approved" },
  { id: 3, title: "Unit 7 - Reading Intensive", part: "Part 7", level: "B2", creator: "Phạm Thảo My", created_at: "2024-09-15", status: "pending" },
  { id: 4, title: "Unit 9 - Listening Practice", part: "Part 4", level: "A2", creator: "Nguyễn Minh Anh", created_at: "2024-09-22", status: "rejected" },
];

const statusConfig = {
  pending: { color: "warning", label: "Chờ duyệt" },
  approved: { color: "success", label: "Đã duyệt" },
  rejected: { color: "error", label: "Từ chối" },
} as const;

const partOptions = ["Part 1", "Part 2", "Part 3", "Part 4", "Part 5", "Part 6", "Part 7"];
const levelOptions = ["A1", "A2", "B1", "B2", "C1"];

export default function LessonApprovalPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [part, setPart] = useState("");
  const [level, setLevel] = useState("");
  const [creator, setCreator] = useState("");
  const [showPending, setShowPending] = useState(true);

  const filtered = lessons.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) &&
      (status ? l.status === status : true) &&
      (part ? l.part === part : true) &&
      (level ? l.level === level : true) &&
      (creator ? l.creator === creator : true)
  );

  const pendingList = lessons.filter(
    (l) =>
      l.status === "pending" &&
      l.title.toLowerCase().includes(search.toLowerCase()) &&
      (part ? l.part === part : true) &&
      (level ? l.level === level : true) &&
      (creator ? l.creator === creator : true)
  );

  const creatorOptions = Array.from(new Set(lessons.map((l) => l.creator)));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Duyệt bài học tổng hợp
      </Typography>

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
            label="Part"
            select
            value={part}
            onChange={(e) => setPart(e.target.value)}
            sx={{ width: 120 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {partOptions.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Trình độ"
            select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            sx={{ width: 120 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {levelOptions.map((lv) => (
              <MenuItem key={lv} value={lv}>
                {lv}
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

      {!status && showPending && <SectionTable title="Cần duyệt" items={pendingList} />}
      <SectionTable title="Tất cả bài học" items={filtered} />
    </Box>
  );
}

function SectionTable({
  title,
  items,
}: {
  title: string;
  items: LessonManager[];
}) {
  const navigate = useNavigate();
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
                <TableCell>Tên bài học</TableCell>
                <TableCell>Part</TableCell>
                <TableCell>Trình độ</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((l, i) => (
                <TableRow
                  key={l.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/lessons/${l.id}`)} // ✅ chuyển sang trang chi tiết
                >
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{l.title}</TableCell>
                  <TableCell>{l.part}</TableCell>
                  <TableCell>{l.level}</TableCell>
                  <TableCell>{l.creator}</TableCell>
                  <TableCell>{l.created_at}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusConfig[l.status].label}
                      color={statusConfig[l.status].color}
                    />
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
