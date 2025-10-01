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
} from "@mui/material";
import { Add, Search, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

const mockData = [
  { id: 1, title: "Practice - Part 2", type: "Listening", status: "Đang soạn thảo", date: "18/09/2025" },
  { id: 2, title: "Practice - Part 6", type: "Reading", status: "Chờ duyệt", date: "17/09/2025" },
];

const PracticePage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{ fontWeight: "bold", color: theme.palette.text.primary, mb: 3 }}
      >
        Bài tập vận dụng
      </Typography>

      {/* Thanh tìm kiếm + nút tạo mới */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm bài tập..."
          size="small"
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: 1,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="contained" color="primary" startIcon={<Add />}>
            Tạo mới
          </Button>
        </motion.div>
      </Box>

      {/* Bảng danh sách Practice */}
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
                <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    "&:nth-of-type(even)": {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Tooltip title="Sửa">
                      <IconButton size="small" color="primary">
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

export default PracticePage;
