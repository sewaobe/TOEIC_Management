import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect, ChangeEvent } from "react";
import { Lesson } from "../../../types/lesson"; // ✅ import type chung
import { lessonManagerService } from "../../../services/lesson_manager.service";

interface GrammarModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Lesson>) => void; // ✅ dùng type Lesson
  initialData?: Partial<Lesson> | null;
}

export default function GrammarModal({
  open,
  onClose,
  onSave,
  initialData,
}: GrammarModalProps) {
  // 🧩 State form (gán default giống backend)
  const [formData, setFormData] = useState<Partial<Lesson>>({
    title: "",
    summary: "",
    part_type: 1,
    status: "draft",
    planned_completion_time: 0,
    weight: 0.1,
  });

  const [topicTitles, setTopicTitles] = useState<{ id: string; title: string }[]>([]);
  // Fetch dữ liệu tên chủ đề lessonManager
  useEffect(() => {
    const fetchData = async () => {
      try {
        const topics = await lessonManagerService.getAllTopicTitles();
        setTopicTitles(topics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchData();
  }, [])

  // 🔄 Reset form khi mở / đóng modal
  useEffect(() => {
    if (initialData) setFormData(initialData);
    else
      setFormData({
        title: "",
        summary: "",
        part_type: 1,
        status: "draft",
        planned_completion_time: 0,
        weight: 0.1,
      });
  }, [initialData, open]);

  // 🖋️ Xử lý thay đổi input

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "planned_completion_time" ||
          name === "weight" ||
          name === "part_type"
          ? Number(value)
          : value,
    }));
    console.log(formData.part_type)
  };

  // 💾 Gửi dữ liệu lên cha
  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
    >
      <DialogTitle fontWeight={600}>
        {initialData ? "Chỉnh sửa bài học" : "Tạo bài học mới"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Tiêu đề */}
          <TextField
            label="Tiêu đề"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            fullWidth
          />

          {/* Mô tả tóm tắt */}
          <TextField
            label="Tóm tắt"
            name="summary"
            value={formData.summary || ""}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
          />

          <Autocomplete
            multiple
            options={topicTitles}
            getOptionLabel={(option) => option.title}
            getOptionKey={(option) => option.id}
            renderInput={(params) => (
              <TextField {...params} label="Chủ đề bài học lý thuyết & ngữ pháp" placeholder="Chọn chủ đề" />
            )}
            value={topicTitles.filter(t => formData.topic?.includes(t.id))}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                topic: newValue.map(item => item.id),
              });
            }}
            sx={{
              flex: 1,
              '& .MuiAutocomplete-inputRoot': {
                flexWrap: 'nowrap !important',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                maxWidth: "100%", // ✅ Giới hạn chiều ngang gọn gàng
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'transparent',
                  borderRadius: 3,
                },
                '&:hover::-webkit-scrollbar-thumb': {
                  backgroundColor: '#bbb', // Chỉ hiện khi hover
                },
                '& input': {
                  minWidth: 120, // Giúp placeholder không bị ép
                },
              },
              '& .MuiAutocomplete-tag': {
                fontSize: '0.85rem',
                backgroundColor: '#f1f3f4',
                color: '#333',
                borderRadius: '20px',
                padding: '2px 8px',
                marginRight: '4px',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              },
            }}
            componentsProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 4], // ✅ cách khung input 4px cho tự nhiên
                    },
                  },
                ],
              },
              paper: {
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                },
              },
            }}
          />

          {/* Loại Part */}
          <TextField
            label="Loại Part"
            name="part_type"
            value={formData.part_type ?? 1}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value={1}>Part 1: Photos</MenuItem>
            <MenuItem value={2}>Part 2: Q&A</MenuItem>
            <MenuItem value={3}>Part 3: Short Conversations</MenuItem>
            <MenuItem value={4}>Part 4: Short Talks</MenuItem>
            <MenuItem value={5}>Part 5: Incomplete Sentences</MenuItem>
            <MenuItem value={6}>Part 6: Text Completion</MenuItem>
            <MenuItem value={7}>Part 7: Reading Comprehension</MenuItem>
          </TextField>

          {/* Thời gian hoàn thành */}
          <TextField
            label="Thời gian hoàn thành (phút)"
            name="planned_completion_time"
            type="number"
            value={formData.planned_completion_time ?? 0}
            onChange={handleChange}
            fullWidth
          />

          {/* Trọng số */}
          <TextField
            label="Trọng số (0–1)"
            name="weight"
            type="number"
            value={formData.weight ?? 0.1}
            onChange={handleChange}
            fullWidth
          />

          {/* Trạng thái */}
          <TextField
            label="Trạng thái"
            name="status"
            value={formData.status || "draft"}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="draft">Bản nháp</MenuItem>
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="open">Đang mở</MenuItem>
            <MenuItem value="closed">Đã đóng</MenuItem>
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
