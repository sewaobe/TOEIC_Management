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
} from "@mui/material";
import { Add, Search, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { examParts } from "../../../../constants/examParts";

const mockQuestions = [
  {
    id: 1,
    content: "What does TOEIC stand for?",
    partIndex: 5,
    tags: ["[Part 5] Câu hỏi từ vựng"],
    status: "Chưa hoàn thiện",
    date: "18/09/2025",
  },
  {
    id: 2,
    content: "She ____ to school yesterday.",
    partIndex: 2,
    tags: ["[Part 2] Câu hỏi WHEN"],
    status: "Hoàn thiện",
    date: "17/09/2025",
  },
];

const QuestionPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [partFilter, setPartFilter] = useState(0);
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const handleCreateNew = () => {
    navigate("/ctv/questions/create");
  };

  const handleEdit = (id: number) => {
    navigate(`/ctv/questions/${id}/edit`);
  };

  // Lấy danh sách tag của part hiện tại
  const currentTags =
    partFilter > 0 ? examParts[partFilter].tags.map((t) => t.name) : [];

  // Lọc câu hỏi
  const filteredQuestions = mockQuestions.filter((q) => {
    const matchSearch = q.content.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? q.status === statusFilter : true;
    const matchPart = partFilter > 0 ? q.partIndex === partFilter : true;
    const matchTags =
      tagFilter.length > 0
        ? tagFilter.every((tag) => q.tags.includes(tag))
        : true;

    return matchSearch && matchStatus && matchPart && matchTags;
  });

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Tiêu đề */}
      <Typography
        variant="h5"
        component="h1"
        sx={{ fontWeight: "bold", color: theme.palette.text.primary, mb: 3 }}
      >
        Ngân hàng câu hỏi
      </Typography>

      {/* Search + Bộ lọc + Tạo mới */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* Cụm bên trái: search + filter */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Ô search */}
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm câu hỏi..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

          {/* Bộ lọc trạng thái */}
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

          {/* Bộ lọc Part */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Part</InputLabel>
            <Select
              value={partFilter}
              label="Part"
              onChange={(e) => {
                setPartFilter(Number(e.target.value));
                setTagFilter([]); // reset tag khi đổi Part
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

          {/* Bộ lọc Tag (chỉ hiển thị khi chọn Part) */}
          {partFilter > 0 && (
            <Autocomplete
              multiple
              size="small"
              options={currentTags}
              value={tagFilter}
              onChange={(_, newValue) => setTagFilter(newValue)}
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

        {/* Cụm bên phải: nút thêm */}
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

      {/* Bảng danh sách câu hỏi */}
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
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nội dung</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Part</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tag</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuestions.map((q) => (
                <TableRow
                  key={q.id}
                  sx={{
                    "&:nth-of-type(even)": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>{q.id}</TableCell>
                  <TableCell>{q.content}</TableCell>
                  <TableCell>
                    {examParts[q.partIndex]
                      ? examParts[q.partIndex].label
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
                  <TableCell>{q.status}</TableCell>
                  <TableCell>{q.date}</TableCell>
                  <TableCell>
                    <Tooltip title="Sửa">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(q.id)}
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
      </Paper>
    </Box>
  );
};

export default QuestionPage;
