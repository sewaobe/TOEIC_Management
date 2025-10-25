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
  Avatar,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

type UserStatus = "active" | "inactive" | "suspended";
type UserRole = "Admin" | "Cộng tác viên" | "Học viên";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

const users: User[] = [
  { id: 1, name: "Nguyễn Văn A", email: "a.nguyen@example.com", role: "Admin", status: "active", created_at: "2024-05-10" },
  { id: 2, name: "Trần Thị B", email: "b.tran@example.com", role: "Cộng tác viên", status: "active", created_at: "2024-06-12" },
  { id: 3, name: "Phạm Văn C", email: "c.pham@example.com", role: "Cộng tác viên", status: "suspended", created_at: "2024-07-08" },
  { id: 4, name: "Lê Thị D", email: "d.le@example.com", role: "Học viên", status: "active", created_at: "2024-09-03" },
  { id: 5, name: "Hoàng Văn E", email: "e.hoang@example.com", role: "Học viên", status: "inactive", created_at: "2024-08-25" },
];

const statusColor = {
  active: "success",
  inactive: "default",
  suspended: "warning",
} as const;

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // 🔍 Bộ lọc thông minh — tìm theo tên hoặc email
  const filtered = users.filter(
    (u) =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (role ? u.role === role : true) &&
      (status ? u.status === status : true)
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Quản lý tài khoản
      </Typography>

      {/* Toolbar lọc */}
      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          label="Tìm kiếm (tên hoặc email)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "40%" }}
        />
        <TextField
          label="Vai trò"
          select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{ width: 160 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Cộng tác viên">Cộng tác viên</MenuItem>
          <MenuItem value="Học viên">Học viên</MenuItem>
        </TextField>
        <TextField
          label="Trạng thái"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ width: 160 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="active">Hoạt động</MenuItem>
          <MenuItem value="inactive">Ngưng hoạt động</MenuItem>
          <MenuItem value="suspended">Tạm khóa</MenuItem>
        </TextField>
      </Paper>

      {/* Bảng hiển thị */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell>#</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((u, i) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>{u.name.charAt(0)}</Avatar>
                        {u.name}
                      </Box>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.created_at}</TableCell>
                    <TableCell>
                      <Chip label={u.status} color={statusColor[u.status]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filtered.length}
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
    </Box>
  );
}
