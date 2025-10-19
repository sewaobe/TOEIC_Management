import { Box, Paper, Typography, Chip, Button, IconButton } from "@mui/material";
import { Edit, MoreVert } from "@mui/icons-material";
import { VideoFile } from "./VideoLecturePageContent";

interface Props {
  files: VideoFile[];
  onPlay: (url: string) => void;
  onMenu: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function VideoList({ files, onPlay, onMenu }: Props) {
  return (
    <Paper>
      {files.map((file) => (
        <Box
          key={file.id}
          className="flex items-center justify-between border-b p-3 hover:bg-gray-50 transition-all duration-200"
          sx={{ cursor: "grab" }}
          draggable // ✅ Cho phép kéo
          onDragStart={(e) => {
            // ✅ Gắn thông tin video để bên "LessonManager" nhận được
            e.dataTransfer.setData(
              "video",
              JSON.stringify({
                id: file.id,
                url: file.url,
                title: file.title,
                type: "VIDEO",
              })
            );
            e.currentTarget.style.opacity = "0.6";
            e.currentTarget.style.transform = "scale(0.98)";
          }}
          onDragEnd={(e) => {
            // ✅ Khi thả xong thì phục hồi lại style
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "none";
          }}
        >
          {/* Cột bên trái: thumbnail + info */}
          <Box
            className="flex items-center gap-3 cursor-pointer flex-1"
            onClick={() => onPlay(file.url)}
          >
            <img
              src={
                file.thumbnail ||
                "https://via.placeholder.com/280x180?text=No+Thumbnail"
              }
              className="w-40 h-24 object-cover rounded"
              alt={file.title}
            />
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {file.title}
              </Typography>
              <Box className="flex gap-3 mt-1 text-sm">
                <Chip size="small" label={file.theory || "—"} variant="outlined" />
                <Chip size="small" label={file.grammar || "—"} color="primary" />
              </Box>
              <Typography variant="caption" color="text.secondary">
                👁 {file.views?.toLocaleString() ?? 0} lượt xem
              </Typography>
            </Box>
          </Box>

          {/* Cột bên phải: hành động */}
          <Box className="flex gap-2">
            <Button variant="outlined" size="small" startIcon={<Edit />}>
              Sửa
            </Button>
            <IconButton onClick={onMenu}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Paper>
  );
}
