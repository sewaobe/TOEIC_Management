import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { toast } from "sonner";
import { User } from "../types";
import { statusColor } from "../viewmodel/useUserManagementViewModel";
import {
  Gavel,
  Block,
  LockClock,
  Cancel,
  VerifiedUser,
  EmojiEvents,
  LibraryBooks,
  Assessment,
  DoneAll,
} from "@mui/icons-material";

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

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export default function UserDetailDrawer({ open, onClose, user }: Props) {
  const theme = useTheme();
  const [banType, setBanType] = useState<"temp" | "perm" | null>(null);
  const [reason, setReason] = useState("");

  if (!user) return null;

  const isAdmin = user.role_id.name === "admin";

  const handleSubmitBan = () => {
    // 🔧 Giả lập gọi API
    const action =
      banType === "temp" ? "Tạm khóa người dùng" : "Ban vĩnh viễn người dùng";

    console.log(`🛑 ${action}:`, user.email, "Lý do:", reason);

    toast.success(`${action} "${user.name}" thành công!`, {
      description: `Lý do: ${reason}`,
      duration: 4000,
      icon: banType === "temp" ? <LockClock /> : <Block />,
    });

    setBanType(null);
    setReason("");
  };

  const handleCloseDialog = () => {
    setBanType(null);
    setReason(""); // 🧹 Reset lý do mỗi khi đóng modal
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 480, p: 3, background: theme.palette.background.default }}>
          {/* Header */}
          <Stack alignItems="center" spacing={1} mb={2}>
            <Avatar
              src={user.avatar}
              sx={{
                width: 90,
                height: 90,
                boxShadow: 3,
                border: "3px solid",
                borderColor: theme.palette.primary.light,
              }}
            />
            <Typography variant="h6" fontWeight={700}>
              {user.name}
            </Typography>
            <Typography color="text.secondary">{user.email}</Typography>

            <Chip
              label={roleLabel[user.role_id.name]}
              color={roleColor[user.role_id.name]}
              variant="outlined"
              sx={{ fontWeight: 600 }}
              icon={<VerifiedUser />}
            />
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Thông tin cơ bản */}
          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 6 }}>
              <Typography fontWeight={600}>Tên hiển thị:</Typography>
              <Typography variant="body2">{user.name}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography fontWeight={600}>Username:</Typography>
              <Typography variant="body2">{user.username ?? "—"}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography fontWeight={600}>Trạng thái:</Typography>
              <Chip
                label={user.status}
                color={statusColor[user.status]}
                size="small"
                icon={
                  user.status === "active" ? (
                    <VerifiedUser />
                  ) : user.status === "inactive" ? (
                    <Cancel />
                  ) : (
                    <LockClock />
                  )
                }
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography fontWeight={600}>Ngày tạo:</Typography>
              <Typography variant="body2">
                {new Date(user.created_at).toLocaleDateString("vi-VN")}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography fontWeight={600}>Hoạt động gần nhất:</Typography>
              <Typography variant="body2">
                {user.last_active
                  ? new Date(user.last_active).toLocaleDateString("vi-VN")
                  : "Chưa có"}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Badges */}
          {user.badges && user.badges.length > 0 && (
            <>
              <Typography fontWeight={700} mb={1}>
                <EmojiEvents sx={{ mr: 1, color: "gold" }} />
                Huy hiệu đạt được
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                {user.badges.map((b: string, i: number) => (
                  <Chip key={i} label={b} color="secondary" size="small" />
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          {/* Chủ đề đã học */}
          {user.topic_vocabularies && user.topic_vocabularies.length > 0 && (
            <>
              <Typography fontWeight={700} mb={1}>
                <LibraryBooks sx={{ mr: 1, color: "cornflowerblue" }} />
                Chủ đề đã học
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                {user.topic_vocabularies.map((t: string, i: number) => (
                  <Chip key={i} label={t} color="info" size="small" />
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          {/* TOEIC parts */}
          <Typography fontWeight={700} mb={1}>
            <Assessment sx={{ mr: 1, color: "mediumseagreen" }} />
            Độ chính xác theo phần TOEIC
          </Typography>
          <Stack spacing={1}>
            {Array.from({ length: 7 }).map((_, i) => {
              const part = user.master_parts[i] || { part_name: `Part ${i + 1}`, accuracy: 0 };
              return (
                <Box key={i}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{part.part_name}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {part.accuracy}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={part.accuracy}
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      backgroundColor: theme.palette.action.hover,
                      "& .MuiLinearProgress-bar": { borderRadius: 1 },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>

          {/* Hành động */}
          {!isAdmin && (
            <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
              <Tooltip title="Tạm khóa tài khoản (có thể mở lại sau)">
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<LockClock />}
                  onClick={() => setBanType("temp")}
                >
                  Tạm khóa
                </Button>
              </Tooltip>
              <Tooltip title="Ban vĩnh viễn người dùng này">
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Gavel />}
                  onClick={() => setBanType("perm")}
                >
                  Ban vĩnh viễn
                </Button>
              </Tooltip>
            </Stack>
          )}

          {isAdmin && (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 3 }}
            >
              🔒 Quản trị viên không thể bị khóa hoặc ban.
            </Typography>
          )}
        </Box>
      </Drawer>

      {/* Modal nhập lý do */}
      <Dialog open={!!banType} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          {banType === "temp" ? (
            <>
              <LockClock sx={{ mr: 1, color: "orange" }} />
              Tạm khóa tài khoản
            </>
          ) : (
            <>
              <Gavel sx={{ mr: 1, color: "red" }} />
              Ban vĩnh viễn người dùng
            </>
          )}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Nhập lý do {banType === "temp" ? "tạm khóa" : "ban"}{" "}
            <strong>{user.name}</strong>:
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Ví dụ: Vi phạm nội quy cộng đồng..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button startIcon={<Cancel />} onClick={handleCloseDialog}>
            Hủy
          </Button>
          <Button
            startIcon={<DoneAll />}
            onClick={handleSubmitBan}
            variant="contained"
            color={banType === "temp" ? "warning" : "error"}
            disabled={!reason.trim()}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
