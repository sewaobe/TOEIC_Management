import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import UserManagementTable from "./components/UserManagementTable";
import UserDetailDrawer from "./components/UserDetailDrawer";
import { useUserManagementViewModel } from "./viewmodel/useUserManagementViewModel";
import { User } from "./types";
import { users } from "./mockUsers";

// 🧩 MUI Icons
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SearchIcon from "@mui/icons-material/Search";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function UserManagementPage() {
  const vm = useUserManagementViewModel(users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        transition: "all 0.3s ease",
        background: isLight
          ? "linear-gradient(135deg, #EFF6FF 0%, #E0F2FE 100%)"
          : "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <ManageAccountsIcon
            sx={{
              fontSize: 36,
              color: isLight ? theme.palette.primary.main : "#60A5FA",
            }}
          />
          <Typography variant="h4" fontWeight={800}>
            Quản lý tài khoản người dùng
          </Typography>
        </Stack>

        {/* Nút refresh */}
        <IconButton
          onClick={() => window.location.reload()}
          sx={{
            color: isLight ? theme.palette.text.primary : "#E2E8F0",
            bgcolor: isLight ? "#E0F2FE" : "#334155",
            "&:hover": { bgcolor: isLight ? "#BFDBFE" : "#475569" },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* Bộ lọc */}
      <Paper
        sx={{
          p: 2.5,
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <TextField
          label="Tìm kiếm (tên hoặc email)"
          value={vm.search}
          onChange={(e) => vm.setSearch(e.target.value)}
          sx={{ width: "40%" }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
          }}
        />

        <TextField
          label="Vai trò"
          select
          value={vm.role}
          onChange={(e) => vm.setRole(e.target.value)}
          sx={{ width: 180 }}
          InputProps={{
            startAdornment: (
              <PersonSearchIcon sx={{ mr: 1, color: "action.active" }} />
            ),
          }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="admin">Quản trị viên</MenuItem>
          <MenuItem value="collaborator">Cộng tác viên</MenuItem>
          <MenuItem value="student">Học viên</MenuItem>
        </TextField>

        <TextField
          label="Trạng thái"
          select
          value={vm.status}
          onChange={(e) => vm.setStatus(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="active">Hoạt động</MenuItem>
          <MenuItem value="inactive">Ngưng hoạt động</MenuItem>
          <MenuItem value="suspended">Tạm khóa</MenuItem>
        </TextField>
      </Paper>

      {/* Bảng người dùng */}
      <UserManagementTable
        users={vm.paginated}
        page={vm.page}
        rowsPerPage={vm.rowsPerPage}
        total={vm.filtered.length}
        onChangePage={vm.setPage}
        onChangeRows={vm.setRowsPerPage}
        onSelectUser={(u) => {
          setSelectedUser(u);
          setDrawerOpen(true);
        }}
      />

      {/* Drawer chi tiết */}
      <UserDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
      />
    </Box>
  );
}
