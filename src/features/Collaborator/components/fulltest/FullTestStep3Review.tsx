import { Box, Paper, Typography, Button } from "@mui/material";
import { Save } from "@mui/icons-material";
import { motion } from "framer-motion";

interface Props {
  form: {
    title: string;
    description: string;
    topic: string;
    duration: number;
    status: string;
  };
  questions: Record<string, { groups?: Array<{ questions?: any[] }> }>;
  onBack: () => void;
  onSave: () => void;
}

const FullTestStep3Review: React.FC<Props> = ({
  form,
  questions,
  onBack,
  onSave,
}) => {
  // helpers an toàn
  const getGroups = (partData: any): any[] =>
    partData && Array.isArray(partData.groups) ? partData.groups : [];

  const countGroups = (partData: any): number => getGroups(partData).length;

  const countQuestions = (partData: any): number =>
    getGroups(partData).reduce((sum, g) => {
      const qs = Array.isArray(g?.questions) ? g.questions.length : 0;
      return sum + qs;
    }, 0);

  // tổng
  const entries = Object.entries(questions ?? {});
  const totalGroups = entries.reduce(
    (acc, [, data]) => acc + countGroups(data),
    0
  );
  const totalQuestions = entries.reduce(
    (acc, [, data]) => acc + countQuestions(data),
    0
  );

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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Xem trước đề thi
      </Typography>

      {/* Metadata */}
      <Typography>Tiêu đề: {form.title}</Typography>
      <Typography>Chủ đề: {form.topic}</Typography>
      <Typography>Mô tả: {form.description}</Typography>
      <Typography>Thời gian: {form.duration} phút</Typography>
      <Typography>Trạng thái: {form.status}</Typography>

      {/* Tổng quan */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Tổng quan câu hỏi:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Tổng: <b>{totalGroups}</b> nhóm • <b>{totalQuestions}</b> câu
        </Typography>

        {entries.map(([partKey, data]) => {
          const g = countGroups(data);
          const q = countQuestions(data);
          return (
            <Typography key={partKey} variant="body2">
              {partKey}: {g} nhóm • {q} câu
            </Typography>
          );
        })}
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={onSave}
          >
            Lưu đề thi
          </Button>
        </motion.div>
      </Box>
    </Paper>
  );
};

export default FullTestStep3Review;
