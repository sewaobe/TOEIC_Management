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
        <Box key={file.id} className="flex items-center justify-between border-b p-3">
          <Box className="flex items-center gap-3 cursor-pointer" onClick={() => onPlay(file.url)}>
            <img
              src={file.thumbnail || "https://via.placeholder.com/280x180?text=No+Thumbnail"}
              className="w-40 h-24 object-cover rounded"
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
