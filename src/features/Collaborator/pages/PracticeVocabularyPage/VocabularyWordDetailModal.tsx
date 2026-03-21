import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { Close, VolumeUp } from "@mui/icons-material";
import { VocabularyWord } from "../../../../types/PracticeVocabulary";

interface VocabularyWordDetailModalProps {
  open: boolean;
  onClose: () => void;
  word: VocabularyWord | null;
}

export default function VocabularyWordDetailModal({
  open,
  onClose,
  word,
}: VocabularyWordDetailModalProps) {
  if (!word) return null;

  const handlePlayAudio = () => {
    if (word.audio) {
      const audio = new Audio(word.audio);
      audio.play();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {word.word}
            </Typography>
            {word.phonetic && (
              <Typography variant="body2" color="text.secondary">
                {word.phonetic}
              </Typography>
            )}
          </Box>
          {word.audio && (
            <IconButton onClick={handlePlayAudio} color="primary">
              <VolumeUp />
            </IconButton>
          )}
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Loại từ */}
          {word.type && (
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Loại từ
              </Typography>
              <Chip label={word.type} color="primary" size="small" />
            </Box>
          )}

          {/* Level & Part */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {word.level && (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Cấp độ
                </Typography>
                <Chip label={word.level} size="small" />
              </Box>
            )}
            {word.part && (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Phần
                </Typography>
                <Chip label={`Part ${word.part}`} size="small" />
              </Box>
            )}
          </Box>

          <Divider />

          {/* Định nghĩa */}
          {word.definitions && word.definitions.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Định nghĩa
              </Typography>
              {word.definitions.map((def, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  paragraph
                  sx={{ ml: 2 }}
                >
                  {index + 1}. {def}
                </Typography>
              ))}
            </Box>
          )}

          {/* Gợi ý */}
          {word.hints && word.hints.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Gợi ý
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {word.hints.map((hint, index) => (
                  <Chip
                    key={index}
                    label={hint}
                    variant="outlined"
                    color="info"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Ví dụ */}
          {word.examples && word.examples.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Ví dụ
              </Typography>
              {word.examples.map((example, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  paragraph
                  sx={{ ml: 2, fontStyle: "italic" }}
                >
                  • {example}
                </Typography>
              ))}
            </Box>
          )}

          {/* Hình ảnh */}
          {word.image && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Hình ảnh
              </Typography>
              <Box
                component="img"
                src={word.image}
                alt={word.word}
                sx={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            </Box>
          )}

          {/* Tags */}
          {word.tags && word.tags.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {word.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    color="secondary"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Ghi chú */}
          {word.notes && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Ghi chú
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {word.notes}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
