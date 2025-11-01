import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { AdminReportItem, AdminReportStatus, AdminReportType } from "../types";

interface Props {
  items: AdminReportItem[];
  page: number;
  rowsPerPage: number;
  total: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onSelect: (report: AdminReportItem) => void;
}

const statusConfig: Record<
  AdminReportStatus,
  { color: "warning" | "info" | "success" | "error"; label: string }
> = {
  pending: { color: "warning", label: "Chờ xử lý" },
  in_progress: { color: "info", label: "Đang xử lý" },
  resolved: { color: "success", label: "Đã xử lý" },
  rejected: { color: "error", label: "Từ chối" },
};

const typeLabels: Record<AdminReportType, string> = {
  system: "Lỗi hệ thống",
  lesson: "Lỗi bài học",
  flashcard: "Lỗi flashcard",
  chatbot: "Lỗi chatbot",
  other: "Khác",
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

function ReportTable({
  items,
  page,
  rowsPerPage,
  total,
  loading,
  onPageChange,
  onRowsPerPageChange,
  onSelect,
}: Props) {
  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Người báo</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 4,
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress size={24} />
                    <Typography>Đang tải danh sách báo lỗi...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography align="center" sx={{ py: 4 }}>
                    Không có báo lỗi phù hợp
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              items.map((report, index) => {
                const config = statusConfig[report.status];
                return (
                  <TableRow
                    hover
                    key={report.id}
                    sx={{ cursor: "pointer" }}
                    onClick={() => onSelect(report)}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{typeLabels[report.type]}</TableCell>
                    <TableCell>
                      {report.reporter?.fullname ||
                        report.reporter?.email ||
                        "Ẩn danh"}
                    </TableCell>
                    <TableCell>{formatDateTime(report.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={config.label}
                        color={config.color}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) =>
          onRowsPerPageChange(Number(event.target.value))
        }
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage="Số dòng mỗi trang"
      />
    </Paper>
  );
}

export default memo(ReportTable);
