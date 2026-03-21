import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Paper,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Close,
  Description,
  Chat,
  ErrorOutline,
  Image,
  TableChart,
  Movie,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { EmptyState } from "../../../../../../components/EmptyState";

interface LessonSection {
  id: string;
  title: string;
  type: "text" | "example" | "error" | "media" | "table";
  content?: string;
  example?: { en: string; vi: string; note?: string };
  error?: { wrong: string; correct: string; explanation?: string };
  mediaUrl?: string;
  tableData?: string[][];
}

interface LessonPreviewProps {
  open: boolean;
  onClose: () => void;
  lesson: { title: string; summary: string; sections: LessonSection[] };
}

export default function LessonPreviewDialog({
  open,
  onClose,
  lesson,
}: LessonPreviewProps) {
  const theme = useTheme();

  const fade = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Description color="primary" />;
      case "example":
        return <Chat color="secondary" />;
      case "error":
        return <ErrorOutline color="error" />;
      case "media":
        return <Movie color="info" />;
      case "table":
        return <TableChart color="success" />;
      default:
        return <Image color="disabled" />;
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const isImageUrl = (url: string) =>
    url && /\.(jpeg|jpg|gif|png|svg)$/i.test(url);

  const renderSection = (section: LessonSection) => {
    switch (section.type) {
      case "text":
        return (
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {section.content}
          </Typography>
        );
      case "example":
        return (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : theme.palette.grey[50],
            }}
          >
            <Typography>
              <strong>EN:</strong> {section.example?.en}
            </Typography>
            <Typography>
              <strong>VI:</strong> {section.example?.vi}
            </Typography>
            {section.example?.note && (
              <Typography variant="caption" color="text.secondary">
                <em>Note: {section.example.note}</em>
              </Typography>
            )}
          </Paper>
        );
      case "error":
        return (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderLeft: `4px solid ${theme.palette.error.main}`,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : theme.palette.background.paper,
            }}
          >
            <Typography color="error" fontWeight={600}>
              Sai: {section.error?.wrong}
            </Typography>
            <Typography color="success.main" fontWeight={600}>
              Đúng: {section.error?.correct}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Giải thích: {section.error?.explanation || "—"}
            </Typography>
          </Paper>
        );
      case "media": {
        const embedUrl = getYouTubeEmbedUrl(section.mediaUrl || "");
        if (embedUrl)
          return (
            <Box
              component="iframe"
              src={embedUrl}
              allowFullScreen
              sx={{
                width: "100%",
                height: 320,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          );
        if (isImageUrl(section.mediaUrl || ""))
          return (
            <Box
              component="img"
              src={section.mediaUrl}
              sx={{
                width: "100%",
                maxHeight: 320,
                objectFit: "contain",
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          );
        return (
          <Typography color="text.secondary">
            Không thể hiển thị media từ URL này.
          </Typography>
        );
      }
      case "table":
        return (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Table size="small">
              <TableBody>
                {section.tableData?.map((row, rIdx) => (
                  <TableRow key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <TableCell
                        key={cIdx}
                        sx={{
                          fontWeight: rIdx === 0 ? 600 : "normal",
                          borderColor: theme.palette.divider,
                        }}
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      default:
        return null;
    }
  };

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
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {lesson.title}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {lesson.summary || "Không có mô tả."}
        </Typography>
      </DialogTitle>

      {/* Nội dung */}
      <DialogContent sx={{ py: 3, px: 4 }}>
        {lesson.sections?.length ? (
          <Stack spacing={3}>
            {lesson.sections.map((section, idx) => (
              <motion.div key={section.id || idx} {...fade}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.04)"
                        : theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[1],
                    "&:hover": {
                      boxShadow: theme.shadows[3],
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                    {getIcon(section.type)}
                    <Typography variant="subtitle1" fontWeight={600}>
                      {section.title}
                    </Typography>
                  </Box>
                  {renderSection(section)}
                </Paper>
              </motion.div>
            ))}
          </Stack>
        ) : (
          <EmptyState
            mode="empty"
            title="Chưa có section nào"
            description="Hãy thêm nội dung cho bài học này."
          />
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
