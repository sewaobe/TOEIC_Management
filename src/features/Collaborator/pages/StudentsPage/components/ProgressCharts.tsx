import { Box, Paper, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import type { ProgressData } from "../../../../../types/student";

interface ProgressChartsProps {
  data: ProgressData[];
}

export function ProgressCharts({ data }: ProgressChartsProps) {
  const scoreValues = data
    .flatMap((item) => [Number(item.listening) || 0, Number(item.reading) || 0])
    .filter((value) => value > 0);
  const latest = data[data.length - 1];
  const latestListening = Number(latest?.listening) || 0;
  const latestReading = Number(latest?.reading) || 0;
  const latestTotal = latestListening + latestReading;
  const yMin = scoreValues.length ? Math.max(0, Math.min(...scoreValues) - 50) : 0;
  const yMax = scoreValues.length ? Math.min(990, Math.max(...scoreValues) + 50) : 990;

  if (!data.length) {
    return (
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Điểm TOEIC theo thời gian
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Chưa có checkpoint điểm để hiển thị.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" gap={2} mb={1.5}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Điểm TOEIC theo thời gian
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Theo các checkpoint năng lực gần nhất
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h6" fontWeight={700}>
            {latestTotal || "-"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            L {latestListening} · R {latestReading}
          </Typography>
        </Box>
      </Box>

      <LineChart
        dataset={data}
        xAxis={[
          {
            dataKey: "date",
            label: "Ngày",
            scaleType: "band",
          },
        ]}
        yAxis={[{ min: yMin, max: yMax, label: "Điểm" }]}
        series={[
          {
            dataKey: "listening",
            label: "Listening",
            color: "#2563eb",
          },
          {
            dataKey: "reading",
            label: "Reading",
            color: "#f97316",
          },
        ]}
        height={220}
        margin={{ left: 44, right: 16, top: 20, bottom: 36 }}
        grid={{ horizontal: true }}
      />
    </Paper>
  );
}
