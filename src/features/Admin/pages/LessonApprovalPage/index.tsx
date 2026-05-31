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
  Stack,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import adminLessonService from "./services/adminLesson.service";
import {
  LessonManager,
  LessonManagerNodeRole,
  LessonManagerUnitType,
  NodeRoleLabel,
  PartType,
  STATUS_COLOR_MAP,
  TestStatus,
  TestStatusLabel,
  UnitTypeLabel,
} from "../../../../types/LessonManager";

const partOptions: PartType[] = [1, 2, 3, 4, 5, 6, 7];
const unitTypeOptions: LessonManagerUnitType[] = [
  "foundation",
  "skill_drill",
  "mixed_practice",
  "exam_practice",
  "remedial",
];
const nodeRoleOptions: LessonManagerNodeRole[] = [
  "entry",
  "normal",
  "target",
  "support",
];
const statusOptions: TestStatus[] = [
  "draft",
  "pending",
  "approved",
  "open",
  "closed",
  "rejected",
];

const getCreatorName = (createdBy: any) => {
  if (!createdBy) return "-";
  if (typeof createdBy === "string") return createdBy;
  return createdBy.displayName || createdBy.username || createdBy.email || "-";
};

export default function LessonApprovalPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TestStatus | "">("");
  const [partType, setPartType] = useState<PartType | "">("");
  const [unitType, setUnitType] = useState<LessonManagerUnitType | "">("");
  const [nodeRole, setNodeRole] = useState<LessonManagerNodeRole | "">("");
  const [scoreFrom, setScoreFrom] = useState<number | "">("");
  const [scoreTo, setScoreTo] = useState<number | "">("");
  const [targetTag, setTargetTag] = useState("");
  const [showPending, setShowPending] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<LessonManager[]>([]);
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingRows, setPendingRows] = useState(5);
  const [pendingItems, setPendingItems] = useState<LessonManager[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);

  const commonParams = {
    search,
    part_type: partType,
    unit_type: unitType,
    node_role: nodeRole,
    score_from: scoreFrom,
    score_to: scoreTo,
    target_tag: targetTag,
  };

  const fetchList = async (opts?: { page?: number; limit?: number }) => {
    try {
      const res: any = await adminLessonService.list({
        ...commonParams,
        page: (opts?.page ?? page) + 1,
        limit: opts?.limit ?? rowsPerPage,
        status,
      });
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch {
      setItems([]);
      setTotal(0);
    }
  };

  const fetchPending = async (opts?: { page?: number; limit?: number }) => {
    try {
      const res: any = await adminLessonService.list({
        ...commonParams,
        page: (opts?.page ?? pendingPage) + 1,
        limit: opts?.limit ?? pendingRows,
        status: "pending",
      });
      setPendingItems(res.items || []);
      setPendingTotal(res.total || 0);
    } catch {
      setPendingItems([]);
      setPendingTotal(0);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchList({ page: 0, limit: rowsPerPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, partType, unitType, nodeRole, scoreFrom, scoreTo, targetTag, rowsPerPage]);

  useEffect(() => {
    setPendingPage(0);
    fetchPending({ page: 0, limit: pendingRows });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, partType, unitType, nodeRole, scoreFrom, scoreTo, targetTag, pendingRows]);

  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={1.5} mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Duyệt LessonManager
        </Typography>
        <Button variant="contained" onClick={() => navigate("/admin/lessons/graph")}>
          Xem graph
        </Button>
      </Stack>

      <Paper
        sx={{
          p: 2,
          mb: 2,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap", minWidth: 0 }}>
          <TextField
            label="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260, flex: "1 1 260px" }}
          />
          <TextField
            label="Trạng thái"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value as TestStatus | "")}
            sx={{ width: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {statusOptions.map((value) => (
              <MenuItem key={value} value={value}>
                {TestStatusLabel[value]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Part"
            select
            value={partType}
            onChange={(e) =>
              setPartType(e.target.value === "" ? "" : (Number(e.target.value) as PartType))
            }
            sx={{ width: 110 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {partOptions.map((value) => (
              <MenuItem key={value} value={value}>
                Part {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Unit type"
            select
            value={unitType}
            onChange={(e) => setUnitType(e.target.value as LessonManagerUnitType | "")}
            sx={{ width: 180 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {unitTypeOptions.map((value) => (
              <MenuItem key={value} value={value}>
                {UnitTypeLabel[value]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Node role"
            select
            value={nodeRole}
            onChange={(e) => setNodeRole(e.target.value as LessonManagerNodeRole | "")}
            sx={{ width: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {nodeRoleOptions.map((value) => (
              <MenuItem key={value} value={value}>
                {NodeRoleLabel[value]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Score từ"
            type="number"
            value={scoreFrom}
            onChange={(e) =>
              setScoreFrom(e.target.value === "" ? "" : Number(e.target.value))
            }
            sx={{ width: 120 }}
          />
          <TextField
            label="Score đến"
            type="number"
            value={scoreTo}
            onChange={(e) =>
              setScoreTo(e.target.value === "" ? "" : Number(e.target.value))
            }
            sx={{ width: 120 }}
          />
          <TextField
            label="Target tag"
            value={targetTag}
            onChange={(e) => setTargetTag(e.target.value)}
            sx={{ width: 170 }}
          />
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
          onPageChange={(nextPage) => {
            setPendingPage(nextPage);
            fetchPending({ page: nextPage, limit: pendingRows });
          }}
          onRowsPerPageChange={(nextRows) => {
            setPendingRows(nextRows);
            setPendingPage(0);
            fetchPending({ page: 0, limit: nextRows });
          }}
        />
      )}
      <SectionTable
        title="Tất cả bài học"
        items={items}
        page={page}
        rowsPerPage={rowsPerPage}
        total={total}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          fetchList({ page: nextPage, limit: rowsPerPage });
        }}
        onRowsPerPageChange={(nextRows) => {
          setRowsPerPage(nextRows);
          setPage(0);
          fetchList({ page: 0, limit: nextRows });
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
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (r: number) => void;
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        marginBottom: 32,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <Typography fontWeight={600} mb={1}>
        {title}
      </Typography>
      <Paper sx={{ borderRadius: 3, overflow: "hidden", width: "100%", maxWidth: "100%" }}>
        <TableContainer sx={{ overflowX: "auto", width: "100%", maxWidth: "100%" }}>
          <Table
            size="small"
            sx={{
              minWidth: 1180,
              tableLayout: "fixed",
              "& th, & td": {
                px: 1.25,
                whiteSpace: "nowrap",
                verticalAlign: "middle",
              },
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ width: 44 }}>#</TableCell>
                <TableCell sx={{ width: 220 }}>Tên bài học</TableCell>
                <TableCell sx={{ width: 52 }}>Part</TableCell>
                <TableCell sx={{ width: 90 }}>Score band</TableCell>
                <TableCell sx={{ width: 116 }}>Unit type</TableCell>
                <TableCell sx={{ width: 100 }}>Node role</TableCell>
                <TableCell sx={{ width: 150 }}>Target tags</TableCell>
                <TableCell sx={{ width: 104 }}>Trạng thái</TableCell>
                <TableCell sx={{ width: 120 }}>Người tạo</TableCell>
                <TableCell sx={{ width: 90 }}>Ngày tạo</TableCell>
                <TableCell sx={{ width: 82 }}>Thời gian</TableCell>
                <TableCell sx={{ width: 68 }}>Weight</TableCell>
                <TableCell align="right" sx={{ width: 64 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((lesson, index) => (
                <TableRow
                  key={lesson._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/lessons/${lesson._id}`)}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      noWrap
                      title={lesson.title}
                      sx={{ maxWidth: 200 }}
                    >
                      {lesson.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{lesson.part_type || "-"}</TableCell>
                  <TableCell>
                    {lesson.score_band
                      ? `${lesson.score_band.from}-${lesson.score_band.to}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {lesson.unit_type ? UnitTypeLabel[lesson.unit_type] : "-"}
                  </TableCell>
                  <TableCell>
                    {lesson.node_role ? NodeRoleLabel[lesson.node_role] : "-"}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" gap={0.5} sx={{ overflow: "hidden" }}>
                      {(lesson.target_tags || []).slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ maxWidth: 120 }}
                        />
                      ))}
                      {(lesson.target_tags || []).length > 3 && (
                        <Chip
                          label={`+${lesson.target_tags.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        lesson.status
                          ? TestStatusLabel[lesson.status as TestStatus]
                          : "Unknown"
                      }
                      color={
                        STATUS_COLOR_MAP[lesson.status as TestStatus] || "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      noWrap
                      title={getCreatorName(lesson.created_by)}
                    >
                      {getCreatorName(lesson.created_by)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {lesson.created_at
                      ? new Date(lesson.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{lesson.planned_completion_time ?? 0} phút</TableCell>
                  <TableCell>{Number(lesson.weight ?? 0).toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined">
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, nextPage) => onPageChange(nextPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            onRowsPerPageChange(parseInt(event.target.value, 10));
          }}
          labelRowsPerPage="Số dòng mỗi trang:"
          sx={{ borderTop: "1px solid #e0e0e0" }}
        />
      </Paper>
    </motion.div>
  );
}
