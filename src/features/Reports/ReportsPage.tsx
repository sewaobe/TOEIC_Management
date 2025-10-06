import { Box, Typography, useTheme } from "@mui/material";
import ReportFilter from "./components/ReportFilter";
import ReportChart from "./components/ReportChart";


export default function ReportsPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.default,
        overflow: "auto",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Báo cáo thống kê
      </Typography>

      <ReportFilter />

      <ReportChart />
    </Box>
  );
}