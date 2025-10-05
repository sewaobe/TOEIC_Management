import { useState, useEffect } from "react";
import { Box, Paper, Typography, Menu, MenuItem } from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { toast } from "sonner";

import ToolbarSection from "./ToolbarSection";
import SidebarFolderTree from "./SidebarFolderTree/SidebarFolderTree";
import VideoGrid from "./VideoGrid";
import VideoList from "./VideoList";
import VideoPlayerModal from "./VideoPlayerModal";
import AddVideoDialog from "./AddVideoDialog";

import mediaFolderService from "../../../../services/mediaFolder.service";
import { uploadToCloudinary } from "../../../../services/cloudinary.service";
import { Media } from "../../../../types/media";

export interface VideoFile {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  views?: number;
  level?: string;
  theory?: string;
  grammar?: string;
  folderId?: string;
}

interface Props {
  onToggleFloating?: () => void;
}

export default function VideoLecturePageContent({ onToggleFloating }: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [editingVideo, setEditingVideo] = useState<VideoFile | null>(null);

  // ✅ Extract YouTube ID để tạo thumbnail
  const extractYouTubeId = (url: string): string => {
    const match = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : "";
  };

  // 🔄 Lấy danh sách video trong thư mục
  const fetchVideos = async () => {
    if (!selectedFolderId) return setVideos([]);

    try {
      const res = await mediaFolderService.getMedias(selectedFolderId);
      const mapped: VideoFile[] = (res.data as Media[]).map((m) => ({
        id: (m as any)._id || "",
        title: m.topic || "Untitled",
        url: m.url,
        folderId: selectedFolderId,
        views: 0,
        thumbnail:
          m.type === "VIDEO" && m.url.includes("youtu")
            ? `https://img.youtube.com/vi/${extractYouTubeId(m.url)}/hqdefault.jpg`
            : undefined,
      }));
      setVideos(mapped);
    } catch {
      toast.error("Không thể tải danh sách video");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedFolderId]);

  /* ===================================================
     🟢 THÊM / SỬA video
  =================================================== */
  const handleSaveVideo = async (data: {
    id?: string;
    title: string;
    url?: string;
    file?: File | null;
  }) => {
    if (!selectedFolderId) {
      toast.warning("Vui lòng chọn thư mục trước!");
      return;
    }

    try {
      let videoUrl = data.url;
      if (data.file) {
        const { url } = await uploadToCloudinary(data.file);
        videoUrl = url;
      }

      if (data.id) {
        await mediaFolderService.updateMedia(data.id, {
          topic: data.title,
          url: videoUrl!,
          type: "VIDEO",
        });
        toast.success(`Đã cập nhật video “${data.title}”!`);
      } else {
        await mediaFolderService.addMedia(selectedFolderId, {
          topic: data.title,
          url: videoUrl!,
          type: "VIDEO",
          transcript: "",
        });
        toast.success(`Đã thêm video “${data.title}” vào thư mục ${selectedFolderName}!`);
      }

      setOpenAddModal(false);
      setEditingVideo(null);
      fetchVideos();
    } catch {
      toast.error("Lỗi khi lưu video!");
    }
  };

  /* ===================================================
     🔴 XÓA video
  =================================================== */
  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa video này không?")) return;
    try {
      await mediaFolderService.deleteMedia(videoId);
      toast.success("Đã xóa video thành công!");
      fetchVideos();
    } catch {
      toast.error("Lỗi khi xóa video!");
    }
  };

  return (
    <Box className="flex flex-col h-full" sx={{ bgcolor: "background.default" }}>
      <ToolbarSection
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddClick={() => {
          if (!selectedFolderId) toast.warning("Vui lòng chọn thư mục trước!");
          else {
            setEditingVideo(null);
            setOpenAddModal(true);
          }
        }}
        onToggleFloating={onToggleFloating}
      />

      <Box className="flex flex-1 overflow-hidden gap-3">
        <SidebarFolderTree
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={(id: string | null, name?: string) => {
            setSelectedFolderId(id);
            setSelectedFolderName(name || "");
          }}
        />

        <Paper className="flex-1 p-6 overflow-y-auto rounded-md">
          {!selectedFolderId ? (
            <Typography color="text.secondary">Chọn thư mục bên trái để xem danh sách video.</Typography>
          ) : videos.length === 0 ? (
            <Typography color="text.secondary">Thư mục này chưa có video nào.</Typography>
          ) : viewMode === "grid" ? (
            <VideoGrid
              files={videos}
              onPlay={(url) => setPlayingVideo(url)}
              onMenu={(e) => setAnchorEl(e.currentTarget)}
              onEdit={(video) => {
                setEditingVideo(video);
                setOpenAddModal(true);
              }}
              onDelete={(video) => handleDeleteVideo(video.id)}
            />
          ) : (
            <VideoList
              files={videos}
              onPlay={(url) => setPlayingVideo(url)}
              onMenu={(e) => setAnchorEl(e.currentTarget)}
            />
          )}
        </Paper>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem>
          <Visibility className="mr-2" /> Xem chi tiết
        </MenuItem>
        <MenuItem sx={{ color: "error.main" }}>
          <Delete className="mr-2" /> Xóa
        </MenuItem>
      </Menu>

      <VideoPlayerModal url={playingVideo} onClose={() => setPlayingVideo(null)} />

      <AddVideoDialog
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setEditingVideo(null);
        }}
        folderName={selectedFolderName}
        onSave={handleSaveVideo}
        initialData={
          editingVideo
            ? { id: editingVideo.id, title: editingVideo.title, url: editingVideo.url }
            : undefined
        }
      />
    </Box>
  );
}
