import { Box, Typography, CircularProgress } from "@mui/material"
import { motion } from "framer-motion"
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

interface EmptyStateProps {
  mode: "loading" | "error" | "empty"
  title?: string
  description?: string
  icon?: React.ReactNode
}

export const EmptyState = ({ mode, title, description, icon }: EmptyStateProps) => {
  let content

  if (mode === "loading") {
    content = (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {title || "Đang tải dữ liệu..."}
        </Typography>
      </Box>
    )
  }

  if (mode === "error") {
    content = (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {icon || <ErrorOutlineIcon sx={{ fontSize: 40, color: "error.main" }} />}
        <Typography variant="h6" color="error" fontWeight="bold">
          {title || "Có lỗi xảy ra"}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {description}
          </Typography>
        )}
      </Box>
    )
  }

  if (mode === "empty") {
    content = (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {icon || <InboxOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />}
        <Typography variant="h6" fontWeight="bold">
          {title || "Không có dữ liệu"}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {description}
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          py: 10,
          px: 4,
          borderRadius: 2,
          border: "1px dashed #cbd5e1",
          bgcolor: "#f9fafb",
          textAlign: "center",
        }}
      >
        {content}
      </Box>
    </motion.div>
  )
}
