import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { CTVReportItem, CTVReportStatus, CTVReportType } from "../types";

interface Props {
  open: boolean;
  report: CTVReportItem | null;
  loading: boolean;
  updating: boolean;
  onClose: () => void;
  onSubmit: (payload: { status?: CTVReportStatus; adminNote?: string }) => void;
}

const statusOptions: { value: CTVReportStatus; label: string }[] = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "in_progress", label: "Đang xử lý" },
  { value: "resolved", label: "Đã xử lý" },
  { value: "rejected", label: "Từ chối" },
];

const typeLabels: Record<CTVReportType, string> = {
  lesson: "Lỗi bài học",
  flashcard: "Lỗi flashcard",
};

export default function CTVReportDetailDrawer({
  open,
  report,
  loading,
  updating,
  onClose,
  onSubmit,
}: Props) {
  const [status, setStatus] = useState<CTVReportStatus>("pending");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!report) {
      setStatus("pending");
      setNote("");
      return;
    }
    setStatus(report.status);
    setNote(report.adminNote || "");
  }, [report]);

  const canSubmit = useMemo(() => {
    if (!report) return false;
    return status !== report.status || note !== (report.adminNote || "");
  }, [note, report, status]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ status, adminNote: note });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 420 } }}
    >
      <Box
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Chi tiết báo lỗi
        </Typography>

        {loading && (
          <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
        )}

        {!loading && !report && (
          <Typography color="text.secondary">Không tìm thấy báo lỗi</Typography>
        )}

        {!loading && report && (
          <Stack spacing={2} sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Tiêu đề
              </Typography>
              <Typography fontWeight={600}>{report.title}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Loại
              </Typography>
              <Chip
                label={typeLabels[report.type]}
                size="small"
                sx={{ width: "fit-content" }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Người báo lỗi
              </Typography>
              <Typography>
                {report.reporter?.fullname ||
                  report.reporter?.email ||
                  "Ẩn danh"}
              </Typography>
              {report.reporter?.email && (
                <Typography variant="body2" color="text.secondary">
                  {report.reporter.email}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Nội dung
              </Typography>
              <Typography whiteSpace="pre-wrap" sx={{ mt: 0.5 }}>
                {report.description}
              </Typography>
            </Box>

            {report.imageUrl && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Ảnh minh họa
                </Typography>
                <Box
                  component="img"
                  src={report.imageUrl}
                  alt={report.title}
                  sx={{
                    mt: 1,
                    width: "100%",
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                />
              </Box>
            )}

            <Divider />

            <TextField
              select
              label="Trạng thái"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as CTVReportStatus)
              }
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Ghi chú xử lý"
              multiline
              minRows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ghi chú sẽ hiển thị cho học viên"
              fullWidth
            />

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Người xử lý
              </Typography>
              <Typography>
                {report.handler?.fullname || report.handler?.email || "Chưa có"}
              </Typography>
            </Box>
          </Stack>
        )}

        <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
          <Button variant="outlined" fullWidth onClick={onClose}>
            Đóng
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!canSubmit || updating}
          >
            {updating ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
