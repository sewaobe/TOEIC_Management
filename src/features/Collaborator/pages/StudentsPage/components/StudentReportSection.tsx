"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useTheme,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { BarChart, PieChart } from "@mui/x-charts";
import type { GroupReport } from "../../../../../types/student"; // ✅ Type thật
import studentService from "../services/studentService"; // ✅ Service thật

export function StudentReportSection() {
  const theme = useTheme();
  const [reports, setReports] = useState<GroupReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  // =============================
  // 📡 Gọi API thật
  // =============================
  async function loadReports() {
    setLoading(true);
    try {
      const data = await studentService.getReports(); // ✅ BE route: /api/ctv/students/reports
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =============================
  // 📊 Chuẩn bị dữ liệu thống kê
  // =============================
  const chartData = reports.map((r) => ({
    name: r.groupName,
    total: r.totalStudents,
    active: r.activeStudents,
    avgProgress: r.averageProgress,
  }));

  const totalStudents = reports.reduce((a, r) => a + r.totalStudents, 0);
  const totalActive = reports.reduce((a, r) => a + r.activeStudents, 0);
  const avgProgress = Math.round(
    reports.reduce((a, r) => a + r.averageProgress, 0) / reports.length || 0
  );
  const avgScore = Math.round(
    reports.reduce((a, r) => a + r.averageScore, 0) / reports.length || 0
  );

  // 🎨 Màu sắc
  const colors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  // =============================
  // 🧱 Render UI
  // =============================
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* 🧭 Header */}
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Báo cáo theo nhóm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Thống kê và phân tích hiệu suất học tập theo từng nhóm học viên
        </Typography>
      </Box>

      {/* 📦 Tổng quan nhanh */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="subtitle2">Tổng học viên</Typography>
              <GroupsIcon color="action" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {totalStudents}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Trên {reports.length} nhóm
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2">Đang hoạt động</Typography>
              <TrendingUpIcon color="action" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {totalActive}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round((totalActive / totalStudents) * 100)}% tổng số
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2">Tiến độ TB</Typography>
              <EmojiEventsIcon color="action" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {avgProgress}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Trung bình các nhóm
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2">Điểm TB</Typography>
              <TrackChangesIcon color="action" fontSize="small" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {avgScore}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              TOEIC trung bình
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 📊 Biểu đồ */}
      <Grid container spacing={3}>
        {/* Biểu đồ cột */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              So sánh các nhóm
            </Typography>
            <BarChart
              dataset={chartData}
              xAxis={[{ scaleType: "band", dataKey: "name" }]}
              series={[
                { dataKey: "total", label: "Tổng học viên", color: colors[0] },
                { dataKey: "active", label: "Đang học", color: colors[1] },
                { dataKey: "avgProgress", label: "Tiến độ TB (%)", color: colors[2] },
              ]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Biểu đồ tròn */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Phân bổ học viên
            </Typography>
            <PieChart
              series={[
                {
                  data: chartData.map((c) => ({
                    id: c.name,
                    value: c.total,
                    label: c.name,
                  })),
                },
              ]}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* 📋 Bảng chi tiết */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Chi tiết theo nhóm
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nhóm</TableCell>
                <TableCell align="right">Tổng HV</TableCell>
                <TableCell align="right">Đang học</TableCell>
                <TableCell align="right">Tiến độ TB</TableCell>
                <TableCell align="right">Điểm TB</TableCell>
                <TableCell align="right">Hoàn thành (%)</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reports.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.groupName}</TableCell>
                  <TableCell align="right">{r.totalStudents}</TableCell>
                  <TableCell align="right">
                    <Typography color="success.main" fontWeight={500}>
                      {r.activeStudents}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      <Box
                        sx={{
                          width: 80,
                          backgroundColor: theme.palette.action.hover,
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={r.averageProgress}
                          sx={{
                            height: 8,
                            borderRadius: 2,
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: colors[0],
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2">{r.averageProgress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {r.averageScore}
                  </TableCell>
                  <TableCell align="right">{r.completionRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
