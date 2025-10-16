import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  TablePagination,
  Box,
  TextField,
  useTheme,
} from "@mui/material";
import { Edit, Delete, FirstPage, LastPage } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { examParts } from "../../../../constants/examParts";
import { Question } from "../../../../types/question";

interface Props {
  questions: Question[];
  page: number;
  setPage: (p: number) => void;
  limit: number;
  setLimit: (l: number) => void;
  total: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewGroup: (id: string) => void;
}

export default function QuestionTable({
  questions,
  page,
  setPage,
  limit,
  setLimit,
  total,
  onEdit,
  onDelete,
  onViewGroup,
}: Props) {
  const theme = useTheme();

  // ===== Pagination handlers =====
  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
  };

  // ===== Jump to page (debounce) =====
  const totalPages = Math.ceil(total / limit);
  const [jumpPage, setJumpPage] = useState(page);

  useEffect(() => setJumpPage(page), [page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (jumpPage !== page && jumpPage >= 1 && jumpPage <= totalPages) {
        setPage(jumpPage);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [jumpPage]);

  // ===== Helper: tag colors =====
  const tagColors = [
    "primary",
    "secondary",
    "success",
    "warning",
    "info",
  ] as const;

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      {/* ===== Table ===== */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nội dung</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Part</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tag</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {questions.map((q, i) => (
              <TableRow
                key={q.id}
                hover
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => onViewGroup(q.group_id)}
              >
                <TableCell>{(page - 1) * limit + i + 1}</TableCell>
                <TableCell>
                  {q.textQuestion || <i>(Không có nội dung)</i>}
                </TableCell>
                <TableCell>{examParts[q.group_part]?.label || "N/A"}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 440, // ✅ giới hạn chiều rộng tối đa
                    whiteSpace: "normal", // cho phép xuống dòng
                    wordBreak: "break-word", // ngắt dòng nếu dài
                  }}
                >
                  {q.tags.length ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap", // ✅ xuống dòng khi hết chỗ
                        gap: 0.5,
                      }}
                    >
                      {q.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 500,
                            borderColor: "primary.main",
                            color: "primary.main",
                            borderRadius: "8px",
                            "& .MuiChip-label": { px: 0.8, fontSize: 13 },
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      (Không có)
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {new Date(q.created_at).toLocaleDateString("vi-VN")}
                </TableCell>

                <TableCell
                  align="center"
                  onClick={(e) => e.stopPropagation()}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  <Tooltip title="Sửa">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(q.group_id)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={
                      q.canDelete
                        ? "Xóa nhóm câu hỏi"
                        : "Không thể xóa (đang được sử dụng trong test)"
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={!q.canDelete}
                        onClick={() => onDelete(q.group_id)}
                        sx={{
                          opacity: q.canDelete ? 1 : 0.4,
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===== Pagination ===== */}
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage="Số dòng mỗi trang"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trong tổng ${count}`
        }
        sx={{ borderTop: 1, borderColor: "divider", mt: 1 }}
      />

      {/* ===== Jump to Page ===== */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            pr: 2,
            mt: 1,
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="Trang đầu">
            <span>
              <IconButton
                size="small"
                color="primary"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                <FirstPage />
              </IconButton>
            </span>
          </Tooltip>

          <Typography variant="body2" color="text.secondary">
            Đi tới trang:
          </Typography>

          <TextField
            type="number"
            size="small"
            value={jumpPage}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val)) setJumpPage(val);
            }}
            sx={{
              width: 80,
              "& input": { textAlign: "center" },
            }}
            inputProps={{
              min: 1,
              max: totalPages,
            }}
          />

          <Typography variant="body2" color="text.secondary">
            / {totalPages}
          </Typography>

          <Tooltip title="Trang cuối">
            <span>
              <IconButton
                size="small"
                color="primary"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
              >
                <LastPage />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
}
