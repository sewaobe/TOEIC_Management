import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Typography,
  Chip,
  Autocomplete,
} from "@mui/material";
import { Close, Add, Delete } from "@mui/icons-material";
import { VocabularyWord } from "../../../../types/PracticeVocabulary";
import { vocabularyWordService } from "../../../../services/practice_vocabulary.service";

interface VocabularyWordModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: Partial<VocabularyWord>;
  setFormData: (data: Partial<VocabularyWord>) => void;
  title: string;
}

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const parts = [
  "Part 1",
  "Part 2",
  "Part 3",
  "Part 4",
  "Part 5",
  "Part 6",
  "Part 7",
];

// Tags sẽ được lấy từ các chủ đề từ vựng hiện có (vocabulary-topic tags)

export default function VocabularyWordModal({
  open,
  onClose,
  onSave,
  formData,
  setFormData,
  title,
}: VocabularyWordModalProps) {
  const [newDefinition, setNewDefinition] = useState("");
  const [newHint, setNewHint] = useState("");
  const [newExample, setNewExample] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const loadTags = async () => {
      try {
        // load existing vocabulary words and collect their tags (vocabulary-tags domain)
        const res = await vocabularyWordService.getAllVocabularyWords(1, 1000);
        const words = res.items || [];
        const tags = [...new Set(words.flatMap((w) => w.tags || []))];
        if (mounted) setAvailableTags(tags);
      } catch (err) {
        console.error("Không load được tags từ từ vựng hiện có:", err);
      }
    };

    if (open) loadTags();
    return () => {
      mounted = false;
    };
  }, [open]);

  const handleAddDefinition = () => {
    if (newDefinition.trim()) {
      setFormData({
        ...formData,
        definitions: [...(formData.definitions || []), newDefinition.trim()],
      });
      setNewDefinition("");
    }
  };

  const handleRemoveDefinition = (index: number) => {
    setFormData({
      ...formData,
      definitions: formData.definitions?.filter((_, i) => i !== index),
    });
  };

  const handleAddHint = () => {
    if (newHint.trim()) {
      setFormData({
        ...formData,
        hints: [...(formData.hints || []), newHint.trim()],
      });
      setNewHint("");
    }
  };

  const handleRemoveHint = (index: number) => {
    setFormData({
      ...formData,
      hints: formData.hints?.filter((_, i) => i !== index),
    });
  };

  const handleAddExample = () => {
    if (newExample.trim()) {
      setFormData({
        ...formData,
        examples: [...(formData.examples || []), newExample.trim()],
      });
      setNewExample("");
    }
  };

  const handleRemoveExample = (index: number) => {
    setFormData({
      ...formData,
      examples: formData.examples?.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {title}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          {/* Từ vựng */}
          <TextField
            label="Từ vựng *"
            value={formData.word || ""}
            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
            required
            fullWidth
          />

          {/* Phiên âm và Loại từ */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Phiên âm"
              value={formData.phonetic || ""}
              onChange={(e) =>
                setFormData({ ...formData, phonetic: e.target.value })
              }
              fullWidth
              placeholder="/wɜːrd/"
            />
            <TextField
              label="Loại từ"
              value={formData.type || ""}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              fullWidth
              placeholder="noun, verb, adjective, ..."
            />
          </Box>

          {/* Định nghĩa (array) */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Định nghĩa (tiếng Anh) *
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                value={newDefinition}
                onChange={(e) => setNewDefinition(e.target.value)}
                placeholder="Nhập định nghĩa và nhấn Thêm"
                fullWidth
                onKeyPress={(e) => e.key === "Enter" && handleAddDefinition()}
              />
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddDefinition}
              >
                Thêm
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.definitions?.map((def, index) => (
                <Chip
                  key={index}
                  label={`${index + 1}. ${def}`}
                  onDelete={() => handleRemoveDefinition(index)}
                  sx={{ maxWidth: "100%" }}
                />
              ))}
            </Box>
          </Box>

          {/* Gợi ý (array) */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Gợi ý
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                placeholder="Nhập gợi ý và nhấn Thêm"
                fullWidth
                onKeyPress={(e) => e.key === "Enter" && handleAddHint()}
              />
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddHint}
              >
                Thêm
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.hints?.map((hint, index) => (
                <Chip
                  key={index}
                  label={hint}
                  onDelete={() => handleRemoveHint(index)}
                />
              ))}
            </Box>
          </Box>

          {/* Ví dụ (array) */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Ví dụ
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="Nhập ví dụ và nhấn Thêm"
                fullWidth
                onKeyPress={(e) => e.key === "Enter" && handleAddExample()}
              />
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddExample}
              >
                Thêm
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {formData.examples?.map((example, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {example}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveExample(index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Hình ảnh và Audio */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Link hình ảnh"
              value={formData.image || ""}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              fullWidth
              placeholder="https://..."
            />
            <TextField
              label="Link audio"
              value={formData.audio || ""}
              onChange={(e) =>
                setFormData({ ...formData, audio: e.target.value })
              }
              fullWidth
              placeholder="https://..."
            />
          </Box>

          {/* Tags: lấy từ các chủ đề từ vựng hiện có (vocabulary-topic tags) */}
          <Autocomplete
            multiple
            freeSolo
            filterSelectedOptions
            options={availableTags}
            value={formData.tags || []}
            onChange={(_, newValue) =>
              // newValue may contain new strings (freeSolo) — accept as string[]
              setFormData({ ...formData, tags: newValue as string[] })
            }
            renderInput={(params) => (
              <TextField {...params} label="Tags (từ vocab hoặc tạo mới)" />
            )}
            renderTags={(value, getTagProps) =>
              (value as string[]).map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
          />

          {/* Level và Part */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Cấp độ CERF"
              value={formData.level || ""}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
              select
              fullWidth
            >
              {levels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="TOEIC Part"
              value={formData.part || ""}
              onChange={(e) =>
                setFormData({ ...formData, part: e.target.value })
              }
              select
              fullWidth
            >
              {parts.map((part) => (
                <MenuItem key={part} value={part}>
                  {part}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Ghi chú */}
          <TextField
            label="Ghi chú"
            value={formData.notes || ""}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            multiline
            rows={2}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={
            !formData.word ||
            !formData.definitions ||
            formData.definitions.length === 0
          }
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
