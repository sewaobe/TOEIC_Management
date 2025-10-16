import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Close,
  ExpandMore,
  VolumeUp,
  Image as ImageIcon,
  Translate,
  TextSnippet,
  Edit,
  Delete,
  Label,
  Timer,
  ZoomIn,
} from "@mui/icons-material";
import groupService from "../../../../services/group.service";
import { Group } from "../../../../types/group";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  open: boolean;
  groupId: string | null;
  onClose: () => void;
  onDeleted?: () => void;
  readOnly?: boolean; // ✅ thêm prop để dùng trong chế độ chỉ xem
}

export default function GroupDetailModal({
  open,
  groupId,
  onClose,
  onDeleted,
  readOnly = false, // ✅ mặc định là false (bình thường)
}: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // 🔍 preview ảnh lớn

  // ===== Fetch group theo ID =====
  useEffect(() => {
    if (!groupId) return;
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const res = await groupService.getById(groupId);
        if (res.success && res.data) setGroup(res.data as Group);
        else toast.error("Không thể tải nhóm câu hỏi.");
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải nhóm câu hỏi.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupId]);

  // ===== Handler =====
  const handleEdit = () => {
    if (!groupId) return;
    navigate(`/ctv/questions/${groupId}/edit`);
    onClose();
  };

  const handleDelete = async () => {
    if (!groupId) return;
    try {
      await groupService.delete(groupId);
      toast.success("Xóa nhóm câu hỏi thành công!");
      onClose();
      onDeleted?.();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa nhóm câu hỏi.");
    }
  };

  // ===== Theme colors =====
  const bgTranscript =
    theme.palette.mode === "light"
      ? "#EFF6FF"
      : theme.palette.info.light + "33";
  const bgTranslation =
    theme.palette.mode === "light"
      ? "#ECFDF5"
      : theme.palette.success.light + "33";
  const bgCorrect =
    theme.palette.mode === "light"
      ? "#ECFDF5"
      : theme.palette.success.light + "33";
  const bgExplain =
    theme.palette.mode === "light"
      ? "#FEF3C7"
      : theme.palette.warning.light + "33";

  // ===== Render =====
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: theme.palette.background.default,
            boxShadow: 6,
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary">
            Chi tiết nhóm câu hỏi
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        {/* Nội dung */}
        <DialogContent
          dividers
          sx={{ maxHeight: "80vh", overflowY: "auto", p: 3 }}
        >
          {loading ? (
            <Box className="flex justify-center py-10">
              <CircularProgress />
            </Box>
          ) : !group ? (
            <Typography align="center" color="text.secondary">
              Không tìm thấy nhóm câu hỏi.
            </Typography>
          ) : (
            <Box>
              {/* ===== Audio ===== */}
              {group.audioUrl && (
                <Box mb={3}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <VolumeUp color="primary" />
                    <Typography fontWeight="bold">Audio</Typography>
                  </Box>
                  <audio
                    controls
                    src={group.audioUrl.url}
                    style={{ width: "100%" }}
                  />
                </Box>
              )}

              {/* ===== Hình ảnh ===== */}
              {group.imagesUrl?.length > 0 && (
                <Box mb={3}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <ImageIcon color="primary" />
                    <Typography fontWeight="bold">Hình ảnh</Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {group.imagesUrl.map((img, i) => (
                      <Box
                        key={i}
                        sx={{
                          position: "relative",
                          cursor: "pointer",
                          borderRadius: 2,
                          overflow: "hidden",
                          "&:hover .overlay": {
                            opacity: 1,
                          },
                        }}
                        onClick={() => setPreviewImage(img.url)} // ✅ click mở ảnh to
                      >
                        <img
                          src={img.url}
                          alt={`img-${i}`}
                          style={{
                            width: 180,
                            height: 130,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        />
                        <Box
                          className="overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(0,0,0,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s",
                          }}
                        >
                          <ZoomIn sx={{ color: "white" }} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* ===== Transcript ===== */}
              {(group.transcriptEnglish || group.transcriptTranslation) && (
                <Box mb={3}>
                  {group.transcriptEnglish && (
                    <Accordion sx={{ mb: 1, bgcolor: bgTranscript }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <TextSnippet color="info" fontSize="small" />
                          <Typography fontWeight="bold">
                            Transcript (English)
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {group.transcriptEnglish}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {group.transcriptTranslation && (
                    <Accordion sx={{ bgcolor: bgTranslation }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Translate color="success" fontSize="small" />
                          <Typography fontWeight="bold">
                            Bản dịch (Translation)
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {group.transcriptTranslation}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Box>
              )}

              {/* ===== Questions ===== */}
              {group.questions?.length > 0 &&
                group.questions.map((q, idx) => (
                  <Card key={q.id || idx} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography fontWeight="bold" sx={{ mb: 1 }}>
                        {q.name || `Câu ${idx + 1}`}: {q.textQuestion}
                      </Typography>

                      <Grid container spacing={1} sx={{ mb: 1 }}>
                        {Object.entries(q.choices).map(([key, val]) => (
                          <Grid size={{ xs: 12, sm: 6 }} key={key}>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 1.5,
                                bgcolor:
                                  key === q.correctAnswer
                                    ? bgCorrect
                                    : theme.palette.background.paper,
                                borderColor:
                                  key === q.correctAnswer
                                    ? theme.palette.success.main
                                    : theme.palette.divider,
                              }}
                            >
                              <Typography variant="body2">
                                <strong>{key}.</strong> {val}
                                {key === q.correctAnswer && (
                                  <Chip
                                    label="Đúng"
                                    size="small"
                                    sx={{
                                      ml: 1,
                                      bgcolor: theme.palette.success.main,
                                      color: "#fff",
                                    }}
                                  />
                                )}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>

                      {q.explanation && (
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            mb: 1,
                            bgcolor: bgExplain,
                            borderColor: theme.palette.warning.main,
                          }}
                        >
                          <Typography fontWeight="bold" color="warning.main">
                            Giải thích:
                          </Typography>
                          <Typography variant="body2">
                            {q.explanation}
                          </Typography>
                        </Paper>
                      )}

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {q.planned_time > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Timer fontSize="small" color="action" />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {q.planned_time}s
                            </Typography>
                          </Box>
                        )}
                        {q.tags?.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              flexWrap: "wrap",
                            }}
                          >
                            {q.tags.map((tag, tIdx) => (
                              <Chip
                                key={tIdx}
                                label={tag}
                                variant="outlined"
                                size="small"
                                icon={<Label fontSize="small" />}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          )}
        </DialogContent>

        {/* Footer (ẩn khi readOnly) */}
        {!readOnly && (
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              startIcon={<Edit />}
              onClick={handleEdit}
              variant="outlined"
              color="primary"
            >
              Sửa
            </Button>
            <Button
              startIcon={<Delete />}
              onClick={() => setConfirmDelete(true)}
              variant="contained"
              color="error"
            >
              Xóa
            </Button>
          </DialogActions>
        )}

        {/* Xác nhận xóa (ẩn khi readOnly) */}
        {!readOnly && (
          <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogContent>
              <Typography>
                Bạn có chắc muốn xóa nhóm câu hỏi này không? Hành động này không
                thể hoàn tác.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDelete(false)}>Hủy</Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Xóa
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Dialog>

      {/* 🔍 Dialog xem ảnh lớn */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.9)",
            borderRadius: 2,
            p: 0,
          },
        }}
      >
        <IconButton
          onClick={() => setPreviewImage(null)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
            zIndex: 10,
          }}
        >
          <Close />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <img
            src={previewImage || ""}
            alt="preview"
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: 8,
              objectFit: "contain",
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
