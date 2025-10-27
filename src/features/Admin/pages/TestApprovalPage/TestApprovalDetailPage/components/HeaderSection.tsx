import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  CheckCircle,
  Close,
  Delete,
  Drafts,
  Lock,
  LockOpen,
  DoneAll,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FullTest } from "../../../../../../types/fullTest";
import { TestStatus } from "../../../../../../types/enums/TestStatus.ts";

export default function HeaderSection({
  test,
  onApprove,
  onReject,
  onDelete,
}: {
  test: FullTest;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const theme = useTheme();
  const navigate = useNavigate();

  const isPending = test.status === TestStatus.PENDING;
  const isApproved = test.status === TestStatus.APPROVED;
  const isDraft = test.status === TestStatus.DRAFT;
  const isOpen = test.status === TestStatus.OPEN;
  const isClosed = test.status === TestStatus.CLOSED;

  const getChipConfig = () => {
    if (isApproved)
      return {
        icon: <DoneAll fontSize="small" />,
        label: "Đã duyệt",
        color: "success" as const,
      };
    if (isClosed)
      return {
        icon: <Lock fontSize="small" />,
        label: "Đã đóng",
        color: "error" as const,
      };
    if (isOpen)
      return {
        icon: <LockOpen fontSize="small" />,
        label: "Đang mở",
        color: "primary" as const,
      };
    if (isDraft)
      return {
        icon: <Drafts fontSize="small" />,
        label: "Bản nháp",
        color: "default" as const,
      };
    return { icon: <Close fontSize="small" />, label: "Không xác định", color: "default" as const };
  };

  const chipConfig = getChipConfig();

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 2,
        boxShadow: 3,
        background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
      }}
    >
      {/* ⬅️ Trái: Tiêu đề + Quay lại */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Chi tiết duyệt đề thi
        </Typography>
      </Box>

      {/* ➡️ Phải: Nút hành động */}
      {isPending ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={onApprove}
          >
            Duyệt
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Close />}
            onClick={onReject}
          >
            Từ chối
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={chipConfig.icon}
            label={chipConfig.label}
            color={chipConfig.color}
            sx={{
              fontWeight: 600,
              height: 32,
              "& .MuiChip-label": { px: 1 },
            }}
          />
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={onDelete}
          >
            Xóa
          </Button>
        </Box>
      )}
    </Paper>
  );
}
