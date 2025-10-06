import { useState, useEffect } from "react";
import { Box, Paper, Typography, Menu, MenuItem, Pagination } from "@mui/material";
import { Visibility, Delete, Search as SearchIcon } from "@mui/icons-material";
import { toast } from "sonner";

import ToolbarSection from "./ToolbarSection";
import SidebarFolderTree from "./SidebarFolderTree/SidebarFolderTree";
import VideoGrid from "./VideoGrid";
import VideoList from "./VideoList";
import VideoPlayerModal from "./VideoPlayerModal";
import AddVideoDialog from "./AddVideoDialog";

import mediaFolderService from "../../../../services/mediaFolder.service";
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
  folderId?: string | null;
}

export default function VideoLecturePageContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [editingVideo, setEditingVideo] = useState<VideoFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 8;

  const extractYouTubeId = (url: string): string => {
    const match = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : "";
  };

  const fetchVideos = async (pageNum = 1) => {
    setLoading(true);
    try {
      let res;
      if (searchTerm.trim()) {
        res = await mediaFolderService.searchMedias(searchTerm.trim(), pageNum, limit);
      } else if (selectedFolderId) {
        res = await mediaFolderService.getMedias(selectedFolderId, pageNum, limit);
      } else {
        setVideos([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      const { items, total } = res.data;
      const mapped: VideoFile[] = (items as Media[]).map((m) => {
        let thumbnail: string | undefined;
        if (m.type === "VIDEO") {
          if (m.url.includes("youtu")) {
            const id = extractYouTubeId(m.url);
            thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
          } else if (m.url.includes("cloudinary.com")) {
            thumbnail = m.url
              .replace("/upload/", "/upload/so_1/")
              .replace(/\.(mp4|mov|avi|mkv|webm)$/i, ".jpg");
          }
        }
        return {
          id: (m as any)._id || "",
          title: m.topic || "Untitled",
          url: m.url,
          folderId: selectedFolderId,
          views: 0,
          thumbnail:
            thumbnail ||
            "https://via.placeholder.com/280x180?text=No+Thumbnail",
        };
      });

      setVideos(mapped);
      setTotal(total);
    } catch {
      toast.error("Không thể tải danh sách video");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFolderId && !searchTerm) {
      setPage(1);
      fetchVideos(1);
    }
  }, [selectedFolderId]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchTerm !== "") {
        setPage(1);
        fetchVideos(1);
      } else if (selectedFolderId) {
        fetchVideos(1);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa video này không?")) return;
    try {
      await mediaFolderService.deleteMedia(videoId);
      toast.success("Đã xóa video thành công!");
      fetchVideos(page);
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
          if (!selectedFolderId && !searchTerm)
            toast.warning("Vui lòng chọn thư mục trước hoặc xóa từ khóa tìm kiếm!");
          else {
            setEditingVideo(null);
            setOpenAddModal(true);
          }
        }}
        onRefresh={() => fetchVideos(page)}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Box className="flex flex-1 overflow-hidden gap-3">
        {/* 🧩 Ẩn màu highlight folder khi đang tìm kiếm */}
        <SidebarFolderTree
          selectedFolderId={searchTerm ? null : selectedFolderId}
          setSelectedFolderId={(id: string | null, name?: string) => {
            setSelectedFolderId(id);
            setSelectedFolderName(name || "");
            setSearchTerm("");
          }}
        />

        <Paper className="flex-1 p-6 overflow-y-auto rounded-md">
          {/* 🟦 Hiển thị tiêu đề tìm kiếm nếu có */}
          {searchTerm && (
            <Box className="flex items-center gap-2 mb-4">
              <SearchIcon color="primary" />
              <Typography variant="h6" color="primary">
                Kết quả tìm kiếm cho: "{searchTerm}"
              </Typography>
            </Box>
          )}

          {loading ? (
            <Typography color="text.secondary">Đang tải...</Typography>
          ) : videos.length === 0 ? (
            <Typography color="text.secondary">
              {searchTerm
                ? "Không tìm thấy video phù hợp."
                : "Thư mục này chưa có video nào."}
            </Typography>
          ) : (
            <>
              {viewMode === "grid" ? (
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

              {total > limit && (
                <Box className="flex justify-center mt-6 border-t pt-4">
                  <Pagination
                    count={Math.ceil(total / limit)}
                    page={page}
                    onChange={(_, p) => {
                      setPage(p);
                      fetchVideos(p);
                    }}
                    color="primary"
                    shape="rounded"
                    size="medium"
                  />
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
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
        onClose={(changed) => {
          setOpenAddModal(false);
          setEditingVideo(null);
          if (changed) fetchVideos(page);
        }}
        folderId={selectedFolderId}
        folderName={selectedFolderName}
        initialData={editingVideo || undefined}
      />
    </Box>
  );
}
