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
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import adminLessonService from "./services/adminLesson.service";
import { STATUS_COLOR_MAP, TestStatusLabel } from "../../../../types/LessonManager";

interface LessonManager {
  _id: string;
  title: string;
  part_type?: string;
  level?: string;
  created_by?: any;
  created_at?: string;
  status?: string;
  thumbnail?: string;
}

const partOptions = [
  "Part 1",
  "Part 2",
  "Part 3",
  "Part 4",
  "Part 5",
  "Part 6",
  "Part 7",
];
const levelOptions = ["A1", "A2", "B1", "B2", "C1"];

export default function LessonApprovalPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [part, setPart] = useState("");
  const [level, setLevel] = useState("");
  const [creator, setCreator] = useState("");
  const [showPending, setShowPending] = useState(true);
  // server-side paging
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<LessonManager[]>([]);

  // pending table separate paging
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingRows, setPendingRows] = useState(5);
  const [pendingItems, setPendingItems] = useState<LessonManager[]>([]);
  const [pendingTotal, setPendingTotal] = useState<number | undefined>(
    undefined
  );

  // fetch list from server
  const fetchList = async (opts?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    try {
      const p = (opts?.page ?? page) + 1; // server 1-based
      const limit = opts?.limit ?? rowsPerPage;
      const res: any = await adminLessonService.list({
        page: p,
        limit,
        search: search || undefined,
        status: status || undefined,
        part: part || undefined,
        level: level || undefined,
      });
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      // ignore for now
      setItems([]);
      setTotal(0);
    }
  };

  const fetchPending = async (opts?: { page?: number; limit?: number }) => {
    try {
      const p = (opts?.page ?? pendingPage) + 1;
      const limit = opts?.limit ?? pendingRows;
      const res: any = await adminLessonService.list({
        page: p,
        limit,
        status: "pending",
      });
      setPendingItems(res.items || []);
    } catch {
      setPendingItems([]);
    }
  };

  useEffect(() => {
    // reset to first page when filters change
    setPage(0);
    fetchList({ page: 0, limit: rowsPerPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, part, level, rowsPerPage]);

  useEffect(() => {
    fetchPending({ page: pendingPage, limit: pendingRows });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, part, level, pendingPage, pendingRows]);

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
            <MenuItem value="draft">Bản nháp</MenuItem>
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="open">Đang mở</MenuItem>
            <MenuItem value="closed">Đã đóng / Từ chối</MenuItem>
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
            {Array.from(
              new Set(
                [
                  ...items.map(
                    (it) =>
                      (it.created_by &&
                        (it.created_by.displayName ||
                          it.created_by.username)) ||
                      ""
                  ),
                  ...pendingItems.map(
                    (it) =>
                      (it.created_by &&
                        (it.created_by.displayName ||
                          it.created_by.username)) ||
                      ""
                  ),
                ].filter(Boolean)
              )
            ).map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {!status && (
          <Tooltip
            title={showPending ? "Ẩn bảng cần duyệt" : "Hiện bảng cần duyệt"}
          >
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

      {!status && showPending && (
        <SectionTable
          title="Cần duyệt"
          items={pendingItems}
          page={pendingPage}
          rowsPerPage={pendingRows}
          total={pendingTotal}
          onPageChange={(p) => {
            setPendingPage(p);
            fetchPending({ page: p, limit: pendingRows });
          }}
          onRowsPerPageChange={(r) => {
            setPendingRows(r);
            setPendingPage(0);
            fetchPending({ page: 0, limit: r });
          }}
        />
      )}
      <SectionTable
        title="Tất cả bài học"
        items={items}
        page={page}
        rowsPerPage={rowsPerPage}
        total={total}
        onPageChange={(p) => {
          setPage(p);
          fetchList({ page: p, limit: rowsPerPage });
        }}
        onRowsPerPageChange={(r) => {
          setRowsPerPage(r);
          setPage(0);
          fetchList({ page: 0, limit: r });
        }}
      />
    </Box>
  );
}

function SectionTable({
  title,
  items,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}: {
  title: string;
  items: LessonManager[];
  page?: number;
  rowsPerPage?: number;
  total?: number;
  onPageChange?: (p: number) => void;
  onRowsPerPageChange?: (r: number) => void;
}) {
  const navigate = useNavigate();
  const [localPage, setLocalPage] = useState(0);
  const [localRowsPerPage, setLocalRowsPerPage] = useState(5);
  const serverMode = typeof total === "number";
  const paginated = serverMode
    ? items
    : items.slice(
      localPage * localRowsPerPage,
      localPage * localRowsPerPage + localRowsPerPage
    );

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
                  key={(l as any)._id || (l as any).id || i}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(
                      `/admin/lessons/${(l as any)._id || (l as any).id}`
                    )
                  } // ✅ chuyển sang trang chi tiết
                >
                  <TableCell>
                    {(page ?? localPage) * (rowsPerPage ?? localRowsPerPage) +
                      i +
                      1}
                  </TableCell>
                  <TableCell>{l.title}</TableCell>
                  <TableCell>{l.part_type || "-"}</TableCell>
                  <TableCell>{l.level || "-"}</TableCell>
                  <TableCell>
                    {(l.created_by &&
                      (l.created_by.displayName || l.created_by.username)) ||
                      "-"}
                  </TableCell>
                  <TableCell>
                    {l.created_at
                      ? new Date(l.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={l.status ? TestStatusLabel[l.status as keyof typeof TestStatusLabel] : "Unknown"}
                      color={STATUS_COLOR_MAP[l.status as keyof typeof STATUS_COLOR_MAP] || "default"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={serverMode ? total || 0 : items.length}
          page={serverMode ? page ?? 0 : localPage}
          onPageChange={(_, newPage) => {
            if (serverMode) {
              onPageChange && onPageChange(newPage);
            } else {
              setLocalPage(newPage);
            }
          }}
          rowsPerPage={
            serverMode ? rowsPerPage ?? localRowsPerPage : localRowsPerPage
          }
          onRowsPerPageChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (serverMode) {
              onRowsPerPageChange && onRowsPerPageChange(val);
            } else {
              setLocalRowsPerPage(val);
              setLocalPage(0);
            }
          }}
          labelRowsPerPage="Số dòng mỗi trang:"
          sx={{ borderTop: "1px solid #e0e0e0" }}
        />
      </Paper>
    </motion.div>
  );
}
