import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onView: () => void;
}

export default function DeleteConfirmDialog({ open, onClose, onConfirm, onView }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
    >
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận xóa nhóm câu hỏi</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 1.5 }}>
            Bạn có chắc chắn muốn xóa nhóm câu hỏi này không?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nếu nhóm này có các câu hỏi hoặc media (audio/hình ảnh) liên quan, tất cả
            sẽ bị xóa theo.{" "}
            <Typography component="span" fontWeight="bold" color="error.main">
              Hành động này không thể hoàn tác.
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Bạn có thể{" "}
            <Button size="small" startIcon={<Visibility />} onClick={onView}>
              Xem chi tiết nhóm
            </Button>{" "}
            trước khi quyết định.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="error"
            startIcon={<Delete />}
          >
            Xóa luôn
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
