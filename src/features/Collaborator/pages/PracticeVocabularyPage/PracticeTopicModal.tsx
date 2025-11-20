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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { PracticeTopicVocabulary } from "../../../../types/PracticeVocabulary";

interface PracticeTopicModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: Partial<PracticeTopicVocabulary>;
  setFormData: (data: Partial<PracticeTopicVocabulary>) => void;
  title: string;
}

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

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

          <TextField
            label="Tags (phân cách bằng dấu phẩy)"
            value={formData.tags?.join(", ") || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(",").map((t) => t.trim()),
              })
            }
            fullWidth
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

          <TextField
            label="Tên icon"
            value={formData.iconName || "📚"}
            onChange={(e) =>
              setFormData({ ...formData, iconName: e.target.value })
            }
            fullWidth
          />

          <TextField
            label="Màu nền (hex)"
            value={formData.bgColor || "#3b82f6"}
            onChange={(e) =>
              setFormData({ ...formData, bgColor: e.target.value })
            }
            fullWidth
            type="color"
          />
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
