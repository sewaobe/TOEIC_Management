import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle?: string;
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  itemTitle,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Xác nhận xóa
        </Typography>
        <Typography variant="body2" mt={1}>
          Bạn có chắc muốn xóa <b>{itemTitle}</b> không?
        </Typography>
      </DialogTitle>
      <DialogActions sx={{ pr: 2, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={() => {
            console.log("Xóa ngữ pháp:", itemTitle);
            onConfirm();
          }}
          variant="contained"
          color="error"
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
