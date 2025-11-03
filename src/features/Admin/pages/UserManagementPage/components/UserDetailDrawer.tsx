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
import adminUserService from "../services/adminUser.service";
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
  // callback khi thực hiện hành động (ban/unban) thành công để FE refresh
  onActionComplete?: () => void;
}

export default function UserDetailDrawer({
  open,
  onClose,
  user,
  onActionComplete,
}: Props) {
  const theme = useTheme();
  const [banType, setBanType] = useState<"temp" | "perm" | null>(null);
  const [reason, setReason] = useState("");

  if (!user) return null;

  // Role có thể là string hoặc object tuỳ payload, tuỳ backend. Chuẩn hoá an toàn ở đây.
  const roleName =
    typeof user.role_id === "string" ? user.role_id : user.role_id?.name;
  const isAdmin = roleName === "admin";

  const statusLabel: Record<string, string> = {
    active: "Hoạt động",
    inactive: "Ngưng hoạt động",
    banned: "Bị khóa (tạm)",
    banned_permanent: "Bị ban vĩnh viễn",
  };

  const handleSubmitBan = async () => {
    if (!user || !banType) return;

    try {
      const payload = {
        type: banType,
        reason,
      } as any;

      // Gọi API ban
      await adminUserService.banUser(user.id, payload);

      const action = banType === "temp" ? "Tạm khóa" : "Ban vĩnh viễn";
      toast.success(`${action} "${user.name}" thành công!`, {
        description: `Lý do: ${reason}`,
        duration: 4000,
        icon: banType === "temp" ? <LockClock /> : <Block />,
      });

      // gọi callback để refresh danh sách ở parent
      if (onActionComplete) {
        onActionComplete();
      }

      setBanType(null);
      setReason("");
    } catch (err) {
      console.error("Ban user failed", err);
      toast.error("Không thể thực hiện hành động. Vui lòng thử lại.");
    }
  };

  const handleCloseDialog = () => {
    setBanType(null);
    setReason(""); // 🧹 Reset lý do mỗi khi đóng modal
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            width: 480,
            p: 3,
            background: theme.palette.background.default,
          }}
        >
          {/* Header */}
          <Stack alignItems="center" spacing={1} mb={2}>
            <Avatar
              // Avatar có thể undefined/object - chuyển thành string hoặc để trống
              src={typeof user.avatar === "string" ? user.avatar : undefined}
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
              // Hiển thị nhãn vai trò an toàn
              label={roleLabel[roleName as keyof typeof roleLabel] || "—"}
              color={roleColor[roleName as keyof typeof roleColor] || "default"}
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
                label={statusLabel[user.status] || user.status}
                color={statusColor[user.status] as any}
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

          {/* Nếu đang bị ban, hiển thị chi tiết ban */}
          {(user.status === "banned" || user.status === "banned_permanent") && (
            <Box mb={2}>
              <Typography fontWeight={600}>Tình trạng ban:</Typography>
              <Typography variant="body2" color="error">
                {user.status === "banned_permanent"
                  ? "Bị ban vĩnh viễn"
                  : "Bị khóa"}
              </Typography>
              {user.banned_reason && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Lý do:</strong> {user.banned_reason}
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
            </Box>
          )}

          {/* Badges */}
          {user.badges && user.badges.length > 0 && (
            <>
              <Typography fontWeight={700} mb={1}>
                <EmojiEvents sx={{ mr: 1, color: "gold" }} />
                Huy hiệu đạt được
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                {user.badges.map((b: any, i: number) => {
                  // badge có thể là string hoặc object -> hiển thị an toàn
                  const label =
                    typeof b === "string"
                      ? b
                      : b?.name || b?.title || b?._id || JSON.stringify(b);
                  return (
                    <Chip
                      key={i}
                      label={label}
                      color="secondary"
                      size="small"
                    />
                  );
                })}
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
                {user.topic_vocabularies.map((t: any, i: number) => {
                  const label =
                    typeof t === "string"
                      ? t
                      : t?.name || t?.title || t?._id || JSON.stringify(t);
                  return (
                    <Chip key={i} label={label} color="info" size="small" />
                  );
                })}
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
              const raw = user.master_parts && user.master_parts[i];
              const part = raw
                ? {
                    part_name:
                      raw.part_name || (raw as any).name || `Part ${i + 1}`,
                    accuracy:
                      typeof (raw as any).accuracy === "number"
                        ? (raw as any).accuracy
                        : 0,
                  }
                : { part_name: `Part ${i + 1}`, accuracy: 0 };
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
              {user.status === "banned" ? (
                <Tooltip title="Mở khóa tài khoản">
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<DoneAll />}
                    onClick={async () => {
                      try {
                        await adminUserService.unbanUser(user.id);
                        toast.success(`Đã mở khóa ${user.name}`);
                        if (onActionComplete) onActionComplete();
                      } catch (err) {
                        console.error("Unban failed", err);
                        toast.error("Không thể mở khóa. Vui lòng thử lại.");
                      }
                    }}
                  >
                    Mở khóa
                  </Button>
                </Tooltip>
              ) : user.status === "banned_permanent" ? (
                <Typography
                  variant="body2"
                  color="error"
                  align="center"
                  sx={{ mt: 1 }}
                >
                  🚫 Tài khoản đã bị ban vĩnh viễn, không thể mở khóa
                </Typography>
              ) : (
                <>
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
                </>
              )}
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
      <Dialog
        open={!!banType}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
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
