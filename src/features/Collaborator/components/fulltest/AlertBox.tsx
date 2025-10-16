import { Box } from "@mui/material";

interface Props {
  show: boolean;
}

export default function AlertBox({ show }: Props) {
  if (!show) return null;
  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        border: "1px solid #f59e0b",
        borderRadius: 2,
        bgcolor: "rgba(255, 215, 100, 0.1)",
        color: "#92400e",
        fontWeight: 500,
        textAlign: "center",
      }}
    >
      ⚠️ Vui lòng điền đầy đủ thông tin trước khi tiếp tục.
    </Box>
  );
}
