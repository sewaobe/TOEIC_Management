"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Avatar,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Box,
} from "@mui/material";

import { Student } from "../../../../../types/student";
import { formatRelativeTime, getLearningPathLabel } from "../utils/formatters";

// =============================
// 🧩 Component con: Tiến độ
// =============================
function ProgressBar({
  value,
  max,
  showPercentage = true,
}: {
  value: number;
  max: number;
  showPercentage?: boolean;
}) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: "action.hover",
          "& .MuiLinearProgress-bar": {
            borderRadius: 1,
          },
        }}
      />
      {showPercentage && (
        <Typography variant="caption" color="text.secondary">
          {percent}%
        </Typography>
      )}
    </Box>
  );
}

// =============================
// 🧩 Component con: Trạng thái
// =============================
function StatusChip({ status }: { status: string }) {
  const getColor = () => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "paused":
        return "warning";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };
  const getLabel = () => {
    switch (status) {
      case "active":
        return "Đang học";
      case "inactive":
        return "Không hoạt động";
      case "paused":
        return "Tạm dừng";
      case "completed":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };
  return (
    <Chip
      label={getLabel()}
      color={getColor() as any}
      size="small"
      variant="outlined"
    />
  );
}

// =============================
// 🧩 Component chính: Bảng học viên
// =============================
interface StudentTableProps {
  students: Student[];
  onStudentClick: (studentId: string) => void;
}

export function StudentTable({ students, onStudentClick }: StudentTableProps) {
  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Học viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              {/* <TableCell sx={{ fontWeight: 600 }}>Lộ trình</TableCell> */}
              <TableCell sx={{ fontWeight: 600 }}>Tiến độ</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Điểm hiện tại</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hoạt động gần nhất</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy học viên nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                  }}
                  onClick={() => onStudentClick(student.id)}
                >
                  {/* Cột Học viên */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={student.avatar || undefined}
                        alt={student.name}
                        sx={{ width: 40, height: 40 }}
                      >
                        {student.name?.charAt(0) || "?"}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={500}>
                          {student.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {student.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Cột trạng thái */}
                  <TableCell>
                    <StatusChip status={student.status || "inactive"} />
                  </TableCell>

                  {/* Cột lộ trình */}
                  {/* <TableCell>
                    <Chip
                      label={getLearningPathLabel(student.learningPath)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell> */}

                  {/* Cột tiến độ */}
                  <TableCell sx={{ minWidth: 200 }}>
                    <ProgressBar
                      value={student.completedLessons ?? 0}
                      max={student.totalLessons ?? 100}
                      showPercentage
                    />
                  </TableCell>

                  {/* Cột điểm hiện tại */}
                  <TableCell>
                    <Box textAlign="center">
                      <Typography variant="body1" fontWeight={600}>
                        {student.currentScore}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        / {student.targetScore}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Cột hoạt động gần nhất */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {formatRelativeTime(student.lastActive || "")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
