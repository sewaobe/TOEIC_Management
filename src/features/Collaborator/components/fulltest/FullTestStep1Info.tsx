import { Box, Paper, TextField, Button } from "@mui/material";
import { useState } from "react";
import { toast } from "sonner"; // ✅ dùng thư viện toast bạn đã có

interface Props {
  form: { title: string; description: string; topic: string; duration: number; status: string };
  onChange: (field: string, value: string | number) => void;
  onNext: () => void;
}

const FullTestStep1Info: React.FC<Props> = ({ form, onChange, onNext }) => {
  const [errors, setErrors] = useState({ title: false, topic: false });

  const handleNext = () => {
    const titleValid = form.title.trim() !== "";
    const topicValid = form.topic.trim() !== "";

    // Nếu thiếu dữ liệu → báo lỗi
    if (!titleValid || !topicValid) {
      setErrors({
        title: !titleValid,
        topic: !topicValid,
      });

      toast.error("Vui lòng nhập đủ tiêu đề và chủ đề trước khi tiếp tục!");
      return;
    }

    // Hợp lệ → chuyển bước
    setErrors({ title: false, topic: false });
    onNext();
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        maxWidth: 700,
        mx: "auto",
        mt: 4,
        boxShadow: 2,
      }}
    >
      {/* Tiêu đề đề thi */}
      <TextField
        fullWidth
        label="Tiêu đề đề thi *"
        value={form.title}
        onChange={(e) => onChange("title", e.target.value)}
        sx={{ mb: 3 }}
        error={errors.title}
        helperText={errors.title ? "Vui lòng nhập tiêu đề đề thi" : ""}
      />

      {/* Chủ đề */}
      <TextField
        fullWidth
        label="Chủ đề *"
        placeholder="VD: Demo Test, Official TOEIC 2023, ETS Vol 1..."
        value={form.topic}
        onChange={(e) => onChange("topic", e.target.value)}
        sx={{ mb: 3 }}
        error={errors.topic}
        helperText={errors.topic ? "Vui lòng nhập chủ đề" : ""}
      />

      {/* Mô tả ngắn */}
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Mô tả ngắn"
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Thời gian làm bài */}
      <TextField
        fullWidth
        label="Thời gian làm bài (phút)"
        value={form.duration}
        disabled
        sx={{ mb: 3 }}
      />

      {/* Nút Tiếp tục */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleNext}>
          Tiếp tục
        </Button>
      </Box>
    </Paper>
  );
};

export default FullTestStep1Info;
