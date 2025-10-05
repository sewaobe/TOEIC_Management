    import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  name: string;
  type: "theory" | "grammar" | "folder"; // ✅ thêm "folder" vào đây
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * ✅ Dialog xác nhận xóa (thư mục / mục con)
 */
export default function ConfirmDeleteDialog({
  open,
  name,
  type,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        Xóa {type === "theory" ? "thư mục" : "mục con"}?
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Bạn có chắc muốn xóa{" "}
          <strong style={{ color: "#ef4444" }}>{name}</strong> không?
          <br />
          Hành động này <strong>không thể hoàn tác</strong>.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
