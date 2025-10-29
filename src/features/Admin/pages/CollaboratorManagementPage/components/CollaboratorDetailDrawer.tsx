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
  Link,
} from "@mui/material";
import {
  WorkspacePremium,
  School,
  EmojiEvents,
  Cancel,
  DoneAll,
  Person,
  Block,
  Description,
  AccessTime,
  WorkOutline,
  Translate,
  Psychology,
  Assignment,
} from "@mui/icons-material";
import { useState } from "react";
import { CollaboratorRequest } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  collaborator: CollaboratorRequest | null;
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export default function CollaboratorDetailDrawer({
  open,
  onClose,
  collaborator,
  loading,
  onApprove,
  onReject,
}: Props) {
  const theme = useTheme();
  const [rejectDialog, setRejectDialog] = useState(false);
  const [reason, setReason] = useState("");

  const handleConfirmReject = () => {
    if (collaborator) onReject(collaborator._id, reason);
    setRejectDialog(false);
    setReason("");
  };

  const handleCancelReject = () => {
    setRejectDialog(false);
    setReason("");
  };

  const availabilityLabel = {
    "part-time": "Bán thời gian (<20h/tuần)",
    "full-time": "Toàn thời gian (>20h/tuần)",
    flexible: "Linh hoạt",
  }[collaborator?.availability || "part-time"];

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
      ) : collaborator ? (
        <Box>
          {/* 👤 Thông tin cơ bản */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={collaborator.user_id?.profile?.avatar || ""}
              sx={{
                width: 72,
                height: 72,
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: 2,
              }}
            />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {collaborator.user_id?.profile?.fullname ||
                  collaborator.fullName}
              </Typography>
              <Typography color="text.secondary" fontSize="0.9rem">
                {collaborator.email}
              </Typography>
              <Chip
                icon={<Person />}
                label={collaborator.user_id ? "Học viên" : "Khách"}
                color={collaborator.user_id ? "info" : "default"}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* ====================== */}
          {/* 🧠 THÔNG TIN ĐĂNG KÝ */}
          {/* ====================== */}
          <Typography fontWeight={700} mb={1}>
            <Assignment
              sx={{ mr: 1, color: theme.palette.primary.main }}
            />
            Thông tin biểu mẫu đăng ký
          </Typography>

          <Stack spacing={1.2} ml={0.5} mt={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <WorkOutline color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>Kinh nghiệm:</strong> {collaborator.experience || "—"}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Translate color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>Chuyên môn:</strong>{" "}
                {collaborator.expertise.length
                  ? collaborator.expertise.join(", ")
                  : "—"}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTime color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>Thời gian làm việc:</strong> {availabilityLabel}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="flex-start" spacing={1}>
              <Psychology color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>Động lực:</strong> {collaborator.motivation || "—"}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Description color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>CV:</strong>{" "}
                <Link
                  href={collaborator.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  color="primary"
                >
                  Xem CV
                </Link>
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* ====================== */}
          {/* 🏅 THÀNH TỰU HỌC VIÊN */}
          {/* ====================== */}
          {collaborator.user_id && (
            <>
              <Typography fontWeight={700} mb={1}>
                <EmojiEvents sx={{ mr: 1, color: "gold" }} />
                Thành tựu đạt được
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {collaborator.user_id.badges?.length ? (
                  collaborator.user_id.badges.map((b, i) => (
                    <Chip
                      key={i}
                      label={b.name}
                      color="secondary"
                      variant="filled"
                      icon={<WorkspacePremium />}
                    />
                  ))
                ) : (
                  <Typography
                    color="text.secondary"
                    fontSize="0.9rem"
                    sx={{ ml: 1 }}
                  >
                    Chưa có thành tựu nào
                  </Typography>
                )}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography fontWeight={700} mb={1}>
                <School sx={{ mr: 1, color: theme.palette.primary.main }} />
                Độ thành thạo từng Part
              </Typography>
              {collaborator.user_id.master_parts?.length ? (
                collaborator.user_id.master_parts.map((p, i) => (
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
                <Typography color="text.secondary" fontSize="0.9rem" sx={{ ml: 1 }}>
                  Chưa có dữ liệu đánh giá
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
            </>
          )}

          {/* ====================== */}
          {/* ⚙️ HÀNH ĐỘNG DUYỆT / TỪ CHỐI */}
          {/* ====================== */}
          {collaborator.status === "pending" ? (
            <Stack direction="row" spacing={2} mt={2}>
              <Tooltip title="Chấp thuận cộng tác viên">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DoneAll />}
                  fullWidth
                  onClick={() => onApprove(collaborator._id)}
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
                  collaborator.status === "approved"
                    ? "Đã duyệt"
                    : collaborator.status === "rejected"
                    ? "Đã từ chối"
                    : "—"
                }
                color={
                  collaborator.status === "approved" ? "success" : "error"
                }
                sx={{ width: "100%", fontSize: "1rem", py: 2 }}
              />
              {collaborator.status === "rejected" &&
                collaborator.rejection_reason && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    📝 Lý do từ chối: {collaborator.rejection_reason}
                  </Typography>
                )}
            </Box>
          )}
        </Box>
      ) : (
        <Typography color="text.secondary" textAlign="center" mt={10}>
          Chưa chọn người dùng nào
        </Typography>
      )}

      {/* 🧾 Modal nhập lý do từ chối */}
      <Dialog
        open={rejectDialog}
        onClose={handleCancelReject}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Cancel sx={{ mr: 1, color: "error.main" }} />
          Từ chối yêu cầu cộng tác viên
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={1.5}>
            Nhập lý do từ chối cộng tác viên{" "}
            {collaborator && (
              <strong>
                {collaborator.user_id?.profile?.fullname ||
                  collaborator.fullName}
              </strong>
            )}
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
