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
import { CollaboratorRequest, CollaboratorStatus } from "../types";

// 🔹 Cấu hình màu & nhãn cho trạng 
const statusConfig: Record<CollaboratorStatus, { color: "warning" | "success" | "error"; label: string }> = {
  pending: { color: "warning", label: "Chờ duyệt" },
  approved: { color: "success", label: "Đã duyệt" },
  rejected: { color: "error", label: "Từ chối" },
};
interface Props {
  title: string;
  items: CollaboratorRequest[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newLimit: number) => void;
  onSelect: (id: string) => void;
}


export default function CollaboratorTable({
  title,
  items,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSelect,
}: Props) {
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
              <TableCell>Ngày duyệt</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((c, i) => (
              <TableRow
                key={c._id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => onSelect(c._id)}
              >
                <TableCell>{(page - 1) * rowsPerPage + i + 1}</TableCell>
                <TableCell>{c.fullName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(c.updated_at).toLocaleDateString() || "—"}</TableCell>
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
        count={total}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        labelRowsPerPage="Số dòng mỗi trang:"
        sx={{ borderTop: "1px solid #e0e0e0" }}
      />
    </Paper>
  );
}
