import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Divider,
  Chip,
  LinearProgress,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  WorkspacePremium,
  School,
  EmojiEvents,
  Cancel,
  DoneAll,
  Person,
  Block,
} from "@mui/icons-material";
import { useState } from "react";
import { UserDetail } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  user: UserDetail | null;
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
}

export default function CollaboratorDetailDrawer({
  open,
  onClose,
  user,
  loading,
  onApprove,
  onReject,
}: Props) {
  const theme = useTheme();
  const [rejectDialog, setRejectDialog] = useState(false);
  const [reason, setReason] = useState("");

  const handleConfirmReject = () => {
    if (user) onReject(user.id, reason);
    setRejectDialog(false);
    setReason("");
  };

  const handleCancelReject = () => {
    setRejectDialog(false);
    setReason("");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          p: 3,
          borderRadius: "16px 0 0 16px",
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      {loading ? (
        <Typography textAlign="center" mt={10}>
          ⏳ Đang tải dữ liệu...
        </Typography>
      ) : user ? (
        <Box>
          {/* 👤 Thông tin cơ bản */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={user.profile?.avatar}
              sx={{
                width: 72,
                height: 72,
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: 2,
              }}
            />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {user.profile?.fullname}
              </Typography>
              <Typography color="text.secondary" fontSize="0.9rem">
                {user.email}
              </Typography>
              <Chip
                icon={<Person />}
                label="Cộng tác viên"
                color="info"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* 🏅 Thành tựu */}
          <Typography fontWeight={700} mb={1}>
            <EmojiEvents sx={{ mr: 1, color: "gold" }} />
            Thành tựu đạt được
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {user.badges?.length ? (
              user.badges.map((b, i) => (
                <Chip
                  key={i}
                  label={b.title}
                  color="secondary"
                  variant="filled"
                  icon={<WorkspacePremium />}
                />
              ))
            ) : (
              <Typography color="text.secondary" fontSize="0.9rem">
                Chưa có thành tựu nào
              </Typography>
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* 📊 Độ thành thạo */}
          <Typography fontWeight={700} mb={1}>
            <School sx={{ mr: 1, color: theme.palette.primary.main }} />
            Độ thành thạo từng Part
          </Typography>
          {user.master_parts?.length ? (
            user.master_parts.map((p, i) => (
              <Box key={i} mb={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontSize="0.9rem">{p.part_name}</Typography>
                  <Typography fontSize="0.9rem" fontWeight={600}>
                    {p.accuracy}%
                  </Typography>
                </Stack>
                <LinearProgress
                  value={p.accuracy}
                  variant="determinate"
                  sx={{
                    height: 6,
                    borderRadius: 2,
                    backgroundColor: theme.palette.action.hover,
                  }}
                />
              </Box>
            ))
          ) : (
            <Typography color="text.secondary" fontSize="0.9rem">
              Chưa có dữ liệu đánh giá
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* 📚 Chủ đề từ vựng */}
          <Typography fontWeight={700} mb={1}>
            <School sx={{ mr: 1, color: "#0284C7" }} />
            Từ vựng chuyên sâu
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {user.topic_vocabularies?.length ? (
              user.topic_vocabularies.map((t, i) => (
                <Chip key={i} label={t.title} color="info" size="small" />
              ))
            ) : (
              <Typography color="text.secondary" fontSize="0.9rem">
                Chưa có chủ đề nổi bật
              </Typography>
            )}
          </Stack>

          {/* ⚙️ Hành động */}
          <Divider sx={{ my: 2 }} />
          {user.status === "pending" ? (
            <Stack direction="row" spacing={2} mt={2}>
              <Tooltip title="Chấp thuận cộng tác viên">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DoneAll />}
                  fullWidth
                  onClick={() => onApprove(user.id)}
                >
                  Duyệt
                </Button>
              </Tooltip>

              <Tooltip title="Từ chối yêu cầu và nhập lý do">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Block />}
                  fullWidth
                  onClick={() => setRejectDialog(true)}
                >
                  Từ chối
                </Button>
              </Tooltip>
            </Stack>
          ) : (
            <Box mt={3}>
              <Chip
                label={
                  user.status === "approved"
                    ? "✅ Đã duyệt"
                    : user.status === "rejected"
                    ? "❌ Đã từ chối"
                    : "—"
                }
                color={user.status === "approved" ? "success" : "error"}
                sx={{ width: "100%", fontSize: "1rem", py: 2 }}
              />
            </Box>
          )}
        </Box>
      ) : (
        <Typography color="text.secondary" textAlign="center" mt={10}>
          Chưa chọn người dùng nào
        </Typography>
      )}

      {/* 🧾 Modal nhập lý do từ chối */}
      <Dialog open={rejectDialog} onClose={handleCancelReject} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Cancel sx={{ mr: 1, color: "error.main" }} />
          Từ chối yêu cầu cộng tác viên
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={1.5}>
            Nhập lý do từ chối cộng tác viên{" "}
            <strong>{user?.profile?.fullname}</strong>:
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Ví dụ: Chưa đáp ứng tiêu chí kinh nghiệm hoặc hồ sơ thiếu thông tin..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReject} startIcon={<Cancel />}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Block />}
            onClick={handleConfirmReject}
            disabled={!reason.trim()}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
