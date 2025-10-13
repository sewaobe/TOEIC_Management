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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GrammarModal, { GrammarFormData } from "./components/GrammarModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

export interface GrammarFormDataWithId extends GrammarFormData {
  id: number;
}

const initialData: GrammarFormDataWithId[] = [
  { id: 1, title: "Thì hiện tại đơn", level: "Cơ bản", status: "Đã hoàn thành" },
  { id: 2, title: "Câu điều kiện loại 1", level: "Trung cấp", status: "Chờ duyệt" },
];

const GrammarPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState<GrammarFormDataWithId[]>(initialData);

  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState<GrammarFormDataWithId | null>(null);
  const [deleteItem, setDeleteItem] = useState<GrammarFormDataWithId | null>(null);

  const handleAdd = () => {
    setEditItem(null);
    setOpenModal(true);
  };

  const handleEdit = (item: GrammarFormDataWithId, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditItem(item);
    setOpenModal(true);
  };

  const handleDelete = (item: GrammarFormDataWithId, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteItem(item);
  };

  const handleSave = (formData: GrammarFormData) => {
    if (editItem) {
      console.log("Cập nhật:", { ...editItem, ...formData });
      setData((prev) =>
        prev.map((i) => (i.id === editItem.id ? { ...i, ...formData } : i))
      );
    } else {
      const newItem = { id: data.length + 1, ...formData };
      console.log("Thêm mới:", newItem);
      setData((prev) => [...prev, newItem]);
    }
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    console.log("Đã xác nhận xóa:", deleteItem);
    setData((prev) => prev.filter((i) => i.id !== deleteItem.id));
    setDeleteItem(null);
  };

  const handleRowClick = (item: GrammarFormDataWithId) => {
    console.log("Đi đến chi tiết:", item);
    navigate(`${item.id}`, { state: { grammar: item } });
  };

  return (
    <Box sx={{ p: 3, width: "100%", height: "100%", bgcolor: theme.palette.background.default }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Lý thuyết & Ngữ pháp
      </Typography>

      {/* Thanh tìm kiếm + nút tạo mới */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm ngữ pháp..."
          size="small"
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: 1,
            width: "40%",
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
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd}>
            Tạo mới
          </Button>
        </motion.div>
      </Box>

      {/* Bảng danh sách */}
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trình độ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(item)}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Sửa">
                      <IconButton size="small" color="primary" onClick={(e) => handleEdit(item, e)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton size="small" color="secondary" onClick={(e) => handleDelete(item, e)}>
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

      {/* Modal Thêm / Sửa */}
      <GrammarModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        initialData={editItem}
      />

      {/* Modal Xác nhận xóa */}
      <ConfirmDeleteModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemTitle={deleteItem?.title}
      />
    </Box>
  );
};

export default GrammarPage;
