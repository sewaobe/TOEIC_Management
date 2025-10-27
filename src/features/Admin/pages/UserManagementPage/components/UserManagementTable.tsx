import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TablePagination,
} from "@mui/material";
import { motion } from "framer-motion";
import { User } from "../types";
import { statusColor } from "../viewmodel/useUserManagementViewModel";

interface Props {
  users: User[];
  page: number;
  rowsPerPage: number;
  total: number;
  onChangePage: (newPage: number) => void;
  onChangeRows: (rows: number) => void;
  onSelectUser: (user: User) => void;
}

const roleColor = {
  admin: "error",
  collaborator: "info",
  student: "success",
} as const;

const roleLabel = {
  admin: "Quản trị viên",
  collaborator: "Cộng tác viên",
  student: "Học viên",
} as const;

export default function UserManagementTable({
  users,
  page,
  rowsPerPage,
  total,
  onChangePage,
  onChangeRows,
  onSelectUser,
}: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell>#</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u, i) => (
                <TableRow
                  key={u.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "0.2s",
                  }}
                  onClick={() => onSelectUser(u)}
                >
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  <TableCell>
                    <Avatar src={u.avatar} sx={{ width: 36, height: 36 }} />
                  </TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={roleLabel[u.role_id.name]}
                      color={roleColor[u.role_id.name]}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
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
          count={total}
          page={page}
          onPageChange={(_, newPage) => onChangePage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => onChangeRows(parseInt(e.target.value, 10))}
          labelRowsPerPage="Số dòng mỗi trang:"
          sx={{ borderTop: "1px solid #e0e0e0" }}
        />
      </Paper>
    </motion.div>
  );
}
