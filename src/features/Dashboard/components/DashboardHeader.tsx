import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"

interface DashboardHeaderProps {
  collaboratorName?: string
  slogan?: string
}

export default function DashboardHeader({
  collaboratorName = "Cộng tác viên",
  slogan = "Lan tỏa tri thức, chắp cánh hành trình học TOEIC",
}: DashboardHeaderProps) {
  const theme = useTheme()

  return (
    <Box
      className="mb-8 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
        color: theme.palette.primary.contrastText,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: theme.palette.primary.contrastText,
        }}
      >
        👋 Xin chào, {collaboratorName}!
      </Typography>

      <Typography
        variant="body1"
        sx={{
          opacity: 0.9,
          fontSize: "1.05rem",
          color: theme.palette.primary.contrastText,
        }}
      >
        {slogan}
      </Typography>
    </Box>
  )
}
