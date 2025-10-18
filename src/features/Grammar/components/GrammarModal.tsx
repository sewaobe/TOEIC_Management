import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { useState, useEffect, ChangeEvent } from "react";

export interface GrammarFormData {
  title: string;
  level: string;
  status: string;
}

interface GrammarModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: GrammarFormData) => void;
  initialData?: GrammarFormData | null; // nếu có => edit mode
}

export default function GrammarModal({
  open,
  onClose,
  onSave,
  initialData,
}: GrammarModalProps) {
  const [formData, setFormData] = useState<GrammarFormData>({
    title: "",
    level: "",
    status: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ title: "", level: "", status: "" });
  }, [initialData, open]);

  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(initialData ? "Sửa ngữ pháp:" : "Thêm ngữ pháp:", formData);
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2, p: 1 } }}>
      <DialogTitle fontWeight={600}>
        {initialData ? "Chỉnh sửa ngữ pháp" : "Tạo ngữ pháp mới"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Tiêu đề"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Trình độ"
            name="level"
            value={formData.level}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="Cơ bản">Cơ bản</MenuItem>
            <MenuItem value="Trung cấp">Trung cấp</MenuItem>
            <MenuItem value="Nâng cao">Nâng cao</MenuItem>
          </TextField>
          <TextField
            label="Trạng thái"
            name="status"
            value={formData.status}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
            <MenuItem value="Chờ duyệt">Chờ duyệt</MenuItem>
            <MenuItem value="Bản nháp">Bản nháp</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pr: 2, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? "Cập nhật" : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
