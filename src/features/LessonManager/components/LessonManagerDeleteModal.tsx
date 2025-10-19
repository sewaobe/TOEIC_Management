import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { LessonManager } from "../../../types/LessonManager";

interface Props {
  open: boolean;
  lesson?: LessonManager | null;
  onClose: () => void;
  onConfirm: () => void;
}

const LessonManagerDeleteModal: React.FC<Props> = ({
  open,
  lesson,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xóa bài học</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa bài học{" "}
          <strong>{lesson?.title || "này"}</strong> không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LessonManagerDeleteModal;
