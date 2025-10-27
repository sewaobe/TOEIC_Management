import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Chip,
  Divider,
  useTheme,
  Paper,
} from "@mui/material";
import { Close, VolumeUp } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Vocabulary } from "../../../../../../types/Vocabulary";
import { useCallback } from "react";

interface Props {
  open: boolean;
  vocab: Vocabulary | null;
  onClose: () => void;
}

const getLevelFromWeight = (weight: number) => {
  if (weight <= 0.33) return "Basic";
  if (weight <= 0.66) return "Intermediate";
  return "Advanced";
};

export default function VocabularyDetailDialog({ open, vocab, onClose }: Props) {
  const theme = useTheme();

  const handlePlayAudio = useCallback(() => {
    if (vocab?.audio) {
      const audio = new Audio(vocab.audio);
      audio.play();
    }
  }, [vocab?.audio]);

  if (!vocab) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[6],
        },
        component: motion.div,
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 30 },
        transition: { duration: 0.25 },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1E3A8A, #1E40AF)"
              : "linear-gradient(135deg, #2563EB, #1E40AF)",
          color: "white",
          py: 2.5,
        }}
      >
        <div className="flex items-center justify-between">
          <Typography variant="h6" fontWeight={700}>
            Chi tiết từ vựng
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>

      {/* Nội dung */}
      <DialogContent
        sx={{
          py: 3,
          px: 4,
          bgcolor: theme.palette.background.default,
        }}
      >
        <div className="space-y-4">
          {/* 🧩 Từ + Phiên âm */}
          <div>
            <div className="flex items-center gap-2">
              <Typography variant="h4" fontWeight={700}>
                {vocab.word}
              </Typography>
              <IconButton
                size="small"
                color="primary"
                onClick={handlePlayAudio}
                sx={{
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(37,99,235,0.2)"
                      : "rgba(37,99,235,0.08)",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(37,99,235,0.3)"
                        : "rgba(37,99,235,0.15)",
                  },
                }}
              >
                <VolumeUp fontSize="small" />
              </IconButton>
            </div>
            <Typography variant="body1" color="text.secondary">
              {vocab.phonetic || "Chưa có phiên âm"}
            </Typography>
          </div>

          {/* 🏷️ Chip tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Chip
              label={getLevelFromWeight(vocab.weight)}
              color="success"
              variant="filled"
            />
            <Chip label={vocab.type} variant="outlined" />
            <Chip
              label={
                vocab.part_type === "listening" ? "Listening" : "Reading"
              }
              color={
                vocab.part_type === "listening" ? "primary" : "secondary"
              }
              variant="filled"
            />
          </div>

          <Divider sx={{ my: 2 }} />

          {/* 📘 Định nghĩa */}
          <div>
            <Typography variant="subtitle1" fontWeight={600}>
              Định nghĩa
            </Typography>
            <Typography variant="body1" color="text.primary">
              {vocab.definition || "Chưa có định nghĩa"}
            </Typography>
          </div>

          {/* 💬 Ví dụ */}
          {vocab.examples?.length > 0 && (
            <div>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Ví dụ
              </Typography>
              <div className="space-y-3">
                {vocab.examples.map((ex, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: theme.palette.background.paper,
                      }}
                    >
                      <Typography variant="body1" fontStyle="italic">
                        {ex.en}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ex.vi}
                      </Typography>
                    </Paper>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 🖼️ Hình ảnh minh họa */}
          {vocab.image && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Hình ảnh minh họa
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <img
                  src={vocab.image}
                  alt={vocab.word}
                  className="w-full h-64 object-cover"
                />
              </Paper>
            </motion.div>
          )}

          {/* 🔊 Âm thanh riêng (nếu có file khác) */}
          {vocab.audio && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                className="mt-4"
              >
                Âm thanh
              </Typography>
              <audio controls className="w-full">
                <source src={vocab.audio} type="audio/mpeg" />
                Trình duyệt không hỗ trợ phát âm thanh.
              </audio>
            </motion.div>
          )}

          {/* 🔖 Tags */}
          {vocab.tags?.length > 0 && (
            <div>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Tags
              </Typography>
              <div className="flex flex-wrap gap-2">
                {vocab.tags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
