import { Box, Typography, useTheme, Paper } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import type { ProgressData } from "../../../../../types/student";

interface ProgressChartsProps {
  data: ProgressData[];
}

export function ProgressCharts({ data }: ProgressChartsProps) {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Biểu đồ điểm TOEIC */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Điểm TOEIC theo thời gian
        </Typography>

        <LineChart
          dataset={data}
          xAxis={[
            {
              dataKey: "date",
              label: "Ngày",
              scaleType: "band",
            },
          ]}
          yAxis={[{ min: 0, max: 990, label: "Điểm" }]}
          series={[
            {
              dataKey: "listening",
              label: "Listening",
              color: theme.palette.primary.main,
            },
            {
              dataKey: "reading",
              label: "Reading",
              color: theme.palette.secondary.main,
            },
          ]}
          height={250}
          margin={{ left: 40, right: 20, top: 10, bottom: 40 }}
          grid={{ horizontal: true }}
        />
      </Paper>

      {/* Biểu đồ kỹ năng */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Kỹ năng theo thời gian
        </Typography>

        <LineChart
          dataset={data}
          xAxis={[
            {
              dataKey: "date",
              label: "Ngày",
              scaleType: "band",
            },
          ]}
          yAxis={[{ min: 0, max: 100, label: "%" }]}
          series={[
            {
              dataKey: "vocabulary",
              label: "Vocabulary",
              color: theme.palette.info.main,
            },
            {
              dataKey: "grammar",
              label: "Grammar",
              color: theme.palette.success.main,
            },
          ]}
          height={250}
          margin={{ left: 40, right: 20, top: 10, bottom: 40 }}
          grid={{ horizontal: true }}
        />
      </Paper>
    </Box>
  );
}
