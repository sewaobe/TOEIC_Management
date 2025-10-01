import { Box, Paper, TextField, Button } from "@mui/material";

interface Props {
  form: { title: string; description: string; topic: string; duration: number; status: string };
  onChange: (field: string, value: string | number) => void;
  onNext: () => void;
}

const FullTestStep1Info: React.FC<Props> = ({ form, onChange, onNext }) => {
  return (
    <Paper
      sx={{ p: 3, borderRadius: 2, maxWidth: 700, mx: "auto", mt: 4, boxShadow: 2 }}
    >
      <TextField
        fullWidth
        label="Tiêu đề đề thi"
        value={form.title}
        onChange={(e) => onChange("title", e.target.value)}
        sx={{ mb: 3 }}
        required
      />

      <TextField
        fullWidth
        label="Chủ đề"
        placeholder="VD: Demo Test, Official TOEIC 2023, ETS Vol 1..."
        value={form.topic}
        onChange={(e) => onChange("topic", e.target.value)}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Mô tả ngắn"
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        label="Thời gian làm bài (phút)"
        value={120}
        disabled
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={onNext}>
          Tiếp tục
        </Button>
      </Box>
    </Paper>
  );
};

export default FullTestStep1Info;
