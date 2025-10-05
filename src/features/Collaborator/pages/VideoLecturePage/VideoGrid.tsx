import { Box, Paper, Typography, Chip, Button, IconButton } from "@mui/material";
import { Edit, MoreVert, PlayArrow, Delete } from "@mui/icons-material";
import { VideoFile } from "./VideoLecturePageContent";

interface Props {
  files: VideoFile[];
  onPlay: (url: string) => void;
  onMenu: (e: React.MouseEvent<HTMLElement>) => void;
  onEdit: (video: VideoFile) => void;
  onDelete: (video: VideoFile) => void;
}

export default function VideoGrid({ files, onPlay, onMenu, onEdit, onDelete }: Props) {
  return (
    <Box className="flex flex-wrap gap-4 justify-start">
      {files.map((file) => (
        <Paper
          key={file.id}
          className="rounded-xl border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white flex flex-col"
          sx={{ width: 280, flexShrink: 0 }}
        >
          {/* Thumbnail */}
          <Box className="relative cursor-pointer group overflow-hidden" onClick={() => onPlay(file.url)}>
            <img
              src={file.thumbnail || "https://via.placeholder.com/280x180?text=No+Thumbnail"}
              alt={file.title}
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <Box className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {file.duration || "--:--"}
            </Box>
            <Box className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <PlayArrow fontSize="large" className="text-white" />
            </Box>
          </Box>

          {/* Nội dung */}
          <Box className="p-4 space-y-2 flex-1">
            <Typography variant="subtitle1" fontWeight={600}>
              {file.title}
            </Typography>
            <Box className="flex items-center gap-2 text-sm">
              📖 <Chip size="small" label={file.theory || "—"} variant="outlined" />
            </Box>
            <Box className="flex items-center gap-2 text-sm">
              🎓 <Chip size="small" label={file.grammar || "—"} color="primary" />
            </Box>
            <Box className="flex justify-between items-center text-xs text-gray-500 mt-2">
              <span>👁 {file.views?.toLocaleString() ?? 0} lượt xem</span>
              <Chip size="small" label={file.level || "—"} variant="outlined" />
            </Box>
          </Box>

          {/* Footer */}
          <Box className="flex justify-between items-center px-3 pb-3 gap-2">
            <Button
              fullWidth
              size="small"
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => onEdit(file)} // ✅ mở modal edit
            >
              Sửa
            </Button>
            <IconButton color="error" onClick={() => onDelete(file)}>
              <Delete />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
