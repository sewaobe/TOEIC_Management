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
  Autocomplete,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { PracticeTopicVocabulary } from "../../../../types/PracticeVocabulary";
import { toeicPartsArray } from "../../../../utils/toeicPart";

interface PracticeTopicModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: Partial<PracticeTopicVocabulary>;
  setFormData: (data: Partial<PracticeTopicVocabulary>) => void;
  title: string;
}

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

// Tổng hợp tất cả tags từ toeicPart
const allTags = [...new Set(toeicPartsArray.flatMap((part) => part.tags))];

export default function PracticeTopicModal({
  open,
  onClose,
  onSave,
  formData,
  setFormData,
  title,
}: PracticeTopicModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Tiêu đề"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            fullWidth
          />

          <TextField
            label="Mô tả"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            multiline
            rows={3}
            fullWidth
          />

          {/* Tags từ toeicPart */}
          <Autocomplete
            multiple
            options={allTags}
            value={formData.tags || []}
            onChange={(_, newValue) =>
              setFormData({ ...formData, tags: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="Tags (từ TOEIC Parts)" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} key={index} />
              ))
            }
          />

          <TextField
            label="Cấp độ"
            value={formData.level || "A1"}
            onChange={(e) =>
              setFormData({ ...formData, level: e.target.value as any })
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
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={onSave} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
