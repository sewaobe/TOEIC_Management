import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { Link, CloudUpload } from "@mui/icons-material";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  folderName: string;
  onSave: (data: { id?: string; title: string; url?: string; file?: File | null }) => void;
  initialData?: { id?: string; title?: string; url?: string };
}

export default function AddVideoDialog({ open, onClose, folderName, onSave, initialData }: Props) {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // ✅ Khi sửa, fill sẵn dữ liệu
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setUrl(initialData.url || "");
      setFile(null);
      setTab(initialData.url ? 0 : 1);
    } else {
      setTitle("");
      setUrl("");
      setFile(null);
      setTab(0);
    }
  }, [initialData, open]);

  const getPreview = () => {
    if (tab === 0 && url) {
      const match = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{11})/);
      const id = match?.[1];
      if (id)
        return (
          <iframe
            className="w-full rounded-lg"
            height="250"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube preview"
            allowFullScreen
          />
        );
    }
    if (tab === 1 && file) {
      const videoUrl = URL.createObjectURL(file);
      return <video className="w-full rounded-lg" height="250" controls src={videoUrl} />;
    }
    return null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Chỉnh sửa video" : "Thêm video mới"}</DialogTitle>

      <DialogContent className="space-y-4">
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
          Lưu vào thư mục: <strong>{folderName || "(chưa chọn thư mục)"}</strong>
        </Typography>

        <TextField
          fullWidth
          label="Tiêu đề video"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab icon={<Link />} iconPosition="start" label="Nhập URL" />
          <Tab icon={<CloudUpload />} iconPosition="start" label="Tải file" />
        </Tabs>

        {tab === 0 && (
          <Box className="space-y-3 mt-3">
            <TextField
              fullWidth
              label="URL YouTube"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {getPreview()}
          </Box>
        )}

        {tab === 1 && (
          <Box className="space-y-3 mt-3">
            <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
              Chọn file video
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
            </Button>
            {getPreview()}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!title || (!url && !file)}
          onClick={() => onSave({ id: initialData?.id, title, url, file })}
        >
          {initialData ? "Cập nhật" : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
