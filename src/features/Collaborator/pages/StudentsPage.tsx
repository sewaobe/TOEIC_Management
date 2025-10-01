import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
} from "@mui/material";

// Mock Data cho Học viên
const students = [
  { id: 1, name: "Nguyễn Văn A", progress: "75%", testsCompleted: 12 },
  { id: 2, name: "Trần Thị B", progress: "60%", testsCompleted: 9 },
  { id: 3, name: "Lê Văn C", progress: "85%", testsCompleted: 15 },
  { id: 4, name: "Phạm Thị D", progress: "40%", testsCompleted: 5 },
];

const StudentsPage = () => {
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
      <Typography
        variant="h5"
        component="h1"
        sx={{ fontWeight: "bold", color: theme.palette.text.primary, mb: 3 }}
      >
        Học viên
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              boxShadow: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}
            >
              Danh sách học viên
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tên</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tiến độ</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Số bài test đã hoàn thành</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.progress}</TableCell>
                    <TableCell>{student.testsCompleted}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentsPage;
