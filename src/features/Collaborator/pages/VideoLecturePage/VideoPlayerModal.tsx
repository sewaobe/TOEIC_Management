import { Box, Typography, Button } from "@mui/material";

interface Props {
  url: string | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ url, onClose }: Props) {
  if (!url) return null;

  return (
    <Box className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Box className="bg-white rounded-lg p-4 max-w-3xl w-full shadow-lg animate-fadeIn">
        <Box className="flex justify-between items-center mb-2">
          <Typography variant="subtitle1" fontWeight={600}>
            Đang phát video
          </Typography>
          <Button onClick={onClose} color="error">
            Đóng
          </Button>
        </Box>
        <iframe
          width="100%"
          height="400"
          src={url.replace("youtu.be/", "www.youtube.com/embed/").replace("watch?v=", "embed/")}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-md"
        ></iframe>
      </Box>
    </Box>
  );
}
