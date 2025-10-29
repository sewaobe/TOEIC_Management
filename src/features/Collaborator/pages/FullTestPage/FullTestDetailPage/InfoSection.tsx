import { Box, Button, Chip, ChipProps, Divider, Grid, Paper, Typography } from "@mui/material";
import { FullTest, TestStatus } from "../../../../../types/fullTest";
import InfoRow from "./GroupsSection/InfoRow";
import { AccessTime, CalendarMonth, Forum, Person, TextSnippet, Send, HourglassEmpty, CheckCircle, PlayCircle, Lock } from "@mui/icons-material";
import { toast } from "sonner";
import fullTestService from "../../../../../services/fullTest.service";

const test_status_mapping = [
  { value: "draft", label: "Bản nháp" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "open", label: "Mở" },
  { value: "closed", label: "Đóng" },
];

const test_status_color: Record<TestStatus, ChipProps["color"]> = {
  draft: "default",
  pending: "warning",
  approved: "success",
  open: "primary",
  closed: "error",
};

export default function InfoSection({ test }: { test: FullTest }) {
  const statusLabel = test_status_mapping.find(s => s.value === test.status)?.label ?? "—";
  const status_color = (test_status_color as Record<string, ChipProps["color"]>)[test.status] ?? "default";
  const handleRequestApproval = async () => {
    try {
      await toast.promise(fullTestService.updateStatus(test._id, "pending"), {
        loading: "Đang gửi duyệt...",
        success: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return "Gửi duyệt thành công";
        },
        error: "Gửi duyệt thất bại",
      })
    } catch (err) {
      toast.error("Gửi duyệt thất bại");
    }
  };
  const handleOpenTest = async () => {
    try {
      await toast.promise(fullTestService.updateStatus(test._id, "open"), {
        loading: "Đang mở kỳ thi...",
        success: () => {
          setTimeout(() => {
            window.location.reload();
          }
            , 1000);
          return "Mở kỳ thi thành công";
        },
        error: "Mở kỳ thi thất bại",
      })
    } catch (err) {
      toast.error("Mở kỳ thi thất bại");
    }
  };
  // Quy tắc hiển thị nút theo trạng thái
  const renderActionButton = () => {
    switch (test.status as TestStatus) {
      case "draft":
        return (
          <Button
            onClick={handleRequestApproval}
            variant="contained"
            startIcon={<Send />}
            color="primary"
          >
            Gửi duyệt
          </Button>
        );
      case "pending":
        return (
          <Button
            variant="outlined"
            startIcon={<HourglassEmpty />}
            color="warning"
            disabled
          >
            Đang chờ duyệt
          </Button>
        );
      case "approved":
        return (
          <Button
            onClick={handleOpenTest}
            variant="contained"
            startIcon={<PlayCircle />}
            color="primary"
          >
            Mở kỳ thi
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 4, mb: 5, boxShadow: 2, borderRadius: 2 }}>
      {/* Header: Title + Action button cùng hàng */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mr: 2 }}>
          {test.title}
        </Typography>
        {renderActionButton()}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }} >
          <InfoRow icon={<TextSnippet color="primary" />} label="Chủ đề" value={test.topic || "—"} />
          <InfoRow icon={<AccessTime color="primary" />} label="Loại đề" value={test.type} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Trạng thái:</Typography>
            <Chip label={statusLabel} color={status_color} size="small" />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} >
          <InfoRow icon={<Person color="secondary" />} label="Người tạo" value={test?.created_by?.profile.fullname || "Không rõ"} />
          <InfoRow
            icon={<CalendarMonth color="secondary" />}
            label="Ngày tạo"
            value={new Date(test.created_at).toLocaleDateString("vi-VN")}
          />
          <InfoRow icon={<Forum color="secondary" />} label="Bình luận" value={String(test.countComment ?? 0)} />
          <InfoRow icon={<TextSnippet color="secondary" />} label="Lượt làm" value={String(test.countSubmit ?? 0)} />
        </Grid>
      </Grid>
    </Paper>
  );
}
