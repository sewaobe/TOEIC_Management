import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

interface PracticeTopicHeaderProps {
  onAdd: () => void;
}

export default function PracticeTopicHeader({
  onAdd,
}: PracticeTopicHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Quản lý Chủ đề Luyện tập Định nghĩa
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tạo và quản lý các chủ đề từ vựng cho bài tập định nghĩa
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onAdd}
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Thêm chủ đề mới
      </Button>
    </Box>
  );
}
