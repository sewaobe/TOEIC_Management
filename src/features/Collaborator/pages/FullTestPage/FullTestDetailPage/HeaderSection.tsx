import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { ArrowBack, CheckCircle, Delete, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FullTest } from "../../../../../types/fullTest";

export default function HeaderSection({
  test,
  onDelete,
}: {
  test: FullTest;
  onDelete: () => void;
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const canModify = test.status === "draft";

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
      {/* Trái: Tiêu đề + Quay lại */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Chi tiết đề thi
        </Typography>
      </Box>

      {/* Phải: Nút hành động */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => navigate(`/ctv/full-tests/${test._id}/edit`)}
          disabled={!canModify}
        >
          Sửa
        </Button>
        <Button
          variant="outlined"
          startIcon={<Visibility />}
          onClick={() => navigate(`/ctv/full-tests/${test._id}/preview`)}
        >
          Xem trước
        </Button>
        <Button variant="contained" color="success" startIcon={<CheckCircle />}>
          Duyệt
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={onDelete}
          disabled={!canModify}
        >
          Xóa
        </Button>
      </Box>
    </Paper>
  );
}
