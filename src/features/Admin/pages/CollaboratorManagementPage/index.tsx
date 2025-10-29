import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { motion } from "framer-motion";
import CollaboratorTable from "./components/CollaboratorTable";
import CollaboratorDetailDrawer from "./components/CollaboratorDetailDrawer";
import { useCollaboratorViewModel } from "./viewmodel/useCollaboratorViewModel";

export default function CollaboratorManagementPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showPending, setShowPending] = useState(true);
  const vm = useCollaboratorViewModel();

  const filtered = vm.collaborators.filter(
    (c) =>
      (c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())) &&
      (status ? c.status === status : true)
  );

  const pendingList = vm.collaborators.filter(
    (c) =>
      c.status === "pending" &&
      (c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Duyệt yêu cầu cộng tác viên
      </Typography>

      {/* 🔍 Thanh lọc */}
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
            label="Tìm kiếm (tên hoặc gmail)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "40%" }}
          />
          <TextField
            label="Trạng thái"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ width: 160 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="rejected">Từ chối</MenuItem>
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

      {/* 🧾 Bảng hiển thị */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {!status && showPending && (
          <CollaboratorTable
            title="Cần duyệt"
            items={pendingList}
            total={vm.total}
            page={vm.page}
            rowsPerPage={vm.limit}
            onPageChange={vm.handleChangePage}
            onRowsPerPageChange={vm.handleChangeRowsPerPage}
            onSelect={vm.handleViewDetail}
          />
        )}
        <CollaboratorTable
          title="Tất cả cộng tác viên"
          items={vm.collaborators.filter((c) => c.status !== "pending")}
          total={vm.total}
          page={vm.page}
          rowsPerPage={vm.limit}
          onPageChange={vm.handleChangePage}
          onRowsPerPageChange={vm.handleChangeRowsPerPage}
          onSelect={vm.handleViewDetail}
        />
      </motion.div>

      {/* 🪟 Drawer xem chi tiết */}
      <CollaboratorDetailDrawer
        open={vm.openDrawer}
        onClose={vm.handleCloseDrawer}
        collaborator={vm.selectedUser}
        loading={vm.loading}
        onApprove={vm.handleApprove}
        onReject={vm.handleReject}
      />
    </Box>
  );
}
