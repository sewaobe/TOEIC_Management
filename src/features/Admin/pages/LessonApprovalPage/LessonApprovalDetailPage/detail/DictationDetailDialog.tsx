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
import { Close, Description, PlayArrow } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function DictationDetailDialog({
  open,
  onClose,
  dictation,
}: {
  open: boolean;
  onClose: () => void;
  dictation: any;
}) {
  const theme = useTheme();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ Lấy dữ liệu an toàn
  const title = dictation?.title ?? "";
  const level = dictation?.level ?? "";
  const part_type = dictation?.part_type ?? "";
  const audio_url = dictation?.audio_url ?? "";
  const timings = dictation?.timings ?? [];
  const transcript = dictation?.transcript ?? "";
  const duration = dictation?.duration ?? 0;

  // 🎧 Xác định đoạn đang chạy
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !timings?.length) return;

    const onTime = () => {
      const cur = audio.currentTime * 1000;
      const idx = timings.findIndex(
        (s: any) => cur >= s.startTime && cur < s.endTime
      );
      setActiveIdx(idx >= 0 ? idx : null);
    };

    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, [timings]);

  // ❌ Fallback khi không có dữ liệu
  if (!dictation)
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Không có dữ liệu dictation</DialogTitle>
        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    );

  // 💎 UI chính
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
          backgroundImage:
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, rgba(30,30,30,0.9), rgba(45,45,45,0.9))"
              : "linear-gradient(145deg, #FAFAFA, #FFFFFF)",
          boxShadow: theme.shadows[6],
        },
        component: motion.div,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.25 },
      }}
    >
      {/* 🎧 Header */}
      <DialogTitle
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #047857, #065F46)"
              : "linear-gradient(135deg, #10B981, #047857)",
          color: "white",
          py: 2.5,
        }}
      >
        <Box className="flex justify-between items-center">
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
              <Description fontSize="small" sx={{ color: "white" }} />
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

      {/* 🎵 Nội dung */}
      <DialogContent sx={{ py: 4, px: 4 }}>
        {/* Audio player */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(145deg, #1E293B, #111827)"
                : "linear-gradient(to right, #ECFDF5, #D1FAE5)",
          }}
        >
          {audio_url ? (
            <audio ref={audioRef} controls src={audio_url} style={{ width: "100%" }} />
          ) : (
            <Typography color="text.secondary">
              Không có file audio được cung cấp.
            </Typography>
          )}
        </Paper>

        {/* Danh sách các đoạn transcript */}
        <Stack spacing={2}>
          {timings?.length ? (
            timings.map((seg: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  if (audioRef.current)
                    audioRef.current.currentTime = seg.startTime / 1000;
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                    borderLeft: `4px solid ${theme.palette.success.main}`,
                    backgroundColor:
                      activeIdx === i
                        ? theme.palette.mode === "dark"
                          ? "rgba(16,185,129,0.15)"
                          : "#D1FAE5"
                        : theme.palette.background.paper,
                    transition: "all 0.25s",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(16,185,129,0.1)"
                          : "#ECFDF5",
                    },
                  }}
                >
                  <Box className="flex justify-between items-start">
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={activeIdx === i ? 700 : 500}
                        color={
                          activeIdx === i ? "success.main" : "text.primary"
                        }
                      >
                        {seg.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.floor(seg.startTime / 1000)}s →{" "}
                        {Math.floor(seg.endTime / 1000)}s
                      </Typography>
                    </Box>
                    <Chip
                      icon={<PlayArrow fontSize="small" />}
                      label={`#${i + 1}`}
                      color={activeIdx === i ? "success" : "default"}
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

        {/* Văn bản hoàn chỉnh */}
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
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              📘 Văn bản hoàn chỉnh
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
        <Button variant="contained" color="success" onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
