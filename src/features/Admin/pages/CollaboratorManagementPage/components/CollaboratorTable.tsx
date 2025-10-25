import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Collaborator, CollaboratorStatus } from "../types";

// 🔹 Cấu hình màu & nhãn cho trạng thái
const statusConfig: Record<
  CollaboratorStatus,
  { color: "warning" | "success" | "error"; label: string }
> = {
  pending: { color: "warning", label: "Chờ duyệt" },
  approved: { color: "success", label: "Đã duyệt" },
  rejected: { color: "error", label: "Từ chối" },
};

interface Props {
  title: string;
  items: Collaborator[];
  onSelect: (id: string) => void;
}

export default function CollaboratorTable({ title, items, onSelect }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const paginated = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
      <Typography fontWeight={600} p={2}>
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "action.hover" }}>
              <TableCell>#</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ngày gửi yêu cầu</TableCell>
              <TableCell>Ngày tham gia</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((c, i) => (
              <TableRow
                key={c.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => onSelect(c.id)}
              >
                <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.requested_at}</TableCell>
                <TableCell>{c.joined_at || "—"}</TableCell>
                <TableCell>
                  <Chip
                    label={statusConfig[c.status].label}
                    color={statusConfig[c.status].color}
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
  );
}
