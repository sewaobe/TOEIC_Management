import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import { Close, Headphones, PlayArrow } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ShadowingDetailDialog({
  open,
  onClose,
  shadowing,
}: {
  open: boolean;
  onClose: () => void;
  shadowing: any;
}) {
  const theme = useTheme();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const title = shadowing?.title ?? "";
  const level = shadowing?.level ?? "";
  const part_type = shadowing?.part_type ?? "";
  const audio_url = shadowing?.audio_url ?? "";
  const timings = shadowing?.timings ?? [];
  const transcript = shadowing?.transcript ?? "";
  const duration = shadowing?.duration ?? 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !timings?.length) return;

    const updateTime = () => {
      const current = audio.currentTime * 1000;
      const idx = timings.findIndex(
        (s: any) => current >= s.startTime && current < s.endTime
      );
      setActiveIdx(idx >= 0 ? idx : null);
    };
    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, [timings]);

  if (!shadowing)
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Không có dữ liệu shadowing</DialogTitle>
        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[6],
        },
        component: motion.div,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.25 },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1E3A8A, #1E40AF)"
              : "linear-gradient(135deg, #2563EB, #1E40AF)",
          color: "white",
          py: 2.5,
        }}
      >
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Headphones fontSize="small" sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Level {level || "A1"} • Part {part_type || "?"} •{" "}
                {duration ? `${Math.floor(duration / 1000)} giây` : "—"}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Nội dung */}
      <DialogContent sx={{ py: 4, px: 4 }}>
        {/* Audio Player */}
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(145deg, #1E293B, #111827)"
                : "linear-gradient(to right, #EEF2FF, #F5F7FF)",
          }}
        >
          {audio_url ? (
            <audio ref={audioRef} controls src={audio_url} className="w-full" />
          ) : (
            <Typography color="text.secondary">
              Không có file audio được cung cấp.
            </Typography>
          )}
        </Paper>

        {/* Danh sách thời gian và đoạn thoại */}
        <Stack spacing={2}>
          {timings?.length ? (
            timings.map((s: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  if (audioRef.current)
                    audioRef.current.currentTime = s.startTime / 1000;
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    backgroundColor:
                      activeIdx === i
                        ? theme.palette.mode === "dark"
                          ? "rgba(37,99,235,0.15)"
                          : "#DBEAFE"
                        : theme.palette.background.paper,
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(37,99,235,0.1)"
                          : "#EFF6FF",
                    },
                  }}
                >
                  <Box className="flex justify-between items-start">
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={activeIdx === i ? 700 : 500}
                        color={
                          activeIdx === i ? "primary.main" : "text.primary"
                        }
                      >
                        {s.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.floor(s.startTime / 1000)}s →{" "}
                        {Math.floor(s.endTime / 1000)}s
                      </Typography>
                    </Box>
                    <Chip
                      icon={<PlayArrow fontSize="small" />}
                      label={`#${i + 1}`}
                      color={activeIdx === i ? "primary" : "default"}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Paper>
              </motion.div>
            ))
          ) : (
            <Typography color="text.secondary">
              Không có dữ liệu transcript hoặc timings.
            </Typography>
          )}
        </Stack>

        {/* Transcript gốc */}
        {transcript && (
          <Paper
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 3,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              📘 Văn bản gốc
            </Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                color: theme.palette.text.primary,
                lineHeight: 1.6,
              }}
            >
              {transcript}
            </Typography>
          </Paper>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ fontWeight: 600 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
