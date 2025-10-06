import { Grid, Paper, Box, Typography, Chip } from "@mui/material"
import { StarOutline, PeopleOutline, CheckCircleOutline } from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { AttentionItem, TopContentItem } from "../../../types/Dashboard"

interface Props {
  topContent: TopContentItem[]
  needsAttention: AttentionItem[]
}

export default function DashboardContentSection({ topContent, needsAttention }: Props) {
  const theme = useTheme()

  return (
    <Grid container spacing={3} className="mb-6">
      {/* === Nội dung hiệu suất cao === */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Paper className="p-6 rounded-2xl border-0 shadow-md hover:shadow-xl transition-shadow h-full">
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Nội dung hiệu suất cao
          </Typography>
          <Box className="space-y-3">
            {topContent.map((content, i) => (
              <Box
                key={i}
                className="p-4 rounded-xl border hover:shadow-md transition-all hover:scale-[1.02]"
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.success.main}10)`,
                  borderColor: theme.palette.success.main,
                }}
              >
                <Box className="flex items-start justify-between mb-2">
                  <Typography fontWeight="bold">{content.title}</Typography>
                  <Chip
                    icon={<StarOutline sx={{ fontSize: 14 }} />}
                    label={content.rating}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.warning.light,
                      color: theme.palette.warning.main,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box className="flex items-center gap-4 text-sm">
                  <Box className="flex items-center gap-1">
                    <PeopleOutline sx={{ fontSize: 16 }} />
                    <span>{content.learners} người học</span>
                  </Box>
                  <Box className="flex items-center gap-1">
                    <CheckCircleOutline sx={{ fontSize: 16 }} />
                    <span>{content.completion}% hoàn thành</span>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* === Cần chú ý === */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Paper className="p-6 rounded-2xl border-0 shadow-md hover:shadow-xl transition-shadow h-full">
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Cần chú ý
          </Typography>
          <Box className="space-y-3">
            {needsAttention.map((item, i) => (
              <Box
                key={i}
                className="p-4 rounded-xl border hover:shadow-md transition-all hover:scale-[1.02]"
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.error.light}, ${theme.palette.warning.light})`,
                  borderColor: theme.palette.error.main,
                }}
              >
                <Box className="flex items-start justify-between mb-1">
                  <Typography fontWeight="bold">{item.title}</Typography>
                  <Chip
                    label={item.priority === "high" ? "Cao" : "Trung bình"}
                    size="small"
                    sx={{
                      backgroundColor:
                        item.priority === "high"
                          ? theme.palette.error.main
                          : theme.palette.warning.main,
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography>{item.issue}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}
