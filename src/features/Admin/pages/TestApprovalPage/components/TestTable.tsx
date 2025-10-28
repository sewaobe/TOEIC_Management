// src/features/Admin/pages/TestApprovalPage/components/TestTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TestItem } from "../mock/mockTests";

const statusConfig = {
  draft: { color: "default", label: "Bản nháp" },
  pending: { color: "warning", label: "Chờ duyệt" },
  approved: { color: "success", label: "Đã duyệt" },
  open: { color: "primary", label: "Đang mở" },
  closed: { color: "error", label: "Đã đóng / Từ chối" },
} as const;

const typeConfig = {
  "full-test": { color: "#2563EB", label: "Đề thi lớn" },
  "mini-test": { color: "#F59E0B", label: "Đề thi nhỏ" },
  "part-test": { color: "#7C3AED", label: "Đề theo phần" },
} as const;

interface Props {
  title: string;
  items: TestItem[];
  page: number;
  rowsPerPage: number;
  setPage: (p: number) => void;
  setRowsPerPage: (r: number) => void;
  count?: number; // total count from server
}

export default function TestTable({
  title,
  items,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  count,
}: Props) {
  const navigate = useNavigate();
  // If `count` is provided we assume server-side paging (items already correspond to the page)
  const paginated =
    typeof count === "number"
      ? items
      : items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                <TableRow
                  key={t.id}
                  hover
                  onClick={() => navigate(`/admin/tests/${t.id}`)} // ✅ Đường dẫn chuẩn
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.topic}</TableCell>
                  <TableCell>
                    {(() => {
                      const tc = (typeConfig as any)[t.type] || {
                        label: String(t.type || ""),
                        color: "#6b7280",
                      };
                      const isHex =
                        typeof tc.color === "string" &&
                        tc.color.startsWith("#");
                      return (
                        <Chip
                          label={tc.label}
                          sx={{
                            bgcolor: isHex ? `${tc.color}15` : undefined,
                            color: tc.color,
                            fontWeight: 600,
                          }}
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell>{t.creator}</TableCell>
                  <TableCell>{t.created_at}</TableCell>
                  <TableCell>{t.countComment}</TableCell>
                  <TableCell>{t.countSubmit}</TableCell>
                  <TableCell>
                    {(() => {
                      const sc = (statusConfig as any)[t.status] || {
                        label: t.status,
                        color: "default",
                      };
                      return (
                        <Tooltip title={sc.label}>
                          <Chip label={sc.label} color={sc.color as any} />
                        </Tooltip>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={typeof count === "number" ? count : items.length}
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
