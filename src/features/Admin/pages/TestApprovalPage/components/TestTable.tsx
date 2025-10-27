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
  pending: { color: "warning", label: "Chờ duyệt" },
  approved: { color: "success", label: "Đã duyệt" },
  rejected: { color: "error", label: "Từ chối" },
} as const;

const typeConfig = {
  FULL_TEST: { color: "#2563EB", label: "Đề thi lớn" },
  MINI_TEST: { color: "#F59E0B", label: "Đề thi nhỏ" },
} as const;

interface Props {
  title: string;
  items: TestItem[];
  page: number;
  rowsPerPage: number;
  setPage: (p: number) => void;
  setRowsPerPage: (r: number) => void;
}

export default function TestTable({ title, items, page, rowsPerPage, setPage, setRowsPerPage }: Props) {
  const navigate = useNavigate();
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
