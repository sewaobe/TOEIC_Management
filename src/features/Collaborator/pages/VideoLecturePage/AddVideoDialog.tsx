import React, { useState, useEffect, useMemo } from "react";
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
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { Link, CloudUpload } from "@mui/icons-material";
import { toast } from "sonner";
import mediaFolderService from "../../../../services/mediaFolder.service";
import { uploadToCloudinary } from "../../../../services/cloudinary.service";

interface Props {
  open: boolean;
  onClose: (changed?: boolean) => void;
  folderId: string | null;
  folderName: string;
  initialData?: { id?: string; title?: string; url?: string };
}

function AddVideoDialog({
  open,
  onClose,
  folderId,
  folderName,
  initialData,
}: Props) {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Chỉ fill data khi MỞ modal (từ false → true)
  // Không chạy lại mỗi lần nhập
  useEffect(() => {
    if (!open) return;
    setTitle(initialData?.title || "");
    setUrl(initialData?.url || "");
    setFile(null);
    setTab(initialData?.url ? 0 : 1);
  }, [open]); // 👈 chỉ phụ thuộc open thôi, bỏ initialData để tránh reset liên tục

  // ✅ Preview video chỉ re-render khi url hoặc file đổi
  const preview = useMemo(() => {
    if (tab === 0 && url) {
      // ✅ 1. YouTube link
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

      // ✅ 2. File video URL (Cloudinary / .mp4 / .webm / CDN)
      if (
        /\.(mp4|webm|ogg|mov|mkv)$/i.test(url) ||
        url.includes("cloudinary.com")
      ) {
        return (
          <video
            className="w-full rounded-lg"
            height="250"
            controls
            src={url}
          />
        );
      }

      // ✅ 3. Fallback: thông báo không preview được
      return (
        <Typography variant="body2" color="text.secondary">
          Không thể hiển thị preview cho URL này.
        </Typography>
      );
    }

    // ✅ 4. File upload (blob)
    if (tab === 1 && file) {
      const videoUrl = URL.createObjectURL(file);
      return (
        <video
          className="w-full rounded-lg"
          height="250"
          controls
          src={videoUrl}
        />
      );
    }

    return null;
  }, [tab, url, file]);

  // ✅ Logic lưu video
  const handleSave = async () => {
    if (!folderId) {
      toast.warning("Vui lòng chọn thư mục trước!");
      return;
    }

    try {
      setLoading(true);
      let videoUrl = "";

      if (tab === 0) {
        // 🟢 Tab nhập URL
        if (!url) {
          toast.warning("Vui lòng nhập URL video!");
          return;
        }
        videoUrl = url;
      } else {
        // 🟣 Tab tải file
        if (!file) {
          toast.warning("Vui lòng chọn file video!");
          return;
        }
        const { url: uploadedUrl } = await uploadToCloudinary(file);
        videoUrl = uploadedUrl;
      }

      if (initialData?.id) {
        await mediaFolderService.updateMedia(initialData.id, {
          topic: title,
          url: videoUrl,
          type: "VIDEO",
        });
        toast.success(`Đã cập nhật video “${title}”!`);
      } else {
        await mediaFolderService.addMedia(folderId, {
          topic: title,
          url: videoUrl,
          type: "VIDEO",
          transcript: "",
        });
        toast.success(`Đã thêm video “${title}” vào thư mục ${folderName}!`);
      }

      onClose(true);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu video!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      {/* 🌀 Overlay loading */}
      <Backdrop
        open={loading}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.modal + 1,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="body2">
          Đang tải video lên Cloudinary...
        </Typography>
      </Backdrop>

      <DialogTitle>
        {initialData ? "Chỉnh sửa video" : "Thêm video mới"}
      </DialogTitle>

      <DialogContent className="space-y-4">
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontStyle: "italic", mb: 1 }}
        >
          Lưu vào thư mục:{" "}
          <strong>{folderName || "(chưa chọn thư mục)"}</strong>
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
            {preview}
          </Box>
        )}

        {tab === 1 && (
          <Box className="space-y-3 mt-3">
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
            >
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
            {preview}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={loading || !title || (!url && !file)}
          onClick={handleSave}
        >
          {initialData ? "Cập nhật" : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// 🧊 Quan trọng: chỉ re-render khi prop `open` đổi
export default React.memo(AddVideoDialog);
