import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Add, Search, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { examParts } from "../../../../constants/examParts";
import { useFetchList } from "../../../../hooks/useFetchList";
import groupService from "../../../../services/group.service";
import { Question } from "../../../../types/question";
import PaginationContainer from "../../../../components/PaginationContainer";

// helper: debounce search
function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const QuestionPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [partFilter, setPartFilter] = useState(0);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // ✅ debounce search tránh gọi API liên tục
  const debouncedSearch = useDebounce(search, 500);

  // ✅ useFetchList sử dụng đúng params
  const {
    items: questions,
    pageCount,
    total,
    isLoading,
    refresh,
  } = useFetchList<Question, any>({
    fetchFn: (params) => groupService.getAllQuestionsWithGroup(params),
  });

  // ✅ gọi API khi filter đổi
  useEffect(() => {
    refresh({
      page,
      limit,
      search: debouncedSearch,
      part: partFilter || undefined,
      tag: tagFilter[0] || undefined,
    });
  }, [page, debouncedSearch, partFilter, tagFilter]);

  const handleCreateNew = () => navigate("/ctv/questions/create");
  const handleEdit = (groupId: string) => {
    navigate(`/ctv/questions/${groupId}/edit`);
  };

  const currentTags =
    partFilter > 0 ? examParts[partFilter].tags.map((t) => t.name) : [];

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* ===== Header ===== */}
      <Typography
        variant="h5"
        component="h1"
        sx={{ fontWeight: "bold", color: theme.palette.text.primary, mb: 3 }}
      >
        Ngân hàng câu hỏi
      </Typography>

      {/* ===== Search & Filters ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm câu hỏi..."
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset về trang 1 khi đổi search
            }}
            sx={{
              bgcolor: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: 1,
              width: 300,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Status filter (chưa dùng API thực) */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Chưa hoàn thiện">Chưa hoàn thiện</MenuItem>
              <MenuItem value="Hoàn thiện">Hoàn thiện</MenuItem>
            </Select>
          </FormControl>

          {/* Part filter */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Part</InputLabel>
            <Select
              value={partFilter}
              label="Part"
              onChange={(e) => {
                setPartFilter(Number(e.target.value));
                setTagFilter([]);
                setPage(1);
              }}
            >
              <MenuItem value={0}>Tất cả</MenuItem>
              {examParts.map((part, idx) =>
                idx > 0 ? (
                  <MenuItem key={idx} value={idx}>
                    {part.label}
                  </MenuItem>
                ) : null
              )}
            </Select>
          </FormControl>

          {/* Tag filter */}
          {partFilter > 0 && (
            <Autocomplete
              multiple
              size="small"
              options={currentTags}
              value={tagFilter}
              onChange={(_, newValue) => {
                setTagFilter(newValue);
                setPage(1);
              }}
              sx={{ minWidth: 250 }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Chọn tag" />
              )}
            />
          )}
        </Box>

        {/* Add button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleCreateNew}
          >
            Thêm câu hỏi
          </Button>
        </motion.div>
      </Box>

      {/* ===== Table ===== */}
      {isLoading ? (
        <Box className="flex justify-center py-10">
          <CircularProgress />
        </Box>
      ) : (
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            boxShadow: 2,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                  <TableCell sx={{ fontWeight: 600, width: "5%" }}>
                    STT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "45%" }}>
                    Nội dung
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "10%" }}>
                    Part
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "20%" }}>
                    Tag
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "10%" }}>
                    Ngày tạo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "10%" }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {questions.map((q, index) => (
                  <TableRow
                    key={q.id}
                    sx={{
                      "&:nth-of-type(even)": {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      {q.textQuestion || <i>(Không có nội dung)</i>}
                    </TableCell>
                    <TableCell>
                      {examParts[q.group_part]
                        ? examParts[q.group_part].label
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {q.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 0.5 }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      {new Date(q.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Sửa">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(q.group_id)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Xóa">
                        <IconButton size="small" color="secondary">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box className="flex justify-between items-center mt-3">
            <Typography variant="body2" color="text.secondary">
              Tổng số: {total} câu hỏi
            </Typography>

            <PaginationContainer
              items={[]}
              pageCount={pageCount}
              page={page}
              onPageChange={(p) => setPage(p)}
              viewMode="list"
              renderItem={() => null}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default QuestionPage;
