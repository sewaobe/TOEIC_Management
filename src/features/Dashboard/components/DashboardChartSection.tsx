import { Grid, Paper, Typography, Box } from "@mui/material"
import { BarChart, LineChart } from "@mui/x-charts"
import { useTheme } from "@mui/material/styles"
import { ContentByStatus, WeeklyEngagement } from "../../../types/Dashboard"

interface Props {
  weeklyEngagement: WeeklyEngagement[]
  contentByStatus: ContentByStatus[]
}

export default function DashboardChartsSection({ weeklyEngagement, contentByStatus }: Props) {
  const theme = useTheme()

  return (
    <Grid container spacing={3} className="mb-6">
      {/* Biểu đồ cột - Người học hoạt động trong tuần */}
      <Grid size={{ xs: 12, lg: 7 }}>
        <Paper className="p-6 rounded-2xl border-0 shadow-md hover:shadow-xl transition-shadow">
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Người học hoạt động trong tuần
          </Typography>
          <Box sx={{ width: "100%", height: 300 }}>
            <BarChart
              dataset={weeklyEngagement}
              xAxis={[{ scaleType: "band", dataKey: "day" }]}
              series={[
                {
                  dataKey: "learners",
                  label: "Người học",
                  color: theme.palette.primary.main,
                },
              ]}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Biểu đồ đường - Xu hướng tạo nội dung */}
      <Grid size={{ xs: 12, lg: 5 }}>
        <Paper className="p-6 rounded-2xl border-0 shadow-md hover:shadow-xl transition-shadow">
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Xu hướng tạo nội dung
          </Typography>
          <Box sx={{ width: "100%", height: 300 }}>
            <LineChart
              dataset={contentByStatus}
              xAxis={[{ scaleType: "band", dataKey: "month" }]}
              series={[
                {
                  dataKey: "published",
                  label: "Đã xuất bản",
                  color: theme.palette.success.main,
                  curve: "natural",
                },
                {
                  dataKey: "draft",
                  label: "Bản nháp",
                  color: theme.palette.warning.main,
                  curve: "natural",
                },
              ]}
              slotProps={{
                legend: {
                  position: { vertical: "bottom", horizontal: "center" },
                },
              }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}
