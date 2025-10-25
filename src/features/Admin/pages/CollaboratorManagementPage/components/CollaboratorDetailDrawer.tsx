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
} from "@mui/material";
import { UserDetail } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  user: UserDetail | null;
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function CollaboratorDetailDrawer({
  open,
  onClose,
  user,
  loading,
  onApprove,
  onReject,
}: Props) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 420, p: 3 } }}>
      {loading ? (
        <Typography>Đang tải...</Typography>
      ) : user ? (
        <Box>
          {/* 🧍 Thông tin cơ bản */}
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={user.profile?.avatar} sx={{ width: 64, height: 64 }} />
            <Box>
              <Typography fontWeight={700}>{user.profile?.fullname}</Typography>
              <Typography color="text.secondary">{user.email}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 🏅 Thành tựu */}
          <Typography fontWeight={600} mb={1}>
            Thành tựu (Badges)
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {user.badges?.length ? (
              user.badges.map((b, i) => <Chip key={i} label={b.title} color="secondary" />)
            ) : (
              <Typography color="text.secondary">Chưa có thành tựu</Typography>
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* 📊 Mastery */}
          <Typography fontWeight={600} mb={1}>
            Độ thành thạo từng Part
          </Typography>
          {user.master_parts?.map((p, i) => (
            <Box key={i} mb={1}>
              <Typography fontSize="0.9rem" mb={0.5}>
                {p.part_name} — {p.accuracy}%
              </Typography>
              <LinearProgress value={p.accuracy} variant="determinate" />
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* 📚 Topics */}
          <Typography fontWeight={600} mb={1}>
            Từ vựng chuyên sâu
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {user.topic_vocabularies?.length ? (
              user.topic_vocabularies.map((t, i) => <Chip key={i} label={t.title} />)
            ) : (
              <Typography color="text.secondary">Chưa có chủ đề nổi bật</Typography>
            )}
          </Stack>

          {/* 🟢 Hành động duyệt */}
          {user.status === "pending" ? (
            <Box mt={3} display="flex" gap={2}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={() => onApprove(user.id)}
              >
                Duyệt
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => onReject(user.id)}
              >
                Từ chối
              </Button>
            </Box>
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
                sx={{ width: "100%", fontSize: "1rem" }}
              />
            </Box>
          )}
        </Box>
      ) : (
        <Typography color="text.secondary">Chưa chọn người dùng</Typography>
      )}
    </Drawer>
  );
}
